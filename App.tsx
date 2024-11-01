import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { getItem } from "./src/localStorage";
import { RootStackParamList } from "./src/navigation";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import MovementListScreen from "./src/screens/MovementListScreen";
import ProductListScreen from "./src/screens/ProductListScreen";
import UserListScreen from "./src/screens/UserListScreen";
import UserRegisterScreen from "./src/screens/UserRegisterScreen";
import MapScreen from "./src/screens/MapScreen";
import MovementsListScreen from "./src/screens/MovementsListScreen";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userData = await getItem("@user_data");
      if (userData) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      setIsLoggedIn(false);
      console.error("Error checking login status:", error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ProductList" component={ProductListScreen} />
        <Stack.Screen name="UserList" component={UserListScreen} />
        <Stack.Screen name="UserRegister" component={UserRegisterScreen} />
        <Stack.Screen name="MovementList" component={MovementListScreen} />
        <Stack.Screen name="MovementsList" component={MovementsListScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
