import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Modal, TextInput } from 'react-native';
import { useCalculatorOverviewViewModel } from '../viewmodels/CalculatorOverviewViewModel';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/useColorScheme';

const CalculatorOverview: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    calculators,
    isModalVisible,
    newName,
    setNewName,
    addCalculator,
    deleteCalculator,
    showEditModal,
    saveNewName,
    setIsModalVisible,
    copyToClipboard
  } = useCalculatorOverviewViewModel();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.itemContainer, { backgroundColor: isDarkMode ? '#2e2e2e' : '#eee' }]}>
      <TouchableOpacity onPress={() => navigation.navigate('Calculator', { calculatorId: item.id, calculatorName: item.name })}>
        <Text style={[styles.itemText, { color: isDarkMode ? '#fff' : '#000' }]}>{item.name}</Text>
        <Text style={[styles.itemText, { color: isDarkMode ? '#fff' : '#000' }]}>Last result: {typeof item?.lastResult === 'string' ? item.lastResult.substring(0, 20) : 'N/A'}</Text>
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => showEditModal(item)}>
          <Icon name="edit" size={24} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => {copyToClipboard(item)}}>
          <Icon name="content-copy" size={24} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => deleteCalculator(item.id)}>
          <Icon name="delete" size={24} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
      <FlatList
        data={calculators}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => addCalculator(navigation)}>
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#222' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? '#ffffff' : '#000000' }]}>Edit Calculator Name</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: isDarkMode ? '#444' : '#f0f0f0', color: isDarkMode ? '#ffffff' : '#000000' }]}
              value={newName}
              onChangeText={(text) => {
                if (text.length <= 20) setNewName(text);
              }}
              placeholder="Enter new name"
              placeholderTextColor={isDarkMode ? '#888' : '#666'}
            />
            <View style={styles.modalButtonCantainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.saveButton} 
                onPress={saveNewName}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            </View>
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
  },
  list: {
    marginTop: 16,
  },
  itemContainer: {
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 2,
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  modalButtonCantainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  textInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 70,
    height: 70,
    borderRadius: '50%',
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
},
cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
},
saveButton: {
    backgroundColor: '#2196f3',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
},
saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
}
});

export default CalculatorOverview;