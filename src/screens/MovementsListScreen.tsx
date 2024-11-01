import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { API_URL } from "../constants";
import { customAlertError, customAlertSuccess } from "../utils";
import { MovementsListScreenProps } from "../navigation";
import { apiInstance, isOk } from "../requests";

type Movement = {
  item: {
    id: string;
    produto: {
      nome: string;
      imagem: string;
    };
    quantidade: number;
    origem: {
      nome: string;
      latitude: number;
      longitude: number;
    };
    destino: {
      nome: string;
      latitude: number;
      longitude: number;
    };
    status: string;
  };
};

const MovementsListScreen = ({ navigation }: MovementsListScreenProps) => {
  const [movements, setMovements] = useState([]);

  const fetchMovements = async () => {
    try {
      const response = await fetch(`${API_URL}/movements`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar movimentações");
      }

      setMovements(data);
    } catch (error) {
      console.error("Erro ao buscar movimentações:", error);
      customAlertError("Erro ao buscar movimentações");
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  const handleImagePicker = async (movementId: string, action: "start" | "end") => {
    try {
      console.log("Iniciando captura de imagem...");

      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        return customAlertError(
          "Permissão de câmera necessária para capturar a imagem.",
        );
      }

      const result = await ImagePicker.launchCameraAsync();
      if (result.canceled || !result.assets?.length) {
        return;
      }

      const formData = new FormData();
      // image e eh pra file
      formData.append('file', {
        uri: result.assets[0].uri,
        name: 'file.jpg',
        type: 'image/jpeg',
      } as any);

      const driverName = "TODO Change driver name";

      formData.append("motorista", driverName);

      const response = await apiInstance.put(`/movements/${movementId}/${action}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      );

      if (isOk(response.status)) {
        customAlertSuccess("Imagem enviada com sucesso!");
        await fetchMovements();
      }
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      customAlertError("Não foi possível enviar a imagem. Tente novamente.");
    }
  };

  const renderItem = ({ item }: Movement) => {
    return (
      <View style={[styles.movementCard, getCardStyle(item.status)]}>
        <Image
          source={{ uri: item.produto.imagem }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <Text style={styles.movementText}>ID: {item.id}</Text>
        <Text style={styles.movementText}>Produto: {item.produto.nome}</Text>
        <Text style={styles.observationText}>Quantidade: {item.quantidade}</Text>
        <Text style={styles.observationText}>Origem: {item.origem.nome}</Text>
        <Text style={styles.observationText}>Destino: {item.destino.nome}</Text>
        <Text style={styles.observationText}>Status: {item.status}</Text>

        {item.status === "created" && (
          <Button
            title="Iniciar Entrega"
            onPress={() => handleImagePicker(item.id, "start")}
          />
        )}
        {item.status === "em transito" && (
          <View style={styles.buttonContainer}>
            <Button
              title="Finalizar Entrega"
              onPress={() => handleImagePicker(item.id, "end")}
            />
            <Button title="Ver Mapa"

              onPress={() =>
                navigation.navigate("Map", {
                  origem: item.origem,
                  destino: item.destino
                })}
            />
          </View>
        )}
        {item.status === "coleta finalizada" && (
          <Button title="Ver Mapa"

            onPress={() =>
              navigation.navigate("Map", {
                origem: item.origem,
                destino: item.destino,
              })}
          />
        )}
      </View>
    );
  }

  const getCardStyle = (status: string) => {
    switch (status) {
      case "created":
        return styles.created;
      case "em transito":
        return styles.inTransit;
      case "coleta finalizada":
        return styles.collectionFinished;
      default:
        return {};
    }
  };

  return (
    <FlatList
      data={movements}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      refreshing={false}
      onRefresh={fetchMovements}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  movementCard: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  productImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  movementText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  observationText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  buttonContainer: {
    marginTop: 10,
    gap: 10,
  },
  created: {
    backgroundColor: "#F5F5F5",
  },
  inTransit: {
    backgroundColor: "#FFE4E1",
  },
  collectionFinished: {
    backgroundColor: "#E0FFFF",
  },
});

export default MovementsListScreen;
