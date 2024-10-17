import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, ViewStyle } from 'react-native';
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
  const [buttonSize, setButtonSize] = useState(0);

  useEffect(() => {
    const fetchCalculatorData = async () => {
      await viewModel.fetchCalculator();
    };
    
    fetchCalculatorData();
  }, [calculatorId]);

  useEffect(() => {
    const handleResize = () => {
      const { width, height } = Dimensions.get('window');
      const containerHeight = height - 350; // Offset for the top display, could have ben calculated if i had more time

      const newButtonSizeHeight = (containerHeight / 5) - 15; // 5 rows

      const newButtonSizeWidth = (width / 4) - 15; // 4 columns

      const newButtonSize = Math.min(newButtonSizeHeight, newButtonSizeWidth);


      setButtonSize(newButtonSize);
    };

    const subscription = Dimensions.addEventListener('change', handleResize);

    handleResize();
    scrollViewLastOperationRef.current?.scrollToEnd({ animated: false });
    scrollViewMainRef.current?.scrollToEnd({ animated: false });

    return () => {
      subscription?.remove();
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
        <View style={styles.gridContainer}>
          <View style={styles.grid}>
            {viewModel.buttons.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((button, buttonIndex) => (
                  <CalculatorButton 
                    key={buttonIndex} 
                    title={button.title} 
                    onPress={() => viewModel.handleTap(button.type, button.value)} 
                    size={buttonSize}
                    isDarkMode={isDarkMode}
                    isHighlighted={button.isHighlighted}
                    highlightColor={button.highlightColor}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
      <Toast />
    </View>
  );
});

const CalculatorButton = ({ title, onPress, size, isDarkMode, isHighlighted, highlightColor }) => (
  <TouchableOpacity style={[styles.button(isDarkMode, isHighlighted, highlightColor), { width: size, height: size, borderRadius: size / 2 }]} onPress={onPress}>
    <Text style={styles.buttonText(isDarkMode, isHighlighted)}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: (isDarkMode: boolean) => ({
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: isDarkMode ? '#121212' : '#ffffff',
    padding: 10,
  }),
  displayContainer: {
    marginBottom: 10,
  },
  displayMain: (isDarkMode: boolean) => ({
    fontSize: 70,
    textAlign: 'right',
    marginBottom: 20,
    fontWeight: 'bold',
    color: isDarkMode ? '#ffffff' : '#000000',
  }),
  displayLastOperation: (isDarkMode: boolean) => ({
    fontSize: 40,
    textAlign: 'right',
    marginBottom: 0,
    color: isDarkMode ? '#bbbbbb' : '#333333',
  }),
  inputContainer: {
    flex: 1,
    paddingBottom: 20,
    justifyContent: 'flex-end',
    height: '100%',
  },
  gridContainer: {
    alignSelf: 'center',
    width: '100%',
  },
  grid: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  button: (isDarkMode: boolean, isHighlighted: boolean, highlightColor: string) => ({
    backgroundColor: isHighlighted ? highlightColor : isDarkMode ? '#333333' : '#eeeeee',    
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  }),
  buttonText: (isDarkMode: boolean, isHighlighted: boolean) => ({
    fontSize: 30,
    color: isHighlighted ? '#fff' : isDarkMode ? '#fff' : '#000',
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
