import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const api = axios.create({
  baseURL: 'http://192.168.15.8:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function MovementRegisterScreen({ navigation }) {
  const [movement, setMovement] = useState({
    originBranchId: '',
    destinationBranchId: '',
    productId: '',
    quantity: '',
    motorista: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await api.get('/branches/options');
        setBranches(response.data);
      } catch (error) {
        console.error('Erro ao buscar filiais:', error);
      }
    };
    fetchBranches();
  }, []);

  const handleSubmit = async () => {
    if (!movement.originBranchId || !movement.destinationBranchId || !movement.productId || !movement.quantity || !movement.motorista) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (isNaN(movement.quantity) || Number(movement.quantity) <= 0) {
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
          formData.append('motorista', movement.motorista);

          const startResponse = await api.put(`/movements/${movementId}/start`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          if (startResponse.status === 200) {
            Alert.alert('Sucesso', 'Movimentação iniciada com sucesso!');
          } else {
            Alert.alert('Erro', 'Falha ao iniciar a movimentação. Tente novamente.');
          }
        }

        navigation.navigate('MovementList');
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
    <View style={styles.formContainer}>
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
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
});
