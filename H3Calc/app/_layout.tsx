import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { AppState, AppStateStatus, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Calculator from '../views/Calculator';
import CalculatorOverview from '../views/CalculatorOverview';
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      Toast.show({
        type: 'success',
        text1: 'Velkommen',
      });
    }
  }, [loaded]);

  // Handle app state changes for showing toast
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        Toast.show({
          type: 'success',
          text1: 'Velkommen tilbage',
        });
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NavigationContainer independent={true}>
        <Stack.Navigator
          initialRouteName="CalculatorOverview"
          screenOptions={{
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#121212' : '#f5f5f5',
            },
            headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: colorScheme === 'dark' ? '#fff' : '#000',
            },
          }}
        >
          <Stack.Screen name="Calculators" component={CalculatorOverview} />
          <Stack.Screen name="Calculator" component={Calculator} />
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </ThemeProvider>
  );
}
