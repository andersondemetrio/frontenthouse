import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import UserListScreen from './src/screens/UserListScreen';
import UserRegisterScreen from './src/screens/UserRegisterScreen';
import MovementListScreen from './src/screens/MovementListScreen';


const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user_data');
      if (userData) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProductList" component={ProductListScreen} />
        <Stack.Screen name="UserList" component={UserListScreen} />
        <Stack.Screen name="UserRegister" component={UserRegisterScreen} />
       
        <Stack.Screen name="MovementList" component={MovementListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


