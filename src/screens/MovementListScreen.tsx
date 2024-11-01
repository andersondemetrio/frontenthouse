import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const api = axios.create({
  baseURL: 'http://192.168.15.8:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function MovementScreen() {
  const [movement, setMovement] = useState({
    originBranchId: '',
    destinationBranchId: '',
    productId: '',
    quantity: '',
    motorista: '',
  });
  const [movements, setMovements] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [branches, setBranches] = useState([]);

  // Função para buscar filiais e listar movimentações
  useEffect(() => {
    const fetchBranchesAndMovements = async () => {
      try {
        const branchResponse = await api.get('/branches/options');
        setBranches(branchResponse.data);

        const movementResponse = await api.get('/movements');
        setMovements(movementResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchBranchesAndMovements();
  }, []);

  // Função para atualizar as movimentações
  const fetchMovements = async () => {
    try {
      const response = await api.get('/movements');
      setMovements(response.data);
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error);
    }
  };

  // Função para lidar com a finalização da entrega
  const handleEndDelivery = async (id) => {
    if (!selectedImage) {
      Alert.alert('Erro', 'Por favor, selecione uma imagem.');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: selectedImage,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await api.put(`/movements/${id}/end`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        Alert.alert('Sucesso', 'Entrega finalizada com sucesso!');
        fetchMovements(); // Atualiza a lista após a finalização
      } else {
        Alert.alert('Erro', 'Falha ao finalizar a entrega.');
      }
    } catch (error) {
      console.error('Erro ao finalizar entrega:', error);
      Alert.alert('Erro', 'Não foi possível finalizar a entrega.');
    }
  };

  // Função para lidar com a criação de movimentação
  const handleSubmit = async () => {
    const { originBranchId, destinationBranchId, productId, quantity, motorista } = movement;

    if (!originBranchId || !destinationBranchId || !productId || !quantity || !motorista) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (isNaN(quantity) || Number(quantity) <= 0) {
      Alert.alert('Erro', 'A quantidade deve ser um número válido maior que zero.');
      return;
    }

    try {
      const createResponse = await api.post('/movements', movement);
      if (createResponse.status === 201) {
        Alert.alert('Sucesso', 'Movimentação criada com sucesso!');
        const movementId = createResponse.data.id;

        if (selectedImage) {
          const formData = new FormData();
          formData.append('file', {
            uri: selectedImage,
            name: 'image.jpg',
            type: 'image/jpeg',
          });
          formData.append('motorista', motorista);

          const startResponse = await api.put(`/movements/${movementId}/start`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          if (startResponse.status === 200) {
            Alert.alert('Sucesso', 'Movimentação iniciada com sucesso!');
            fetchMovements(); // Atualiza a lista de movimentações após criar uma nova
          } else {
            Alert.alert('Erro', 'Falha ao iniciar a movimentação. Tente novamente.');
          }
        }
      } else {
        Alert.alert('Erro', 'Não foi possível criar a movimentação. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao criar movimentação:', error);
      Alert.alert('Erro', 'Não foi possível criar a movimentação. Verifique os dados e tente novamente.');
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Listagem de Movimentações */}
      <View style={styles.listContainer}>
        <Text style={styles.title}>Lista de Movimentações</Text>
        {movements.map((movement) => (
          <View key={movement.id} style={[styles.movementItem, movement.status === "Em Trânsito" ? styles.inTransit : styles.created]}>
            <Text>Produto Nome: {movement.produto?.nome ?? 'Não disponível'}</Text>
            <Text>ID da Movimentação: {movement.id}</Text>
            {movement.status === "Em Trânsito" && (
              <>
                <Text>Quantidade: {movement.quantidade}</Text>
                <Text>Origem: {movement.origem?.nome}</Text>
                <Text>Destino: {movement.destino?.nome}</Text>
                <Text>Status: {movement.status}</Text>
              </>
            )}
            {movement.produto?.imagem && (
              <Image source={{ uri: movement.produto.imagem }} style={styles.image} />
            )}
            {movement.status === "Em Trânsito" && (
              <Button title="Finalizar Entrega" onPress={() => handleEndDelivery(movement.id)} />
            )}
            {movement.status === "Created" && (
              <Button title="Iniciar Entrega" onPress={() => handleEndDelivery(movement.id)} />
            )}
          </View>
        ))}
      </View>

      {/* Formulário para criar movimentação */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Criar Movimentação</Text>
        <Picker
          selectedValue={movement.originBranchId}
          onValueChange={(itemValue) => setMovement({ ...movement, originBranchId: itemValue })}
          style={styles.picker}
        >
          <Picker.Item label="Selecione a Filial de Origem" value="" />
          {branches.map((branch) => (
            <Picker.Item key={branch.id} label={branch.name} value={branch.id} />
          ))}
        </Picker>

        <Picker
          selectedValue={movement.destinationBranchId}
          onValueChange={(itemValue) => setMovement({ ...movement, destinationBranchId: itemValue })}
          style={styles.picker}
        >
          <Picker.Item label="Selecione a Filial de Destino" value="" />
          {branches.map((branch) => (
            <Picker.Item key={branch.id} label={branch.name} value={branch.id} />
          ))}
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="ID do Produto"
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
          placeholder="Nome do Motorista"
          value={movement.motorista}
          onChangeText={(text) => setMovement({ ...movement, motorista: text })}
        />
        <Button title="Selecionar Imagem" onPress={handleImagePick} />
        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
        <Button title="Criar Movimentação" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  listContainer: { marginBottom: 20 },
  formContainer: { marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  movementItem: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  inTransit: { backgroundColor: '#d0e9ff' },
  created: { backgroundColor: '#fff3cd' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 5 },
  picker: { height: 50, width: '100%', marginBottom: 10 },
  image: { width: 100, height: 100, marginVertical: 10 },
});
