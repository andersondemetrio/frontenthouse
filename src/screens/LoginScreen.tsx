import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      console.log('Iniciando login...');
      console.log('Dados enviados:', { email, password });

      const response = await axios.post('http://192.168.15.8:3000/login', {
        email,
        password,
      }, {
        timeout: 15000 // 15 segundos
      });

      console.log('Status da resposta:', response.status);
      console.log('Resposta:', response.data);

      if (response.status === 200) {
        const userData = response.data;
        // Extrair as informações necessárias
        const userName = userData.name;
        const userProfile = userData.profile;

        // Salvar os dados do usuário em AsyncStorage
        await AsyncStorage.setItem('@user_data', JSON.stringify({
          name: userName,
          profile: userProfile
        }));

        console.log('Redirecionando para Home');
        navigation.navigate('Home'); // Use navigate ao invés de reset
      } else {
        throw new Error(`Código de status: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro durante o login:', error.message);
      alert('Erro ao realizar o login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity 
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '80%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LoginScreen;
