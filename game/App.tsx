import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HSC from './src/screens/HSC';
import G1S from './src/screens/G1S';
import G2S from './src/screens/G2S';
import G3S from './src/screens/G3S';
import G4S from './src/screens/G4S';
import G5S from './src/screens/G5S';
import G6S from './src/screens/G6S';
import G7S from './src/screens/G7S';
import G8S from './src/screens/G8S';
import G9S from './src/screens/G9S';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    DungGeunMo: require('./assets/fonts/DungGeunMo.ttf'),
  });

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    if (Text.defaultProps == null) {
      Text.defaultProps = {};
    }

    Text.defaultProps.style = {
      ...(Text.defaultProps.style || {}),
      fontFamily: 'DungGeunMo',
    };
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
    // Could render a splash or loading indicator here if desired.
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HSC} />
        <Stack.Screen name="Game1" component={G1S} />
        <Stack.Screen name="Game2" component={G2S} />
        <Stack.Screen name="Game3" component={G3S} />
        <Stack.Screen name="Game4" component={G4S} />
        <Stack.Screen name="Game5" component={G5S} />
        <Stack.Screen name="Game6" component={G6S} />
        <Stack.Screen name="Game7" component={G7S} />
        <Stack.Screen name="Game8" component={G8S} />
        <Stack.Screen name="Game9" component={G9S} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
