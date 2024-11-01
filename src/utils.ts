import { Alert } from "react-native";

export const customAlert = (title: string, message: string) => {
  Alert.alert(title, message);
};

export const customAlertError = (message: string) => {
  customAlert("Erro", message);
};

export const customAlertSuccess = (message: string) => {
  customAlert("Sucesso", message);
};
