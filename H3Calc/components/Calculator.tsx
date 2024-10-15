import React, { useState, useEffect  } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRoute } from '@react-navigation/native';  // Import useRoute to access the route params


const Calculator = () => {
  const [displayValue, setDisplayValue] = useState('0');

  const [lastOperation, setLastOperation] = useState('');
  const [operator, setOperator] = useState(null);
  const [firstValue, setFirstValue] = useState(null);
  const [isLastOperator, setIsLastOperator] = useState(true); // Use state for isLastOperator

  const route = useRoute(); // Access the route object
  const { calculatorId } = route.params; // Extract calculatorId from route.params
  
  useEffect(() => {
    // Optionally, you can do something with calculatorId, like loading saved data for this specific calculator
    console.log('Navigated to Calculator with ID:', calculatorId);
  }, [calculatorId]);

    // Function to calculate the expression
    const calculateExpression = (expression: string): number => {
      try {
        const sanitizedExpression = expression.replace(/[^-()\d/*+.]/g, ''); // Sanitize input
        return eval(sanitizedExpression); // Evaluate the expression
      } catch (error) {
        console.error('Invalid expression:', error);
        Toast.show({
          type: 'error',
          text1: 'Invalid Expression',
          text2: 'Please check your input',
        });
        return NaN;
      }
    };

  const handleTap = (type : string, value: string) => {

    if (type === 'equal') {
      const result = calculateExpression(displayValue);
      setLastOperation(displayValue.toString());
      setDisplayValue(result.toString()); // Set the result as the new display value
      if (result === 69 || result === 80085) {
        Toast.show({
          type: 'info', // Provide a valid type like 'info'
          text1: 'Nice!',
        });
      }
      
    }
    else if (type === 'clear') {
      setLastOperation('');
      setDisplayValue('0');
      setFirstValue(null);
      setOperator(null);
    }
    else if (type === 'delete') {
      setDisplayValue(displayValue.slice(0, -1));
      setDisplayValue(displayValue.slice(0, -1) === '' ? '0' : displayValue.slice(0, -1));

    }
    else{
      if (type === 'operator') {
        if (!isLastOperator) {
          setDisplayValue(displayValue === '0' ? value : displayValue + value);
          setIsLastOperator(true);
        }
      }
      else{
        setDisplayValue(displayValue === '0' ? value : displayValue + value);
        setIsLastOperator(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.display}>{lastOperation}</Text>
      <Text style={styles.display}>{displayValue}</Text>
      <View style={styles.row}>
        <CalculatorButton title="C" onPress={() => handleTap('clear')} />
        <CalculatorButton title="(" onPress={() => handleTap('number', '(')} />
        <CalculatorButton title=") " onPress={() => handleTap('number', ')')} />
        <CalculatorButton title="/" onPress={() => handleTap('operator', '/')} />
      </View>
      <View style={styles.row}>
        <CalculatorButton title="7" onPress={() => handleTap('number', '7')} />
        <CalculatorButton title="8" onPress={() => handleTap('number', '8')} />
        <CalculatorButton title="9" onPress={() => handleTap('number', '9')} />
        <CalculatorButton title="X" onPress={() => handleTap('operator', '*')} />
      </View>
      <View style={styles.row}>
        <CalculatorButton title="4" onPress={() => handleTap('number', '4')} />
        <CalculatorButton title="5" onPress={() => handleTap('number', '5')} />
        <CalculatorButton title="6" onPress={() => handleTap('number', '6')} />
        <CalculatorButton title="-" onPress={() => handleTap('operator', '-')} />
      </View>
      <View style={styles.row}>
        <CalculatorButton title="1" onPress={() => handleTap('number', '1')} />
        <CalculatorButton title="2" onPress={() => handleTap('number', '2')} />
        <CalculatorButton title="3" onPress={() => handleTap('number', '3')} />
        <CalculatorButton title="+" onPress={() => handleTap('operator', '+')} />
      </View>
      <View style={styles.row}>
        <CalculatorButton title="Delete" onPress={() => handleTap('delete')} />
        <CalculatorButton title="0" onPress={() => handleTap('number', '0')} />
        <CalculatorButton title="." onPress={() => handleTap('number', '.')} />
        <CalculatorButton title="=" onPress={() => handleTap('equal')} />
      </View>

      <Toast />
    </View>
  );
};

const CalculatorButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

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