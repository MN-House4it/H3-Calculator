import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { localStorageService } from '../services/CalculatorStorage';

const Calculator = ({ route, navigation }) => {
  const { calculatorId } = route.params;
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState(null);
  const [firstValue, setFirstValue] = useState(null);
  const [currentCalculator, setCurrentCalculator] = useState(null);

  useEffect(() => {
    const loadCalculator = async () => {
      const calculator = await localStorageService.getCalculatorById(calculatorId);
      setCurrentCalculator(calculator);
      setDisplayValue(calculator.lastResult.toString());
    };

    loadCalculator();
  }, [calculatorId]);

  const handleTap = async (type, value) => {
    if (type === 'number') {
      setDisplayValue(displayValue === '0' ? value : displayValue + value);
    }
    if (type === 'operator') {
      setOperator(value);
      setFirstValue(parseFloat(displayValue));
      setDisplayValue('0');
    }
    if (type === 'equal') {
      const secondValue = parseFloat(displayValue);
      let result = firstValue;

      if (operator === '+') {
        result += secondValue;
      } else if (operator === '-') {
        result -= secondValue;
      } else if (operator === '*') {
        result *= secondValue;
      } else if (operator === '/') {
        result /= secondValue;
      }

      // Update state and local storage with the new result
      setDisplayValue(result.toString());
      setFirstValue(null);
      setOperator(null);

      // Update the last result in the calculator
      const updatedCalculator = { ...currentCalculator, lastResult: result };
      setCurrentCalculator(updatedCalculator);
      await localStorageService.updateCalculator(calculatorId, updatedCalculator);

      // Optionally, navigate back to the overview or show a success message
      navigation.goBack();
    }
    if (type === 'clear') {
      setDisplayValue('0');
      setFirstValue(null);
      setOperator(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.display}>{displayValue}</Text>
      {/* Calculator buttons layout similar to your previous implementation */}
      {/* Add your buttons here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  display: {
    fontSize: 40,
    textAlign: 'right',
    marginRight: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },
  button: {
    backgroundColor: '#333',
    padding: 20,
    flex: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 30,
    color: '#fff',
  },
});

export default Calculator;
