import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const data = await AsyncStorage.getItem('@user_data');
    if (data) {
      setUserData(JSON.parse(data));
    }
  };

  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>
        {userData?.name} - {userData?.profile}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
