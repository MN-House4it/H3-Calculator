// src/services/localStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calculator } from '../types/calculator';

const STORAGE_KEY = 'calculators';

export const localStorageService = {
  async getCalculators(): Promise<Calculator[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  async saveCalculator(calculator: Calculator): Promise<void> {
    const calculators = await this.getCalculators();
    calculators.push(calculator);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(calculators));
  },

  async getCalculatorById(id: string): Promise<Calculator | null> {
    const calculators = await this.getCalculators();
    return calculators.find(cal => cal.id === id) || null;
  },
};
