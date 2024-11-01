import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { apiInstance, isCreated, isOk } from "../requests";
import { customAlert, customAlertError, customAlertSuccess } from "../utils";
import { SafeAreaView } from "react-native-safe-area-context";

type Movement = {
  id: string;
  status: string;
  originBranchId: string;
  destinationBranchId: string;
  productId: string;
  quantity: string;
  motorista: string;
  produto: {
    nome: string;
    imagem: string;
  };
  quantidade: number;
  origem: {
    nome: string;
  };
  destino: {
    nome: string;
  };
};

type Branch = {
  id: string;
  name: string;
};

const validateMovement = (movement?: Movement | null): boolean => {
  if (!movement) {
    return false;
  }

  if (
    !movement.originBranchId || !movement.destinationBranchId ||
    !movement.productId || !movement.quantity ||
    !movement.motorista
  ) {
    return false;
  }

  const quantityNumber = Number(movement.quantity);

  if (isNaN(quantityNumber) || quantityNumber <= 0) {
    return false;
  }

  return true;
};

const emptyMovement: Movement = {
  id: "",
  status: "",
  originBranchId: "",
  destinationBranchId: "",
  productId: "",
  quantity: "",
  motorista: "",
  produto: {
    nome: "",
    imagem: "",
  },
  quantidade: 0,
  origem: {
    nome: "",
  },
  destino: {
    nome: "",
  },
};

