import {v4 as uuid} from 'uuid';

import { PERIOD } from './Task';

const NOW = Date.now();

export const EXAMPLE_BUBBLES = {
  // exercise,
  [uuid()]: {
    title: 'Cardio',
    frequency: [3, PERIOD.WEEK],
    lastReset: NOW,
    section: 'exercise',
  },
  [uuid()]: {
    title: 'Resistance',
    frequency: [2, PERIOD.WEEK],
    lastReset: NOW,
    section: 'exercise',
  },
  // wellbeing,
  [uuid()]: {
    title: 'Meditate',
    frequency: [2000, PERIOD.DAY],
    lastReset: NOW,
    section: 'wellbeing',
  },
  [uuid()]: {
    title: 'Read',
    frequency: [3, PERIOD.WEEK],
    lastReset: NOW,
    section: 'wellbeing',
  },
  // misc,
  [uuid()]: {
    title: 'Cook',
    frequency: [1, PERIOD.WEEK],
    lastReset: NOW,
    section: 'misc',
  },
  [uuid()]: {
    title: 'Water Plants',
    frequency: [2, PERIOD.MONTH],
    lastReset: NOW,
    section: 'misc',
  },
  [uuid()]: {
    title: 'Code',
    frequency: [1, PERIOD.WEEK],
    lastReset: NOW,
    section: 'misc',
  },
  [uuid()]: {
    title: 'Italian',
    frequency: [4, PERIOD.WEEK],
    lastReset: NOW,
    section: 'misc',
  },
  [uuid()]: {
    title: 'Brain',
    frequency: [4, PERIOD.WEEK],
    lastReset: NOW,
    section: 'misc',
  },
};

export const EXAMPLE_SECTIONS = [
  'exercise', 'wellbeing', 'misc',
];
