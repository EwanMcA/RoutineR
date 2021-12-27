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
import {TaskProvider} from './TaskProvider';

const Stack = createNativeStackNavigator();

const App: () => Node = () => (
  <NavigationContainer>
    <TaskProvider>
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
    </TaskProvider>
  </NavigationContainer>
);

export default App;