export default function MovementScreen() {
  const [movement, setMovement] = useState<Movement>(emptyMovement);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(
    null,
  );
  const [branches, setBranches] = useState<Branch[]>([]);

  const fetchBranchesAndMovements = async () => {
    // Função para buscar filiais e listar movimentações
    try {
      const branchResponse = await apiInstance.get<Branch[]>(
        "/branches/options",
      );
      setBranches(branchResponse.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const fetchMovements = async () => {
    // Função para atualizar as movimentações
    try {
      const response = await apiInstance.get<Movement[]>("/movements");
      setMovements(response.data);
    } catch (error) {
      customAlertError("Erro ao buscar movimentações.");
      console.error("Erro ao buscar movimentações:", error);
    }
  };

  useEffect(() => {
    fetchBranchesAndMovements();
    fetchMovements();
  }, []);

  // Função para lidar com a finalização da entrega
  const handleEndDelivery = async (id: string) => {
    if (!selectedImageUri) {
      return customAlert("Erro", "Por favor, selecione uma imagem.");
    }

    const formData = new FormData();
    formData.append("file", {
      uri: selectedImageUri,
      name: "image.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await apiInstance.put(`/movements/${id}/end`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        customAlert("Sucesso", "Entrega finalizada com sucesso!");
        fetchMovements(); // Atualiza a lista após a finalização
      } else {
        customAlert("Erro", "Falha ao finalizar a entrega.");
      }
    } catch (error) {
      console.error("Erro ao finalizar entrega:", error);
      customAlert("Erro", "Não foi possível finalizar a entrega.");
    }
  };

  // Função para lidar com a criação de movimentação
  const handleSubmit = async () => {
    if (!validateMovement(movement)) {
      return customAlertError("Preencha todos os campos corretamente.");
    }

    if (!movement) {
      return;
    }

    try {
      const createResponse = await apiInstance.post("/movements", movement);

      // 201 Created
      if (isCreated(createResponse.status)) {
        customAlertSuccess("Movimentação criada com sucesso!");
        const movementId = createResponse.data.id;

        if (selectedImageUri) {
          const formData = new FormData();
          // image e eh pra file
          formData.append('file', {
            uri: selectedImageUri,
            name: 'file.jpg',
            type: 'image/jpeg',
          } as any);

          const driverName = "TODO Change driver name";

          formData.append("motorista", driverName);
          const reqUrl = `/movements/${movementId}/start`;

          const startResponse = await apiInstance.put(reqUrl, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (isOk(startResponse.status)) {
            setSelectedImageUri(null);
            setMovement(emptyMovement);
            customAlertSuccess("Movimentação iniciada com sucesso!");
            fetchMovements(); // Atualiza a lista de movimentações após criar uma nova
          } else {
            customAlertError(
              "Falha ao iniciar a movimentação. Tente novamente.",
            );
          }
        }
      } else {
        customAlertError(
          "Não foi possível criar a movimentação. Tente novamente.",
        );
      }
    } catch (error) {
      console.error(error);
      customAlertError(
        "Não foi possível criar a movimentação. Verifique os dados e tente novamente.",
      );
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync();

      if (!result.canceled) {
        setSelectedImageUri(result.assets[0].uri);
      }
    } catch (error) {
      customAlertError("Unable to pick image: " + error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { height: '100%' }]}>
        {/* Listagem de Movimentações */}
        <View style={styles.listContainer}>
          <Text style={styles.title}>Lista de Movimentações</Text>
          {movements.map((movementItem) => (
            <View
              key={movementItem.id}
              style={[
                styles.movementItem,
                movementItem.status === "Em Trânsito"
                  ? styles.inTransit
                  : styles.created,
              ]}
            >
              <Text>
                Produto Nome: {movementItem.produto?.nome ?? "Não disponível"}
              </Text>
              <Text>ID da Movimentação: {movementItem.id}</Text>
              {movementItem.status === "Em Trânsito" && (
                <>
                  <Text>Quantidade: {movementItem.quantidade}</Text>
                  <Text>Origem: {movementItem.origem?.nome}</Text>
                  <Text>Destino: {movementItem.destino?.nome}</Text>
                  <Text>Status: {movementItem.status}</Text>
                </>
              )}
              {movementItem.produto?.imagem && (
                <Image
                  source={{ uri: movementItem.produto.imagem }}
                  style={styles.image}
                />
              )}
              {movementItem.status === "Em Trânsito" && (
                <Button
                  title="Finalizar Entrega"
                  onPress={() => handleEndDelivery(movementItem.id)}
                />
              )}
              {movementItem.status === "Created" && (
                <Button
                  title="Iniciar Entrega"
                  onPress={() => handleEndDelivery(movementItem.id)}
                />
              )}
            </View>
          ))}
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Criar Movimentação</Text>
          <View
            style={{
              height: 50,
              borderWidth: 1,
              borderColor: "#000",
              marginBottom: 10
            }}
          >
            <Picker
              itemStyle={{ height: 50 }}
              selectedValue={movement.originBranchId}
              onValueChange={(itemValue) =>
                setMovement({ ...movement, originBranchId: itemValue })}
            >
              <Picker.Item label="Selecione a Filial de Origem" value="" />
              {branches.map((branch) => (
                <Picker.Item
                  key={branch.id}
                  label={branch.name}
                  value={branch.id}
                />
              ))}
            </Picker>
          </View>
          <View
            style={{
              height: 50,
              borderWidth: 1,
              borderColor: "#000",
              marginBottom: 10
            }}
          >
            <Picker
              itemStyle={{ height: 50 }}
              selectedValue={movement.destinationBranchId}
              onValueChange={(itemValue) =>
                setMovement({ ...movement, destinationBranchId: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="Selecione a Filial de Destino" value="" />
              {branches.map((branch) => (
                <Picker.Item
                  key={branch.id}
                  label={branch.name}
                  value={branch.id}
                />
              ))}
            </Picker>
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder="ID do Produto"
              value={movement.productId}
              onChangeText={(text) =>
                setMovement({ ...movement, productId: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              value={movement.quantity}
              keyboardType="numeric"
              onChangeText={(text) =>
                setMovement({ ...movement, quantity: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Nome do Motorista"
              value={movement.motorista}
              onChangeText={(text) =>
                setMovement({ ...movement, motorista: text })}
            />
            <Button title="Selecionar Imagem" onPress={handleImagePick} />
          </View>
          {selectedImageUri && (
            <Image source={{ uri: selectedImageUri }} style={styles.image} />
          )}
        </View>
        {!movement && <Text>Carregando...</Text>}
        <View style={{ marginBottom: 100 }}>
          <Button title="Criar Movimentação" onPress={handleSubmit} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, },
  listContainer: { marginBottom: 20 },
  formContainer: { marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  movementItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  inTransit: { backgroundColor: "#d0e9ff" },
  created: { backgroundColor: "#fff3cd" },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 5,
  },
  picker: { height: 50, marginBottom: 10 },
  image: { width: 100, height: 100, marginVertical: 10 },
});
