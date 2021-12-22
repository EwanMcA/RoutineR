import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';

const FREQUENCIES = {
  1: 'd',
  7: 'w',
  30: 'm',
};

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const getBubbleColour = timeRatio =>
  timeRatio > 1
    ? 'darkred'
    : `rgb(${timeRatio * 255}, 70, ${255 - timeRatio * 255})`;

const getFrequencyString = (times, period) =>
  times === 1 ? `${FREQUENCIES[period]}` : `${times} / ${FREQUENCIES[period]}`;

const Bubble = ({now, title, frequency, lastReset, reset, selected}) => {
  const period = (frequency[1] * MS_IN_DAY) / frequency[0];
  const timeRatio = (now - lastReset) / period;
  const backgroundStyle = { backgroundColor: getBubbleColour(timeRatio) };
  const borderStyle = selected ? { borderColor: '#77E', borderWidth: 1 } : {};
  const bubbleStyle = StyleSheet.flatten([backgroundStyle, borderStyle, styles.bubble]);

  return (
    <View style={bubbleStyle}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.body}>
        <Text style={styles.frequency}>{getFrequencyString(...frequency)}</Text>
        <Button
          onPress={() => reset()}
          icon={{
            name: "bullseye",
            type: 'font-awesome',
            size: 20,
            color: "#FAC"
          }}
          type="clear"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 18,
  },
  bubble: {
    borderRadius: 10,
    flexGrow: 0,
    padding: 10,
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  frequency: {
    color: 'white',
    fontSize: 18,
  },
});

export default Bubble;
