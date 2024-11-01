import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { MovementRegisterProps } from "../navigation";
import { apiInstance, isOk } from "../requests";
import { customAlertError, customAlertSuccess } from "../utils";
import { Branch } from "../types";

type Movement = {
  originBranchId: string;
  destinationBranchId: string;
  productId: string;
  quantity: string;
  motorista: string;
};

export function MovementRegisterScreen({ navigation }: MovementRegisterProps) {
  const [movement, setMovement] = useState<Movement>({
    originBranchId: "",
    destinationBranchId: "",
    productId: "",
    quantity: "",
    motorista: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await apiInstance.get("/branches/options");
        setBranches(response.data);
      } catch (error) {
        console.error("Erro ao buscar filiais:", error);
      }
    };
    fetchBranches();
  }, []);

  const handleSubmit = async () => {
    if (
      !movement.originBranchId || !movement.destinationBranchId ||
      !movement.productId || !movement.quantity || !movement.motorista
    ) {
      customAlertError("Por favor, preencha todos os campos.");
      return;
    }
    const quantityNumber = Number(movement.quantity);

    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      customAlertError(
        "A quantidade deve ser um número válido maior que zero.",
      );

      return;
    }

    try {
      const createResponse = await apiInstance.post("/movements", movement);
      if (createResponse.status === 201) {
        customAlertSuccess("Movimentação criada com sucesso!");
        const movementId = createResponse.data.id;

        if (selectedImage) {
          const formData = new FormData();
          formData.append("file", {
            uri: selectedImage,
            name: "image.jpg",
            type: "image/jpeg",
          } as any);
          formData.append("motorista", movement.motorista);

          const startResponse = await apiInstance.put(
            `/movements/${movementId}/start`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            },
          );

          if (isOk(startResponse.status)) {
            customAlertSuccess("Movimentação iniciada com sucesso!");
            setSelectedImage(null);
          } else {
            customAlertError(
              "Falha ao iniciar a movimentação. Tente novamente.",
            );
          }
        }

        navigation.navigate("MovementList");
      } else {
        customAlertError(
          "Não foi possível criar a movimentação. Tente novamente.",
        );
      }
    } catch (error) {
      console.error("Erro ao criar movimentação:", error);
      customAlertError(
        "Não foi possível criar a movimentação. Verifique os dados e tente novamente.",
      );
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker
      .launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

    if (result.canceled || !result.assets.length) {
      return;
    }

    setSelectedImage(result.assets[0].uri);
  };

  return (
    <View style={styles.formContainer}>
      <Picker
        selectedValue={movement.originBranchId}
        onValueChange={(itemValue) =>
          setMovement({ ...movement, originBranchId: itemValue })}
        style={styles.picker}
        itemStyle={{ height: 50 }}
      >
        <Picker.Item label="Selecione a Filial de Origem" value="" />
        {branches.map((branch) => (
          <Picker.Item key={branch.id} label={branch.name} value={branch.id} />
        ))}
      </Picker>

      <Picker
        itemStyle={{ height: 50 }}
        selectedValue={movement.destinationBranchId}
        onValueChange={(itemValue) =>
          setMovement({ ...movement, destinationBranchId: itemValue })}
        style={styles.picker}
      >
        <Picker.Item label="Selecione a Filial de Destino" value="" />
        {branches.map((branch) => (
          <Picker.Item key={branch.id} label={branch.name} value={branch.id} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="ID do produto"
        value={movement.productId}
        onChangeText={(text) => setMovement({ ...movement, productId: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={movement.quantity}
        keyboardType="numeric"
        onChangeText={(text) => setMovement({ ...movement, quantity: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Nome do motorista"
        value={movement.motorista}
        onChangeText={(text) => setMovement({ ...movement, motorista: text })}
      />
      <Button title="Selecionar Imagem" onPress={handleImagePick} />
      <Button title="Criar Movimentação" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
});
