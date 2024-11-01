// src/services/api.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

class Api {
  instance: any;
  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:3000', // Mudança: removemos '/login'
      timeout: 5000, // 5 segundos de timeout
    });

    // Adicionamos interceptors para tratar erros e armazenar o token
    this.instance.interceptors.request.use(
      (config) => {
        const token = AsyncStorage.getItem('@auth_token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // O erro veio de volta do servidor
          console.error('Erro de servidor:', error.response.data);
          throw error;
        } else if (error.request) {
          // Não recebeu resposta de servidor
          console.error('Não recebeu resposta de servidor');
          throw error;
        } else {
          // Erro na configuração do cliente inicial
          console.error('Erro na configuração do cliente:', error.message);
          throw error;
        }
      }
    );
  }

  static getInstance() {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  async post(endpoint, data) {
    try {
      const response = await this.instance.post(endpoint, data, {
        timeout: 10000 // 10 segundos
      });
      return response.data;
    } catch (error) {
      console.error('Erro na requisição:', error.message);
      throw error;
    }
  }
  

  async get(endpoint, params = {}) {
    try {
      const response = await this.instance.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error('Erro na requisição:', error.message);
      throw error;
    }
  }

  async put(endpoint, data) {
    try {
      const response = await this.instance.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Erro na requisição:', error.message);
      throw error;
    }
  }

  async delete(endpoint: any, params = {}) {
    try {
      const response = await this.instance.delete(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error('Erro na requisição:', error.message);
      throw error;
    }
  }
}

export default Api.getInstance();
