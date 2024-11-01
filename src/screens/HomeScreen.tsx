import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('ProductList')}
        >
          <Text style={styles.buttonText}>Lista de Produtos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('UserList')}
        >
          <Text style={styles.buttonText}>Gerenciar Usuários</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('MovementList')}
        >
          <Text style={styles.buttonText}>Listar / Adicionar Movimentações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
