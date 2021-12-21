import React, { useState } from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import { ButtonGroup } from 'react-native-elements';

import { PERIOD } from './Home';


const AddTask = ({route, navigation}) => {
  const [title, setTitle] = useState('');
  const [times, setTimes] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Adding task to {route.params.section}</Text>
      <TextInput
        style={styles.titleInput}
        placeholder="Enter a title..."
        onChangeText={text => setTitle(text)}
        maxLength={24}
        placeholderTextColor='white'
      />
      <TextInput
        style={styles.titleInput}
        placeholder="How often..."
        onChangeText={times => setTimes(times.replace(/[^0-9]/g, ''))}
        maxLength={6}
        placeholderTextColor='white'
      />
      <Text style={styles.text}>per</Text>
      <ButtonGroup
        onPress={setSelectedPeriod}
        selectedIndex={selectedPeriod}
        buttons={['DAY', 'WEEK', 'MONTH']}
        containerStyle={{height: 50}}
      />
      <View style={styles.addTaskButton}>
      <Button
        onPress={() => {
          route.params.handleAdd(title, [times, [PERIOD.DAY, PERIOD.WEEK, PERIOD.MONTH][selectedPeriod]]);
          navigation.navigate('Home');
        }}
        disabled={!title.length || !times}
        title="+"
        color="#333"
        accessibilityLabel="Confirm Task"
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#222',
    height: '100%',
  },
  heading: {
    color: 'white',
    fontSize: 18,
    marginBottom: 30,
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginBottom: 30,
    marginLeft: 5,
    marginTop: 30,
  },
  titleInput: {
    color: 'white',
  },
  addTaskButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    width: 100,
  },
});

export default AddTask;
