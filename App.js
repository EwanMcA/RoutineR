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
import Task from './Task';

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
        component={Task}
        options={{
          headerStyle: {
            backgroundColor: '#327',
          },
          headerTitleStyle: {
            color: 'white',
          },
        }}
      />
      <Stack.Screen
        name="Edit Task"
        component={Task}
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
