import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    loadNotes();
  }, []);

  const saveNotes = async (newNotes) => {
    await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
  };

  const loadNotes = async () => {
    const saved = await AsyncStorage.getItem('notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  };

  const addNote = () => {
    if (note.trim() === '') return;
    const newNotes = [...notes, { id: Date.now().toString(), text: note }];
    setNotes(newNotes);
    saveNotes(newNotes);
    setNote('');
  };

  const deleteNote = (id) => {
    const filtered = notes.filter((n) => n.id !== id);
    setNotes(filtered);
    saveNotes(filtered);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Моите бележки</Text>
      <TextInput
        style={styles.input}
        placeholder="Напиши бележка..."
        value={note}
        onChangeText={setNote}
      />
      <Button title="Добави бележка" onPress={addNote} />

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => deleteNote(item.id)}
            style={styles.note}
          >
            <Text>{item.text}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  note: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginTop: 10,
    borderRadius: 5
  }
});
