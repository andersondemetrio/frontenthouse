import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteItem } from "../localStorage";

type HeaderProps = {
  onLogout?: () => void;
};
type UserData = {
  name: string;
  email: string;
};

export default function Header({ onLogout }: HeaderProps) {
  const [userData, setUserData] = useState<UserData | null>(null);

  const loadUserData = async () => {
    const data = await AsyncStorage.getItem("@user_data");
    if (data) {
      setUserData(JSON.parse(data));
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const logout = async () => {
    deleteItem("@user_data");
    setUserData(null);

    if (onLogout) {
      onLogout();
    }
  };

  return (
    <View style={styles.header}>
      {userData
        ? (
          <Text style={styles.headerText}>
            Olá, {userData.name} {userData.email ?? ""}
          </Text>
        )
        : <Text style={styles.headerText}>Olá, visitante.</Text>}
      <Button title="Sair" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
