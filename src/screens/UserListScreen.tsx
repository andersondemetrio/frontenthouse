import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  StyleSheet, 
  Switch,
  TouchableOpacity,
  Alert,
  TextInput,
  Button
} from 'react-native';
import axios from 'axios';

// Configure the Axios instance
const api = axios.create({
  baseURL: 'http://192.168.15.8:3000', // Altere para a URL da sua API
  headers: {
    'Content-Type': 'application/json',
  },
});

interface User {
  id: string;
  name: string;
  profile: string;
  status: number; // status (1 para ativo, 0 para inativo)
}

export default function UserListScreen({ navigation }) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Erro', 'Não foi possível carregar os usuários.');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: number) => {
    try {
      await api.patch(`/users/${userId}/toggle-status`);
      const newStatus = currentStatus === 1 ? 0 : 1;
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível alterar o status do usuário');
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={[styles.card, item.status === 1 ? styles.activeCard : styles.inactiveCard]}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userType}>Perfil: {item.profile}</Text>
      </View>
      <Switch
        value={item.status === 1}
        onValueChange={() => handleToggleStatus(item.id, item.status)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('UserRegister')}
      >
        <Text style={styles.addButtonText}>Adicionar Usuário</Text>
      </TouchableOpacity>

      <FlatList
  data={users}
  renderItem={renderUser}
  keyExtractor={item => item.id} // Verifique se `item.id` é realmente único
  contentContainerStyle={styles.listContent}
  ListEmptyComponent={<Text style={styles.emptyText}>Nenhum usuário encontrado</Text>}
/>
    </View>
  );
}

// Tela de Registro de Usuário
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
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
  addButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2, // Para sombra no Android
    shadowColor: '#000', // Para sombra no iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  activeCard: {
    borderColor: '#28a745',
    borderWidth: 1,
  },
  inactiveCard: {
    borderColor: '#dc3545',
    borderWidth: 1,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userType: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});