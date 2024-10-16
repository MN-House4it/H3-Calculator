  import React, { useState, useEffect } from 'react';
  import { StyleSheet, Text, View, TouchableOpacity, useColorScheme, Button } from 'react-native';
  import Toast from 'react-native-toast-message';
  import { useRoute } from '@react-navigation/native';  
  import { localStorageService } from '../services/CalculatorStorage';
  import { ScrollView } from 'react-native';
  import { Picker } from '@react-native-picker/picker';
  import Dropdown from '../components/Dropdown';




  const Calculator = () => {
    const theme = useColorScheme() ?? 'light';

    const [operator, setOperator] = useState(null);
    const [firstValue, setFirstValue] = useState(null);
    const route = useRoute(); 
    const { calculatorId } = route.params; 
    const [calculator, setCalculator] = useState(null);
    const [calculators, setCalculators] = useState([]);




    const scrollViewLastOperationRef = React.useRef(null);
    const scrollViewMainRef = React.useRef(null);

    const fetchCalculators = async () => {
      const storedCalculators = await localStorageService.getCalculators();
      if (storedCalculators) {
        // Assuming storedCalculators is an array of objects with label and value properties
        setCalculators(storedCalculators);

      }
    };


    useEffect(() => {
      const fetchCalculator = async () => {
        const storedCalculator = await localStorageService.getCalculatorById(calculatorId);
        setCalculator(storedCalculator);
        fetchCalculators();
      };

      fetchCalculator();
    }, [calculatorId]);

    const calculateExpression = (expression: string): number => {
      try {
        // Replace division and multiplication symbols with their respective operators
        const sanitizedExpression = expression
          .replace(/÷/g, '/')   // Replace ÷ with /
          .replace(/×/g, '*')   // Replace × with *
          .replace(/[^-()\d/*+.]/g, ''); // Remove any other invalid characters
    
        return eval(sanitizedExpression);
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

    function checkCalculation(calculation: string): boolean {
      // Trim the input string to remove any leading or trailing whitespace
      calculation = calculation.trim();
  
      // Use a regular expression to find the last number in the string
      const match = calculation.match(/([\d.,]+)(?=[^\d.,]|$)/g);
  
      if (match) {
          const lastNumber = match[match.length - 1]; // Get the matched number
  
          // Check if the last number contains a comma
          return !lastNumber.includes('.');
      }
  
      return false; // Return false if no number is found
  }
  function isLastCharacterOperator(input: string): boolean {
    // Check if the last character is one of the specified operators
    const lastChar = input.trim().slice(-1);
    return ['+', '-', '×', '÷'].includes(lastChar);
  }
    

    const handleTap = async (type: string, value: string) => {
      let updatedCalculator = { ...calculator }; // Create a copy to update

      if (type === 'equal') {
        const result = calculateExpression(updatedCalculator?.lastTyped);
        if (!isNaN(result)) { // Ensure result is valid
          updatedCalculator = { 
            ...updatedCalculator, 
            lastResult: result.toString(), 
            lastOperation: updatedCalculator?.lastTyped, 
            lastTyped: result.toString()
          };
          setCalculator(updatedCalculator);
          await localStorageService.updateCalculator(calculatorId, updatedCalculator);
          
          if (result === 69 || result === 80085) {
            Toast.show({
              type: 'info',
              text1: 'Nice!',
            });
          }
        }
      } else if (type === 'clear') {
        updatedCalculator = { ...updatedCalculator, lastResult: '0', lastOperation: '', lastTyped: '0' };
        setCalculator(updatedCalculator);
        await localStorageService.updateCalculator(calculatorId, updatedCalculator);
      } else if (type === 'delete') {
        updatedCalculator = { 
          ...updatedCalculator, 
          lastTyped: updatedCalculator?.lastTyped.slice(0, -1) || '0' 
        };
        setCalculator(updatedCalculator);
        await localStorageService.updateCalculator(calculatorId, updatedCalculator);
      } else if (calculator?.lastTyped.length  < 50){
        if (type === 'operator') {
          let lastTyped = updatedCalculator?.lastTyped;
          if (isLastCharacterOperator(lastTyped)) {
            lastTyped = lastTyped.slice(0, -1);
          }
          updatedCalculator = { 
            ...updatedCalculator, 
            lastTyped: lastTyped + value 
          };
          setCalculator(updatedCalculator);
          await localStorageService.updateCalculator(calculatorId, updatedCalculator);

        } else if (type !== 'comma' || checkCalculation(updatedCalculator?.lastTyped)) {
          updatedCalculator = { 
            ...updatedCalculator, 
            lastTyped: updatedCalculator?.lastTyped === '0' && type !== 'comma' ? value : updatedCalculator?.lastTyped + value 
          };
          setCalculator(updatedCalculator);
          await localStorageService.updateCalculator(calculatorId, updatedCalculator);
        }


      }
      scrollViewLastOperationRef.current.scrollToEnd({ animated: false });
      scrollViewMainRef.current.scrollToEnd({ animated: false });
    };




    const renderPickerItems = () => {
      const calculatorsToShow = calculators.filter((c) => c.id !== calculator.id);
      return calculatorsToShow;
    };

    const insertOtherCalculatorValue = async (item) => {



  
      let updatedCalculator = { ...calculator }; // Create a copy to update

      updatedCalculator = { 
        ...updatedCalculator, 
        lastTyped: updatedCalculator?.lastTyped === '0' ? item.lastResult : updatedCalculator?.lastTyped + item.lastResult 
      };

      // updatedCalculator?.lastTyped === '0' && type !== 'comma' ? value : updatedCalculator?.lastTyped + value 
      setCalculator(updatedCalculator);
      await localStorageService.updateCalculator(calculatorId, updatedCalculator);
    };








    const [selectValue, setSelectValue] = React.useState("");

    const data = [
      {
        id: 1,
        name: 'user'
      },
      {
        id: 2,
        name: 'Admin'
      },
      {
        id: 3,
        name: 'employee'
      },
    ];
  
    const selected = (item) => {
    }
  



    return (
      <View style={styles.container}>
    <View style={styles.displayContainer}>
      <ScrollView 
        ref={scrollViewLastOperationRef} 
        horizontal={true} 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
      >
        <Text 
          style={styles.displayLastOperation} 
          numberOfLines={1} 
          ellipsizeMode="clip" 
          textAlign="right"
        >
          {calculator?.lastOperation === '' ? 'ㅤ' : calculator?.lastOperation}
        </Text>
      </ScrollView>
      
      <ScrollView 
        ref={scrollViewMainRef} 
        horizontal={true} 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
      >
        <Text 
          style={styles.displayMain} 
          numberOfLines={1} 
          ellipsizeMode="clip" 
          textAlign="right"
        >
          {calculator?.lastTyped}
        </Text>
      </ScrollView>
    </View>

    <View style={styles.pickerContainer}>
      <Dropdown
        selectValue={selectValue}
        data={renderPickerItems()}
        oneSelect={insertOtherCalculatorValue}
      >
      </Dropdown>

    </View>



    <View style={styles.grid}>
      <CalculatorButton title="C" onPress={() => handleTap('clear')} />
      <CalculatorButton title="(" onPress={() => handleTap('number', '(')} />
      <CalculatorButton title=")" onPress={() => handleTap('number', ')')} />
      <CalculatorButton title="÷" onPress={() => handleTap('operator', '÷')} />

      <CalculatorButton title="7" onPress={() => handleTap('number', '7')} />
      <CalculatorButton title="8" onPress={() => handleTap('number', '8')} />
      <CalculatorButton title="9" onPress={() => handleTap('number', '9')} />
      <CalculatorButton title="×" onPress={() => handleTap('operator', '×')} />

      <CalculatorButton title="4" onPress={() => handleTap('number', '4')} />
      <CalculatorButton title="5" onPress={() => handleTap('number', '5')} />
      <CalculatorButton title="6" onPress={() => handleTap('number', '6')} />
      <CalculatorButton title="-" onPress={() => handleTap('operator', '-')} />

      <CalculatorButton title="1" onPress={() => handleTap('number', '1')} />
      <CalculatorButton title="2" onPress={() => handleTap('number', '2')} />
      <CalculatorButton title="3" onPress={() => handleTap('number', '3')} />
      <CalculatorButton title="+" onPress={() => handleTap('operator', '+')} />

      <CalculatorButton title="←" onPress={() => handleTap('delete')} />
      <CalculatorButton title="0" onPress={() => handleTap('number', '0')} />
      <CalculatorButton title="." onPress={() => handleTap('comma', '.')} />
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
      justifyContent: 'flex-start', // Align the content to the top
      backgroundColor: '#121212', // Dark background for the main container
      padding: 20,
    },
    displayContainer: {
      marginTop: 40, // Add space above the display container
      marginBottom: 10, // Optional: space below the display container
    },
    displayMain: {
      fontSize: 70,
      textAlign: 'right',
      marginRight: 20,
      marginBottom: 20,
      fontWeight: 'bold',
      color: '#ffffff', // White text for contrast
    },
    displayLastOperation: {
      fontSize: 40,
      textAlign: 'right',
      marginRight: 20,
      marginBottom: 20,
      color: '#bbbbbb', // Slightly lighter color for last operation text
    },
    grid: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
    },
    button: {
      backgroundColor: '#333333', // Dark button color
      padding: 10,
      width: '22%', // Adjust the width to fit 4 buttons in a row
      margin: 5, // Add margin for spacing
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    buttonText: {
      fontSize: 30,
      color: '#ffffff', // White text on buttons for contrast
    },
    pickerContainer: {
      alignItems: 'center',

    },
    picker: {
      width: '80%', // Adjust width as needed
      height: 50, // Adjust height as needed
      zIndex: 10, // Set a higher z-index

    },
  });

  // Define the themes outside of the component
const lightTheme = {
  background: '#ffffff',
  buttonBackground: '#e0e0e0',
  buttonText: '#000000',
  displayMain: '#000000',
  displayLastOperation: '#555555',
};

const darkTheme = {
  background: '#121212',
  buttonBackground: '#333333',
  buttonText: '#ffffff',
  displayMain: '#ffffff',
  displayLastOperation: '#bbbbbb',
};



  export default Calculator;
