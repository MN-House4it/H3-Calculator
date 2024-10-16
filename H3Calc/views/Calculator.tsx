import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRoute } from '@react-navigation/native';
import { observer } from 'mobx-react-lite'; // Assuming you use MobX for state management
import Dropdown from '../components/Dropdown';
import CalculatorViewModel from '../viewmodels/CalculatorViewModel';

const CalculatorView = observer(() => {
  const route = useRoute();
  const { calculatorId } = route.params;
  const viewModel = useRef(new CalculatorViewModel(calculatorId)).current;
  

  const scrollViewLastOperationRef = useRef(null);
  const scrollViewMainRef = useRef(null);

  useEffect(() => {
    const fetchCalculatorData = async () => {
      await viewModel.fetchCalculator();
    };
    
    fetchCalculatorData();
  }, [calculatorId]);
  

  useEffect(() => {
    scrollViewLastOperationRef.current?.scrollToEnd({ animated: false });
    scrollViewMainRef.current?.scrollToEnd({ animated: false });
  }, [viewModel.calculator]);

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <ScrollView 
          ref={scrollViewLastOperationRef}
          horizontal={true} 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        >
          <Text style={styles.displayLastOperation}>
            {viewModel.calculator?.lastOperation || 'ㅤ'}
          </Text>
        </ScrollView>
        
        <ScrollView 
          ref={scrollViewMainRef}
          horizontal={true} 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        >
          <Text style={styles.displayMain}>
            {viewModel.calculator?.lastTyped}
          </Text>
        </ScrollView>
      </View>

      <View style={styles.pickerContainer}>
        <Dropdown
          selectValue={viewModel.selectValue}
          data={viewModel.renderPickerItems()}
          oneSelect={viewModel.insertOtherCalculatorValue}
        />
      </View>

      <View style={styles.grid}>
        {viewModel.buttons.map((button, index) => (
          <CalculatorButton 
            key={index} 
            title={button.title} 
            onPress={() => viewModel.handleTap(button.type, button.value)} 
          />
        ))}
      </View>
      <Toast />
    </View>
  );
});

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

export default CalculatorView;
