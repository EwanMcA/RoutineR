import React, {useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {ButtonGroup} from 'react-native-elements';

export const PERIOD = {
  DAY: 1,
  WEEK: 7,
  MONTH: 30,
};

const PERIOD_OPTIONS = ['DAY', 'WEEK', 'MONTH'];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Task = ({route, navigation}) => {
  const {section, title, frequency, history, onSubmit} = route.params;
  const [bubbleTitle, setBubbleTitle] = useState(title || '');
  const [times, setTimes] = useState(frequency ? frequency[0] : 1);
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const now = Date.now();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Section: {section}</Text>
      <TextInput
        style={styles.titleInput}
        placeholder="Enter a title..."
        onChangeText={text => setBubbleTitle(text)}
        maxLength={24}
        placeholderTextColor="white"
        defaultValue={title}
      />
      <TextInput
        style={styles.titleInput}
        placeholder="How often..."
        onChangeText={times => setTimes(times.replace(/[^0-9]/g, ''))}
        maxLength={6}
        placeholderTextColor="white"
        defaultValue={frequency && frequency[0]}
      />
      <Text style={styles.text}>per</Text>
      <ButtonGroup
        onPress={setSelectedPeriod}
        selectedIndex={selectedPeriod}
        buttons={PERIOD_OPTIONS}
        containerStyle={{height: 50}}
      />
      <View style={styles.history}>
        {[6, 5, 4, 3, 2, 1, 0].map(entry => {
          const date = new Date(now - 1000 * 60 * 60 * 24 * entry);
          const filled = history && history.find(
            h => new Date(h).toDateString() === date.toDateString(),
          );
          return (
            <View style={filled ? styles.filledHistory : styles.emptyHistory}>
              <Text style={styles.date}>{DAYS[date.getDay()]}</Text>
              <Text style={styles.date}>{date.getDate()}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.addTaskButton}>
        <Button
          onPress={() => {
            onSubmit(bubbleTitle, [
              times,
              PERIOD[PERIOD_OPTIONS[selectedPeriod]],
            ]);
            navigation.navigate('Home');
          }}
          disabled={!bubbleTitle.length || !times}
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
  history: {
    flexDirection: 'row',
    marginTop: 40,
    height: 50,
    width: '100%',
  },
  filledHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#252',
    borderColor: 'white',
    borderWidth: 1,
    height: 50,
    width: '14.25%',
  },
  emptyHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#622',
    borderColor: 'white',
    borderWidth: 1,
    height: 50,
    width: '14.25%',
  },
  date: {
    color: 'white',
  },
  addTaskButton: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    width: 100,
  },
});

export default Task;
