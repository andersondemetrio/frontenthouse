import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getItem, setItem } from "../localStorage";
import { apiInstance, isOk } from "../requests";
import { customAlertError } from "../utils";
import { LoginScreenProps } from "../navigation";

type User = {
  name: string;
  profile: string;
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const userData = await getItem("@user_data");
      if (userData) {
        navigation.navigate("Home");
      }
    };

    checkUser();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      customAlertError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email,
        password,
      };

      const response = await apiInstance.post<User>(`/login`, payload);

      if (isOk(response.status)) {
        await setItem(
          "@user_data",
          JSON.stringify({
            name: response.data.name,
            profile: response.data.profile,
          }),
        );

        setEmail("");
        setPassword("");

        navigation.navigate("Home"); // Use navigate ao invés de reset
      } else {
        throw new Error(`Código de status: ${response.status}`);
      }
    } catch (error) {
      console.error("Erro durante o login:", error);
      customAlertError("Erro ao realizar o login. Verifique suas credenciais.");
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
        {loading
          ? <ActivityIndicator color="#FFF" />
          : <Text style={styles.buttonText}>Entrar</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: "80%",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default LoginScreen;
