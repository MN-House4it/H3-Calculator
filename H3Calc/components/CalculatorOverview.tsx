// src/screens/CalculatorOverview.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { localStorageService } from '../services/CalculatorStorage';
import { Calculator } from '../models/Calculator';

const CalculatorOverview: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [calculators, setCalculators] = useState<Calculator[]>([]);

  useEffect(() => {
    const fetchCalculators = async () => {
      const storedCalculators = await localStorageService.getCalculators();
      setCalculators(storedCalculators);
    };
    
    fetchCalculators();
  }, []);

  // Function to add a new calculator
  const addCalculator = async () => {
    const newCalculator: Calculator = {
      id: Date.now().toString(), // Generate a unique ID based on the current timestamp
      name: "New Calculator",
      lastResult: 0,
      lastOperation: ''
    };

    await localStorageService.addCalculator(newCalculator); // Add the calculator to local storage
    setCalculators((prev) => [...prev, newCalculator]); // Update state to include the new calculator
  };

  // Function to delete a calculator
  const deleteCalculator = async (id: string) => {
    await localStorageService.deleteCalculator(id); // Remove the calculator from local storage
    setCalculators((prev) => prev.filter(calculator => calculator.id !== id)); // Update state
  };

  const renderItem = ({ item }: { item: Calculator }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('CalculatorDetail', { calculatorId: item.id })}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemText}>{item.lastResult}</Text>
        <Text style={styles.itemText}>{item.lastOperation}</Text>
      </TouchableOpacity>
      <Button title="Delete" onPress={() => deleteCalculator(item.id)} color="#FF4D4D" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculator Overview</Text>
      <Button title="Add Calculator" onPress={addCalculator} />
      <FlatList
        data={calculators}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    marginTop: 16,
  },
  itemContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // for Android
    marginVertical: 8,
  },
  itemText: {
    fontSize: 18,
  },
});

export default CalculatorOverview;
