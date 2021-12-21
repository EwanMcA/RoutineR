import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  useColorScheme,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import Bubble from './Bubble';

const NUM_COLUMNS = 3;
export const PERIOD = {
  DAY: 1,
  WEEK: 7,
  MONTH: 30,
};

const EXAMPLE_DATA = {
  excercise: {
    Cardio: {
      frequency: [3, PERIOD.WEEK],
      lastReset: Date.now(),
    },
    Resistance: {
      frequency: [2, PERIOD.WEEK],
      lastReset: Date.now(),
    },
  },
  wellbeing: {
    Meditate: {
      frequency: [2000, PERIOD.DAY],
      lastReset: Date.now(),
    },
    Read: {
      frequency: [3, PERIOD.WEEK],
      lastReset: Date.now(),
    },
  },
  misc: {
    Cook: {
      frequency: [1, PERIOD.WEEK],
      lastReset: Date.now(),
    },
    'Water Plants': {
      frequency: [2, PERIOD.MONTH],
      lastReset: Date.now(),
    },
    Code: {
      frequency: [1, PERIOD.WEEK],
      lastReset: Date.now(),
    },
    Italian: {
      frequency: [4, PERIOD.WEEK],
      lastReset: Date.now(),
    },
    Brain: {
      frequency: [4, PERIOD.WEEK],
      lastReset: Date.now(),
    },
  },
};

const storeBubbles = async bubbles => {
  try {
    const jsonValue = JSON.stringify(bubbles);
    await AsyncStorage.setItem('bubbles', jsonValue);
  } catch (e) {
    console.error(e);
  }
};

const getBubbles = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('bubbles');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
  }
};

const Home = ({navigation}) => {
  const [bubbles, setBubbles] = useState(EXAMPLE_DATA);
  const [now, setNow] = useState(Date.now());

  useEffect(async () => {
    const setDate = () => setNow(Date.now());
    setInterval(setDate, 5000);
    getBubbles().then(storedBubbles =>
      setBubbles(storedBubbles || EXAMPLE_DATA),
    );

    return clearInterval(setDate);
  }, []);

  const backgroundStyle = {
    backgroundColor: Colors.darker,
    height: '100%',
  };

  const handleReset = (section, title) => {
    const updatedBubbles = {
      ...bubbles,
      [section]: {
        ...bubbles[section],
        [title]: {
          ...bubbles[section][title],
          lastReset: Date.now(),
        },
      },
    };
    setBubbles(updatedBubbles);
    storeBubbles(updatedBubbles);
  };

  const handleAddTask = (section, title, frequency) => {
    const updatedBubbles = {
      ...bubbles,
      [section]: {
        ...bubbles[section],
        [title]: {
          frequency: frequency,
          lastReset: Date.now(),
        },
      },
    };
    setBubbles(updatedBubbles);
    storeBubbles(updatedBubbles);
  };

  const handleDeleteTask = (section, title) => {
    const updatedBubbles = bubbles;
    delete updatedBubbles[section][title];
    setBubbles(updatedBubbles);
    storeBubbles(updatedBubbles);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      {Object.keys(bubbles).map(section => (
        <View key={section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.heading}>{section}</Text>
            <View style={styles.addSectionButton}>
              <Button
                onPress={() =>
                  navigation.navigate('Add Task', {
                    section: section,
                    handleAdd: (title, frequency) =>
                      handleAddTask(section, title, frequency),
                  })
                }
                title=" + "
                color="#333"
                accessibilityLabel="Add Task"
              />
            </View>
          </View>
          <FlatList
            data={Object.keys(bubbles[section])}
            numColumns={NUM_COLUMNS}
            keyExtractor={({item}) => item}
            renderItem={({item}) => (
              <View style={{width: `${100 / NUM_COLUMNS}%`}}>
                <TouchableHighlight
                  onLongPress={() => setEditBubble(item)}
                  underlayColor="white">
                  <Bubble
                    {...bubbles[section][item]}
                    title={item}
                    now={now}
                    reset={() => handleReset(section, item)}
                  />
                </TouchableHighlight>
              </View>
            )}
            columnWrapperStyle={
              {
                //justifyContent: 'space-evenly',
              }
            }
          />
        </View>
      ))}
      <View style={styles.addSectionButton}>
        <Button
          onPress={() => {}}
          title="+"
          color="#333"
          accessibilityLabel="Add Section"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
    marginTop: 10,
    textTransform: 'capitalize',
  },
  addSectionButton: {
    position: 'absolute',
    bottom: 5,
    width: 100,
    right: 0,
  },
});

export default Home;
