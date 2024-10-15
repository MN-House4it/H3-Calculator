import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Modal, TextInput } from 'react-native';
import { localStorageService } from '../services/CalculatorStorage';
import { Calculator } from '../models/Calculator';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icons
//import Clipboard from '@react-native-clipboard/clipboard'; // Import clipboard
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect


const CalculatorOverview: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [calculators, setCalculators] = useState<Calculator[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility
  const [currentCalculator, setCurrentCalculator] = useState<Calculator | null>(null); // State to hold the calculator being edited
  const [newName, setNewName] = useState<string>(''); // State to hold the new name

  useFocusEffect(
    React.useCallback(() => {
      const fetchCalculators = async () => {
        const storedCalculators = await localStorageService.getCalculators();
        setCalculators(storedCalculators);
      };
  
      fetchCalculators();
    }, [])
  );
  

  // Function to add a new calculator
  const addCalculator = async () => {
    const newCalculator: Calculator = {
      id: Date.now().toString(), // Generate a unique ID based on the current timestamp
      name: "New Calculator",
      lastResult: 0,
      lastOperation: '',
      lastTyped: '0'
    };

    await localStorageService.addCalculator(newCalculator); // Add the calculator to local storage
    setCalculators((prev) => [...prev, newCalculator]); // Update state to include the new calculator

    navigation.navigate('Calculator', { calculatorId: newCalculator.id });
  };

  // Function to delete a calculator
  const deleteCalculator = async (id: string) => {
    await localStorageService.deleteCalculator(id); // Remove the calculator from local storage
    setCalculators((prev) => prev.filter(calculator => calculator.id !== id)); // Update state
  };

  // Function to show modal for editing a calculator's name
  const showEditModal = (calculator: Calculator) => {
    setCurrentCalculator(calculator);
    setNewName(calculator.name);
    setIsModalVisible(true);
  };

  // Function to save the new name
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

  // Function to copy the calculator's name to clipboard
  const copyToClipboard = (text: string) => {
    //Clipboard.setString(text);
  };

  const renderItem = ({ item }: { item: Calculator }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Calculator', { calculatorId: item.id })}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemText}>Last result: {item.lastResult}</Text>
      </TouchableOpacity> 
      <View style={styles.iconContainer}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => showEditModal(item)}
        >
          <Text><Icon name="edit" size={24} color="#fff" /></Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => copyToClipboard(item.lastOperation)}
        >
          <Text><Icon name="content-copy" size={24} color="#fff" /></Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => deleteCalculator(item.id)}
        >
          <Text><Icon name="delete" size={24} color="#f44336" /></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <FlatList
        data={calculators}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
      />

      <TouchableOpacity style={styles.addButton} onPress={addCalculator}>
          <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>


      {/* Modal for editing calculator name */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Calculator Name</Text>
            <TextInput
              style={styles.textInput}
              value={newName}
              onChangeText={(text) => {
                if (text.length <= 30) {
                  setNewName(text);
                }
              }}
              placeholder="Enter new name"
            />
            <Button title="Save" onPress={saveNewName} />
            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212', // Dark background
  },
  list: {
    marginTop: 16,
  },
  itemContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#1e1e1e', // Darker item background
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    color: '#ffffff', // White text for contrast
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
    padding: 8,
    color: '#ffffff', // Icon button text color
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker modal background
  },
  modalContent: {
    backgroundColor: '#2c2c2c', // Darker modal content background
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: '#ffffff', // White modal title text
  },
  textInput: {
    width: '100%',
    padding: 10,
    borderColor: '#444', // Darker border color
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#1e1e1e', // Dark background for input
    color: '#ffffff', // White text for input
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF8C00', // Change color as needed
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default CalculatorOverview;