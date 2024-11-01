// src/screens/MapScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const MapScreen = ({ route }) => {
  const { origem, destino } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (origem.latitude + destino.latitude) / 2,
          longitude: (origem.longitude + destino.longitude) / 2,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={origem} title="Origem" />
        <Marker coordinate={destino} title="Destino" />
        <Polyline
          coordinates={[origem, destino]}
          strokeColor="#000" // Cor da linha
          strokeWidth={3} // Largura da linha
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
