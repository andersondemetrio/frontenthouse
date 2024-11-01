// src/screens/MapScreen.js
import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { MapScreenProps } from "../navigation";

const MapScreen = ({ route }: MapScreenProps) => {
  const { origem, destino } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: origem.latitude,
          longitude: origem.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={origem} title="Origem" />
        <Marker coordinate={destino} title="Destino" />
        <Polyline
          coordinates={[origem, destino]}
          strokeColor="#000"
          strokeWidth={3}
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
