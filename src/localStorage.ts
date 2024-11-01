import AsyncStorage from "@react-native-async-storage/async-storage";

export const getItem = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error("Error getting item from AsyncStorage:", error);
  }
};

export const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error("Error setting item in AsyncStorage:", error);
  }
};

export const deleteItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error deleting item from AsyncStorage:", error);
  }
};
