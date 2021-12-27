import React, {useContext, useEffect, useState} from 'react';
import type {Node} from 'react';
import 'react-native-get-random-values';
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
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {TaskContext} from './TaskProvider';
import Bubble from './Bubble';
import EditBar from './EditBar';
import {NUM_COLUMNS} from './Constants';

const Home = ({navigation}) => {
  const {tasks, sections, resetTask, deleteTasks, setSections} =
    useContext(TaskContext);
  const [now, setNow] = useState(Date.now());
  const [selectedBubbles, setSelectedBubbles] = useState([]);
  const [sectionEditMode, setSectionEditMode] = useState(false);
  const bubbleEditMode = !!selectedBubbles.length;
  const hasEmptySection = !Object.values(tasks).some(
    task => task.section == sections[sections.length - 1],
  );

  useEffect(() => {
    const dateInterval = setInterval(() => setNow(Date.now()), 5000);

    return () => clearInterval(dateInterval);
  }, []);

  const backgroundStyle = {
    backgroundColor: Colors.darker,
    height: '100%',
  };

  const selectBubble = id => {
    if (bubbleEditMode) {
      if (selectedBubbles.includes(id)) {
        setSelectedBubbles(selectedBubbles.filter(bubble => bubble !== id));
      } else {
        setSelectedBubbles([...selectedBubbles, id]);
      }
    }
  };

  const editBubble = id => {
    setSelectedBubbles([]);
    navigation.navigate('Edit Task', {
      id,
      ...tasks[id],
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
                  })
                }
                title=" + "
                color="#333"
                accessibilityLabel="Add Task"
              />
            </View>
          </View>
          <FlatList
            data={Object.keys(tasks).filter(
              id => tasks[id].section === section,
            )}
            numColumns={NUM_COLUMNS}
            keyExtractor={({item}) => item}
            renderItem={({item}) => (
              <View style={{width: `${100 / NUM_COLUMNS}%`}}>
                <TouchableHighlight
                  onPress={() => selectBubble(item)}
                  onLongPress={() =>
                    setSelectedBubbles([...selectedBubbles, item])
                  }>
                  <Bubble
                    {...tasks[item]}
                    now={now}
                    reset={() => {
                      selectBubble(item);
                      if (!bubbleEditMode) {
                        resetTask(item);
                        // Trigger bubble render
                        setNow(Date.now());
                      }
                    }}
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
          }}
        />
      )}
      {bubbleEditMode ? (
        <EditBar
          canEdit={selectedBubbles.length === 1}
          setSelectedBubbles={setSelectedBubbles}
          onEdit={() => editBubble(selectedBubbles[0])}
          onDelete={() => {
            deleteTasks(selectedBubbles);
            setSelectedBubbles([]);
            // Trigger bubble render
            setNow(Date.now());
          }}
        />
      ) : (
        <>
          {hasEmptySection && (
            <View style={styles.removeButton}>
              <Button
                onPress={() => {
                  const updatedSections = sections.slice(0, -1);
                  setSections(updatedSections);
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
