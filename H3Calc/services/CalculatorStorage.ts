// src/services/localStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calculator } from '../models/Calculator';

const STORAGE_KEY = 'calculators';

export const localStorageService = {
  async getCalculators(): Promise<Calculator[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  async addCalculator(calculator: Calculator): Promise<void> {
    const calculators = await this.getCalculators();
    calculators.push(calculator);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(calculators));
  },

  async deleteCalculator(id: string): Promise<void> {
    const calculators = await this.getCalculators();
    const updatedCalculators = calculators.filter(calculator => calculator.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCalculators));
  },

  async getCalculatorById(id: string): Promise<Calculator | null> {
    const calculators = await this.getCalculators();
    return calculators.find(cal => cal.id === id) || null;
  },

  async updateCalculator(id: string, updatedFields: Partial<Calculator>): Promise<void> {
    const calculators = await this.getCalculators();
    const updatedCalculators = calculators.map(calculator =>
      calculator.id === id ? { ...calculator, ...updatedFields } : calculator
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCalculators));
  },
};
