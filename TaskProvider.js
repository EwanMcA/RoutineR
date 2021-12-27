import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {v4 as uuid} from 'uuid';

import {EXAMPLE_TASKS, EXAMPLE_SECTIONS} from './ExampleData';
import {MS_IN_DAY, TASKS_DATA_KEY, SECTIONS_DATA_KEY} from './Constants';

export const TaskContext = React.createContext({
  tasks: {},
  sections: [],
  setTasks: () => {},
  setSections: () => {},
});

const storeData = async (key, data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
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

export const TaskProvider = ({children}) => {
  const [tasks, setTasks] = useState(EXAMPLE_TASKS);
  const [sections, setSections] = useState(EXAMPLE_SECTIONS);

  useEffect(() => {
    fetchData(TASKS_DATA_KEY).then(storedTasks =>
      setTasks(storedTasks || EXAMPLE_TASKS),
    );
    fetchData(SECTIONS_DATA_KEY).then(storedSections =>
      setSections(storedSections || EXAMPLE_SECTIONS),
    );
  }, []);

  const storeTasks = tasks => {
    setTasks(tasks);
    storeData(TASKS_DATA_KEY, tasks);
  };
  const storeSections = sections => {
    setSections(sections);
    storeData(SECTIONS_DATA_KEY, sections);
  };

  const createTask = task => {
    storeTasks({
      ...tasks,
      [uuid()]: {
        ...task,
        lastReset: Date.now(),
      },
    });
  };

  const updateTask = (id, task) => {
    storeTasks({
      ...tasks,
      [id]: {
        ...tasks[id],
        ...task,
      },
    });
  };

  const resetTask = id => {
    const updatedTasks = tasks;
    const task = updatedTasks[id];
    task.lastReset = Date.now();
    if (task.history) {
      // Keep 90 days of history
      task.history = [...task.history, task.lastReset].filter(
        d => d > task.lastReset - 90 * MS_IN_DAY,
      );
    } else {
      task.history = [task.lastReset];
    }
    storeTasks(updatedTasks);
  };

  const deleteTasks = selectedTasks => {
    const updatedTasks = tasks;
    selectedTasks.forEach(id => {
      delete updatedTasks[id];
    });
    storeTasks(updatedTasks);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        sections,
        createTask,
        updateTask,
        resetTask,
        deleteTasks,
        setSections: storeSections,
      }}>
      {children}
    </TaskContext.Provider>
  );
};
