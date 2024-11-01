import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { API_URL } from "../constants";

interface Product {
  product_name: string;
  id: string;
  name: string;
  branch: string;
  quantity: number;
  image_url: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
}

export default function ProductListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();

      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter((product) =>
        (product.product_name?.toLowerCase().includes(
          searchTerm.toLowerCase(),
        ) ||
          product.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.branch?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      //console.log(products);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image_url }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.product_name}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.branchName}>Filial: {item.branch}</Text>
        <Text style={styles.quantity}>Quantidade: {item.quantity}</Text>
        <Text style={styles.description}>Descrição: {item.description}</Text>
        <Text style={styles.location}>Local: {item.location}</Text>
        <Text style={styles.coordinates}>
          Coordenadas: {item.latitude}, {item.longitude}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar produtos..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => {
          return item.product_name;
        }}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    padding: 10,
    backgroundColor: "white",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 8,
  },
  listContent: {
    padding: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  productInfo: {
    marginLeft: 15,
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  branchName: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  quantity: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  coordinates: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 20,
  },
});
