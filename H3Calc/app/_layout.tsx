import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import Calculator from '../components/Calculator';
import CalculatorOverview from '../components/CalculatorOverview';
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="CalculatorOverview">
          <Stack.Screen name="Calculator Overview" component={CalculatorOverview} />
          <Stack.Screen name="Calculator" component={Calculator} />
        </Stack.Navigator>  
      </NavigationContainer>
    </ThemeProvider>
  );
}
