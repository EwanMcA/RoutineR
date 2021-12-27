import React, {useContext, useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import {ButtonGroup} from 'react-native-elements';

import {MS_IN_DAY, PERIOD, PERIOD_LABELS, DAYS} from './Constants';
import {TaskContext} from './TaskProvider';

const onSameDay = (a, b) =>
  Math.floor(a / MS_IN_DAY) === Math.floor(b / MS_IN_DAY);

const Task = ({route, navigation}) => {
  const {
    id,
    section,
    title: existingTitle,
    frequency,
    history: existingHistory,
  } = route.params;
  const {createTask, updateTask} = useContext(TaskContext);
  const [title, setTitle] = useState(existingTitle || '');
  const [times, setTimes] = useState(frequency ? frequency[0] : 1);
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [history, setHistory] = useState(existingHistory || []);
  const now = Date.now();
  const historyStart =
    (Math.floor(now / (MS_IN_DAY * 7)) - 3) * MS_IN_DAY * 7 - MS_IN_DAY * 4;
  const historyChart = [];
  for (
    let i = historyStart;
    i <= Math.floor(now / MS_IN_DAY) * MS_IN_DAY;
    i += MS_IN_DAY
  ) {
    historyChart.push(i);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Section: {section}</Text>
      <TextInput
        style={styles.titleInput}
        placeholder="Enter a title..."
        onChangeText={text => setTitle(text)}
        maxLength={24}
        placeholderTextColor="white"
        defaultValue={existingTitle}
      />
      <View style={{alignItems: 'center', flexDirection: 'row'}}>
        <Text style={styles.text}>Frequency: </Text>
        <TextInput
          style={styles.freqInput}
          placeholder="How often..."
          onChangeText={times => setTimes(times.replace(/[^0-9]/g, ''))}
          maxLength={6}
          placeholderTextColor="white"
          defaultValue={frequency && frequency.length && frequency[0]}
        />
      </View>
      <Text style={styles.text}>Per</Text>
      <ButtonGroup
        onPress={setSelectedPeriod}
        selectedIndex={selectedPeriod}
        buttons={PERIOD_LABELS}
        containerStyle={{height: 50}}
        buttonStyle={{backgroundColor: '#333'}}
        selectedButtonStyle={{backgroundColor: '#327'}}
      />
      <View style={styles.history}>
        {historyChart.map(entry => {
          const entryDate = new Date(entry);
          const filled = history.some(historyEntry =>
            onSameDay(historyEntry, entry),
          );

          return (
            <TouchableHighlight
              key={entry}
              style={styles.historyEntry}
              onPress={() => {}}
              onLongPress={() => {
                if (filled) {
                  setHistory(
                    history.filter(
                      historyEntry => !onSameDay(historyEntry, entry),
                    ),
                  );
                } else {
                  setHistory([...history, entry]);
                }
              }}>
              <View style={filled ? styles.filledHistory : styles.emptyHistory}>
                <Text style={styles.date}>{DAYS[entryDate.getDay()]}</Text>
                <Text style={styles.date}>{entryDate.getDate()}</Text>
              </View>
            </TouchableHighlight>
          );
        })}
      </View>
      <View style={styles.addTaskButton}>
        <Button
          onPress={() => {
            const newTask = {
              section,
              title,
              frequency: [times, PERIOD[PERIOD_LABELS[selectedPeriod]]],
              history,
            };
            if (id) {
              updateTask(id, newTask);
            } else {
              createTask(newTask);
            }
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
    position: 'absolute',
    top: 10,
    right: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
    marginBottom: 15,
  },
  titleInput: {
    color: 'white',
    fontSize: 22,
  },
  freqInput: {
    color: 'white',
    fontSize: 18,
    marginBottom: 15,
  },
  history: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 40,
    height: 50,
    width: '100%',
  },
  historyEntry: {
    borderColor: 'white',
    borderRadius: 30,
    borderWidth: 1,
    overflow: 'hidden',
    height: 52,
    width: '14.25%',
  },
  filledHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#474',
    height: 50,
    width: '100%',
  },
  emptyHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '100%',
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
