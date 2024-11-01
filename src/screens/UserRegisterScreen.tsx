import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  Alert, 
  StyleSheet 
} from 'react-native';
import axios from 'axios';

// Configure the Axios instance
const api = axios.create({
  baseURL: 'http://192.168.15.8:3000', // Altere para a URL da sua API
  headers: {
    'Content-Type': 'application/json',
  },
});

export function UserRegister({ navigation }) {
  const [profile, setProfile] = useState('');
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    const userData = {
      profile,
      name,
      document,
      full_address: fullAddress,
      email,
      password,
    };

    try {
      const response = await api.post('/register', userData);
      if (response.status === 201) {
        Alert.alert('Sucesso', 'Usuário adicionado com sucesso!');
        navigation.navigate('UserList'); // Volta para a tela de listagem após adicionar
      }
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o usuário.');
    }
  };

  return (
    <View style={styles.registerContainer}>
      <TextInput 
        style={styles.input}
        placeholder="Perfil"
        value={profile}
        onChangeText={setProfile}
      />
      <TextInput 
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput 
        style={styles.input}
        placeholder="Documento"
        value={document}
        onChangeText={setDocument}
      />
      <TextInput 
        style={styles.input}
        placeholder="Endereço Completo"
        value={fullAddress}
        onChangeText={setFullAddress}
      />
      <TextInput 
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput 
        style={styles.input}
        placeholder="Senha"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Registrar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  registerContainer: {
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
});
export default UserRegister; 