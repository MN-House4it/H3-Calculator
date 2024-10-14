// src/screens/CalculatorOverview.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { localStorageService } from '../services/CalculatorStorage';
import { Calculator } from '../models/Calculator';

const CalculatorOverview: React.FC = ({ navigation }) => {
  const [calculators, setCalculators] = useState<Calculator[]>([]);

  useEffect(() => {
    const fetchCalculators = async () => {
      const storedCalculators = await localStorageService.getCalculators();
      setCalculators(storedCalculators);
    };
    
    fetchCalculators();
  }, []);

  return (
    <View>
      <Text>Calculator Overview</Text>
      <FlatList
        data={calculators}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('CalculatorDetail', { calculatorId: item.id })}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CalculatorOverview;
