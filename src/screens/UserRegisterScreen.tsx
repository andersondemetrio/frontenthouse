import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { apiInstance } from "../requests";
import { UserRegisterScreenProps } from "../navigation";
import { customAlertError, customAlertSuccess } from "../utils";

export function UserRegister({ navigation }: UserRegisterScreenProps) {
  const [profile, setProfile] = useState("");
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      const response = await apiInstance.post("/register", userData);
      if (response.status === 201) {
        customAlertSuccess("Usuário adicionado com sucesso!");
        navigation.navigate("UserList"); // Volta para a tela de listagem após adicionar
      }
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      customAlertError("Não foi possível adicionar o usuário.");
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
    backgroundColor: "#f9f9f9",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    marginBottom: 10,
  },
});

export default UserRegister;
