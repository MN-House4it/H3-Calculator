import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Dropdown = ({
    data,
    selectValue,
    oneSelect
}) => {
    const [option, setOption] = React.useState(false);

    const selectOption = () => {
        setOption(!option);
    };

    const oneSelectItem = (val) => {
        setOption(false);
        oneSelect(val);
    };

    return (
        <View style={{}}>
            <TouchableOpacity
                style={styles.dropDownStyle}
                onPress={selectOption}
            >
            <Text style={styles.dropDownTextStyle}>{!!selectValue ? selectValue.name : 'Choose a calculater to copy from'}</Text>
            </TouchableOpacity>
            {option && (
                <View style={styles.openDropDown}>
                    {data.map((val, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => oneSelectItem(val)}
                            style={{
                                ...styles.optionName,
                                backgroundColor: val.id === selectValue.id ? 'pink' : 'yellow',
                            }}
                        >
                            <Text>{val.name + ' - ' + val.lastResult}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    dropDownStyle: {
        backgroundColor: '#333333',
        color: '#fff',
        minHeight: 40,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        width: '100%',
    },
    openDropDown: {
        backgroundColor: 'red',
        padding: 10,
        marginVertical: 5,
    },
    optionName: {
        margin: 5,
        padding: 10,
        borderRadius: 4,
    },
    dropDownTextStyle: {
        color: '#fff', 

    },
});

export default Dropdown;
