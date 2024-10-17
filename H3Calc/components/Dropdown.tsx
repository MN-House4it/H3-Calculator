import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Dropdown = ({ data, selectValue, oneSelect }) => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleDropdown = () => {
        setIsVisible(!isVisible);
    };

    const oneSelectItem = (val) => {
        setIsVisible(false);
        oneSelect(val);
    };

    const cancelSelection = () => {
        setIsVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.dropDownStyle(isDarkMode)}
                onPress={toggleDropdown}
            >
                <Icon name="swap-horiz" size={24} color={isDarkMode ? '#fff' : '#000'} />

            </TouchableOpacity>
            <Modal
                transparent={true}
                animationType="fade"
                visible={isVisible}
                onRequestClose={toggleDropdown}
            >
                <View style={styles.modalOverlay(isDarkMode)}>
                    <View style={styles.modalContent(isDarkMode)}>
                        <ScrollView style={styles.openDropDown} showsVerticalScrollIndicator={false} >
                            {data.map((val, i) => (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => oneSelectItem(val)}
                                    style={{
                                        ...styles.optionName,
                                        backgroundColor: val.id === selectValue.id ? '#ff9f9f' : isDarkMode ? '#444' : '#eee',
                                    }}
                                >
                                    <Text style={styles.optionText(isDarkMode)}>{val.name + ' - ' + val.lastResult}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity 
                            style={styles.cancelButton} 
                            onPress={cancelSelection}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    dropDownStyle: (isDarkMode) => ({
        backgroundColor: isDarkMode ? '#333' : '#eee',
        color: '#fff',
        minHeight: 40,
        borderRadius: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        width: '100%',

    }),
    modalOverlay: (isDarkMode) => ({
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)', // Dark background
    }),
    modalContent: (isDarkMode) => ({
        backgroundColor: isDarkMode ? '#222' : '#fff',
        borderRadius: 10,
        padding: 10,
        maxHeight: 400, // Limit height to make it scrollable
        width: '80%', // Adjust based on your design
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    }),
    openDropDown: {
        padding: 10,
    },
    optionName: {
        margin: 5,
        padding: 10,
        borderRadius: 4,
    },
    dropDownTextStyle: (isDarkMode) => ({
        color: isDarkMode ? '#fff' : '#000',
    }),
    optionText: (isDarkMode) => ({
        color: isDarkMode ? '#fff' : '#333', // Improved contrast for option text
    }),
    cancelButton: {
        backgroundColor: '#ff4444', // Red color for the cancel button
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Dropdown;
