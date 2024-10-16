// CalculatorOverviewViewModel.ts
import { useState, useCallback } from 'react';
import { localStorageService } from '../services/CalculatorStorage';
import { Calculator } from '../models/Calculator';
import { useFocusEffect } from '@react-navigation/native';

export const useCalculatorOverviewViewModel = () => {
  const [calculators, setCalculators] = useState<Calculator[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCalculator, setCurrentCalculator] = useState<Calculator | null>(null);
  const [newName, setNewName] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      const fetchCalculators = async () => {
        const storedCalculators = await localStorageService.getCalculators();
        setCalculators(storedCalculators);
      };
  
      fetchCalculators();
    }, [])
  );

  const addCalculator = async (navigation: any) => {
    const newCalculator: Calculator = {
      id: Date.now().toString(),
      name: "New Calculator",
      lastResult: 0,
      lastOperation: '',
      lastTyped: '0'
    };

    await localStorageService.addCalculator(newCalculator);
    setCalculators((prev) => [...prev, newCalculator]);
    navigation.navigate('Calculator', { calculatorId: newCalculator.id });
  };

  const deleteCalculator = async (id: string) => {
    await localStorageService.deleteCalculator(id);
    setCalculators((prev) => prev.filter(calculator => calculator.id !== id));
  };

  const showEditModal = (calculator: Calculator) => {
    setCurrentCalculator(calculator);
    setNewName(calculator.name);
    setIsModalVisible(true);
  };

  const saveNewName = async () => {
    if (currentCalculator) {
      const updatedCalculators = calculators.map(calculator => {
        if (calculator.id === currentCalculator.id) {
          return { ...calculator, name: newName };
        }
        return calculator;
      });

      setCalculators(updatedCalculators);
      await localStorageService.updateCalculator(currentCalculator.id, { name: newName });
    }

    setIsModalVisible(false);
  };

  return {
    calculators,
    isModalVisible,
    newName,
    setNewName,
    addCalculator,
    deleteCalculator,
    showEditModal,
    saveNewName,
    setIsModalVisible
  };
};
