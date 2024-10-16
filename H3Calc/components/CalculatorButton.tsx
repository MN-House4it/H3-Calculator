import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CalculatorButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#333333',
    padding: 10,
    width: '22%',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 30,
    color: '#ffffff',
  },
});

export default CalculatorButton;