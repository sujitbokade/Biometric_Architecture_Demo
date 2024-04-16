/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import RTNMyBiometric from 'rtn-my-biometric/js/NativeMyBiometric';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import BiometricDemo from './src/screens/BiometricDemo';

function App(): JSX.Element {
  const [biometric, setBiometric] = useState('');
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
        }}>
        <Stack.Screen name={'BiometricDemo'} component={BiometricDemo} />
      </Stack.Navigator>
    </NavigationContainer>
    // <SafeAreaView style={backgroundStyle}>
    //   <StatusBar
    //     barStyle={isDarkMode ? 'light-content' : 'dark-content'}
    //     backgroundColor={backgroundStyle.backgroundColor}
    //   />
    //   <TouchableOpacity
    //     onPress={async () => {
    //       try {
    //         const data = await RTNMyBiometric?.getAvailableBiometric()!;
    //         console.log(data);
    //         setBiometric(data ?? '');
    //       } catch (e) {
    //         console.log(e);
    //       }
    //     }}>
    //     <Text>Get available biometricss</Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity
    //     onPress={async () => {
    // try {
    //   const isAuthenticated = await RTNMyBiometric?.authenticate();
    //   console.log('ISAuthenticated', isAuthenticated);
    // } catch (e) {
    //   console.log(e);
    // }
    //     }}>
    //     <Text>Authenticate Locally using biometric</Text>
    //   </TouchableOpacity>
    //   <Text>Biometrics are: {biometric}</Text>
    // </SafeAreaView>
  );
}

export default App;
