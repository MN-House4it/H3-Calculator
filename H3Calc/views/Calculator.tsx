import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRoute } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import Dropdown from '../components/Dropdown';
import CalculatorViewModel from '../viewmodels/CalculatorViewModel';
import { useColorScheme } from '@/hooks/useColorScheme';


const CalculatorView = observer(() => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const route = useRoute();
  const { calculatorId } = route.params;
  const viewModel = useRef(new CalculatorViewModel(calculatorId)).current;

  const scrollViewLastOperationRef = useRef(null);
  const scrollViewMainRef = useRef(null);
  const [buttonSize, setButtonSize] = useState(0); // Adjusted from buttonWidth

  useEffect(() => {
    const fetchCalculatorData = async () => {
      await viewModel.fetchCalculator();
    };
    
    fetchCalculatorData();
  }, [calculatorId]);

  useEffect(() => {
    const handleResize = () => {
      const { width } = Dimensions.get('window');
      const newButtonSize = (width / 4) - 15; // 4 columns
      setButtonSize(newButtonSize);
    };

    const subscription = Dimensions.addEventListener('change', handleResize);

    handleResize(); // Initial call to set button size on mount
    scrollViewLastOperationRef.current?.scrollToEnd({ animated: false });
    scrollViewMainRef.current?.scrollToEnd({ animated: false });

    return () => {
      subscription?.remove(); // Clean up the event listener
    };
  }, [viewModel.calculator]);

  return (
    <View style={styles.container(isDarkMode)}>
              <View style={styles.pickerContainer}>
          <Dropdown
            selectValue={viewModel.selectValue}
            data={viewModel.renderPickerItems()}
            oneSelect={viewModel.insertOtherCalculatorValue}
          />
        </View>
      <View style={styles.displayContainer}>
        <ScrollView 
          ref={scrollViewLastOperationRef}
          horizontal={true} 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContainer}
          style={styles.scrollView}
        >
          <Text style={styles.displayLastOperation(isDarkMode)}>
            {viewModel.calculator?.lastOperation || ' '}
          </Text>
        </ScrollView>
        
        <ScrollView 
          ref={scrollViewMainRef}
          horizontal={true} 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContainer}
        >
          <Text style={styles.displayMain(isDarkMode)}>
            {viewModel.calculator?.lastTyped}
          </Text>
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>


        <View style={styles.grid}>
          {viewModel.buttons.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((button, buttonIndex) => (
                <CalculatorButton 
                  key={buttonIndex} 
                  title={button.title} 
                  onPress={() => viewModel.handleTap(button.type, button.value)} 
                  size={buttonSize} // Pass the dynamic size
                  isDarkMode={isDarkMode} // Pass isDarkMode to CalculatorButton
                />
              ))}
            </View>
          ))}
        </View>
      </View>
      <Toast />
    </View>
  );
});

const CalculatorButton = ({ title, onPress, size, isDarkMode }) => (
  <TouchableOpacity style={[styles.button(isDarkMode), { width: size, height: size, borderRadius: size / 2 }]} onPress={onPress}>
    <Text style={styles.buttonText(isDarkMode)}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: (isDarkMode) => ({
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: isDarkMode ? '#121212' : '#ffffff', // Dark or light background
    padding: 10,
  }),
  displayContainer: {
    marginBottom: 10,
  },
  displayMain: (isDarkMode) => ({
    fontSize: 70,
    textAlign: 'right',
    marginBottom: 20,
    fontWeight: 'bold',
    color: isDarkMode ? '#ffffff' : '#000000', // Text color for main display
  }),
  displayLastOperation: (isDarkMode) => ({
    fontSize: 40,
    textAlign: 'right',
    marginBottom: 0,
    color: isDarkMode ? '#bbbbbb' : '#333333', // Text color for last operation
  }),
  inputContainer: {
    flex: 1,
    paddingBottom: 20,
    justifyContent: 'flex-end', // Ensure it takes the remaining space
  },
  grid: {
    flexDirection: 'column',
    justifyContent: 'flex-end', // Aligns rows at the bottom
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10, // Adds space between rows
  },
  button: (isDarkMode) => ({
    backgroundColor: isDarkMode ? '#333333' : '#eeeeee', // Button background color
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5, // Adds space around buttons
  }),
  buttonText: (isDarkMode) => ({
    fontSize: 30,
    color: isDarkMode ? '#ffffff' : '#000000', // Button text color
  }),
  pickerContainer: {
    alignItems: 'flex-end',
    paddingBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  scrollView: {
    minHeight: 50,
  },
});

export default CalculatorView;
