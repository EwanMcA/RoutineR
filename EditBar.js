import React from 'react';
import {Button, Modal, StyleSheet, Text, View} from 'react-native';

const EditBar = ({canEdit, onEdit, onDelete}) => (
  <View style={styles.editBar}>
    <View style={styles.editButton}>
      <Button
        onPress={onEdit}
        disabled={!canEdit}
        title="Edit"
        color="#333"
        accessibilityLabel="Edit Task"
      />
    </View>
    <View style={styles.editButton}>
      <Button
        onPress={onDelete}
        title="Delete"
        color="#933"
        accessibilityLabel="Delete Selected Tasks"
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  editBar: {
    bottom: 0,
    flexDirection: 'row',
    padding: 5,
    position: 'absolute',
    justifyContent: 'space-between',
    width: '100%',
  },
  editButton: {
    width: 100,
  },
});

export default EditBar;
