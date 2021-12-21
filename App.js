/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './Home';
import AddTask from './AddTask';

const Stack = createNativeStackNavigator();

const App: () => Node = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Add Task"
        component={AddTask}
        options={{
          headerStyle: {
            backgroundColor: '#327',
          },
          headerTitleStyle: {
            color: 'white',
          },
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
