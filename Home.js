import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {v4 as uuid} from 'uuid';
import {
  Button,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  useColorScheme,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import Bubble from './Bubble';
import EditBar from './EditBar';
import {EXAMPLE_BUBBLES, EXAMPLE_SECTIONS} from './ExampleData';

const NUM_COLUMNS = 3;

const BUBBLES_DATA_KEY = 'bubbles';
const SECTIONS_DATA_KEY = 'sections';

const storeBubbles = async bubbles => {
  try {
    const jsonValue = JSON.stringify(bubbles);
    await AsyncStorage.setItem(BUBBLES_DATA_KEY, jsonValue);
  } catch (e) {
    console.error(e);
  }
};

const storeSections = async sections => {
  try {
    const jsonValue = JSON.stringify(sections);
    await AsyncStorage.setItem(SECTIONS_DATA_KEY, jsonValue);
  } catch (e) {
    console.error(e);
  }
};

const fetchData = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
  }
};

const Home = ({navigation}) => {
  const [bubbles, setBubbles] = useState([]);
  const [sections, setSections] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [selectedBubbles, setSelectedBubbles] = useState([]);
  const [sectionEditMode, setSectionEditMode] = useState(false);
  const bubbleEditMode = !!selectedBubbles.length;
  const hasEmptySection = !Object.values(bubbles).some(
    bubble => bubble.section == sections[sections.length - 1],
  );

  useEffect(() => {
    const setDate = () => setNow(Date.now());
    setInterval(setDate, 5000);
    fetchData(BUBBLES_DATA_KEY).then(storedBubbles =>
      setBubbles(storedBubbles || EXAMPLE_BUBBLES),
    );
    fetchData(SECTIONS_DATA_KEY).then(storedSections =>
      setSections(storedSections || EXAMPLE_SECTIONS),
    );

    return () => clearInterval(setDate);
  }, []);

  const backgroundStyle = {
    backgroundColor: Colors.darker,
    height: '100%',
  };

  const resetBubble = id => {
    const updatedBubbles = bubbles;
    const bubble = updatedBubbles[id];
    bubble.lastReset = Date.now();
    if (bubble.history) {
      bubble.history =
        bubble.history.length > 6
          ? [...bubble.history.slice(1), bubble.lastReset]
          : [...bubble.history, bubble.lastReset];
    } else {
      bubble.history = [bubble.lastReset];
    }
    setBubbles(updatedBubbles);
    storeBubbles(updatedBubbles);

    // trigger bubble render
    setNow(Date.now());
  };

  const createOrUpdateTask = (section, title, frequency, id, lastReset) => {
    const updatedBubbles = {
      ...bubbles,
      [id || uuid()]: {
        section: section,
        title: title,
        frequency: frequency,
        lastReset: lastReset || Date.now(),
      },
    };
    setBubbles(updatedBubbles);
    storeBubbles(updatedBubbles);
  };

  const deleteTasks = () => {
    const updatedBubbles = bubbles;
    selectedBubbles.forEach(id => {
      delete updatedBubbles[id];
    });
    setBubbles(updatedBubbles);
    storeBubbles(updatedBubbles);
    setSelectedBubbles([]);

    // trigger bubble render
    setNow(Date.now());
  };

  const handleBubblePress = id => {
    if (bubbleEditMode) {
      if (selectedBubbles.includes(id)) {
        setSelectedBubbles(selectedBubbles.filter(bubble => bubble !== id));
      } else {
        setSelectedBubbles([...selectedBubbles, id]);
      }
    }
  };

  const editBubble = id => {
    const bubble = bubbles[selectedBubbles[0]];
    setSelectedBubbles([]);
    navigation.navigate('Edit Task', {
      ...bubble,
      onSubmit: (title, frequency) =>
        createOrUpdateTask(
          bubble.section,
          title,
          frequency,
          id,
          bubble.lastReset,
        ),
    });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      {sections.map(section => (
        <View key={section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.heading}>{section}</Text>
            <View style={styles.addButton}>
              <Button
                onPress={() =>
                  navigation.navigate('Add Task', {
                    section: section,
                    onSubmit: (title, frequency) =>
                      createOrUpdateTask(section, title, frequency),
                  })
                }
                title=" + "
                color="#333"
                accessibilityLabel="Add Task"
              />
            </View>
          </View>
          <FlatList
            data={Object.keys(bubbles).filter(
              id => bubbles[id].section === section,
            )}
            numColumns={NUM_COLUMNS}
            keyExtractor={({item}) => item}
            renderItem={({item}) => (
              <View style={{width: `${100 / NUM_COLUMNS}%`}}>
                <TouchableHighlight
                  onPress={() => handleBubblePress(item)}
                  onLongPress={() =>
                    setSelectedBubbles([...selectedBubbles, item])
                  }>
                  <Bubble
                    {...bubbles[item]}
                    now={now}
                    reset={() =>
                      bubbleEditMode
                        ? handleBubblePress(item)
                        : resetBubble(item)
                    }
                    selected={selectedBubbles.includes(item)}
                  />
                </TouchableHighlight>
              </View>
            )}
          />
        </View>
      ))}
      {sectionEditMode && (
        <TextInput
          placeholder="Enter section title..."
          style={styles.heading}
          placeholderTextColor="white"
          onBlur={() => setSectionEditMode(false)}
          onSubmitEditing={e => {
            const updatedSections = [...sections, e.nativeEvent.text];
            setSections(updatedSections);
            storeSections(updatedSections);
          }}
        />
      )}
      {bubbleEditMode ? (
        <EditBar
          canEdit={selectedBubbles.length === 1}
          setSelectedBubbles={setSelectedBubbles}
          onEdit={() => editBubble(selectedBubbles[0])}
          onDelete={deleteTasks}
        />
      ) : (
        <>
          {hasEmptySection && (
            <View style={styles.removeButton}>
              <Button
                onPress={() => {
                  const updatedSections = sections.slice(0, -1);
                  setSections(updatedSections);
                  storeSections(updatedSections);
                }}
                title="-"
                color="#333"
                accessibilityLabel="Remove Section"
              />
            </View>
          )}
          <View style={styles.addButton}>
            <Button
              onPress={() => setSectionEditMode(true)}
              title="+"
              color="#333"
              accessibilityLabel="Add Section"
            />
          </View>
        </>
      )}
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
  addButton: {
    position: 'absolute',
    bottom: 5,
    width: 100,
    right: 5,
  },
  removeButton: {
    position: 'absolute',
    bottom: 5,
    width: 100,
    left: 5,
  },
});

export default Home;
