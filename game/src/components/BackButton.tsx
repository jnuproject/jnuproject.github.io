import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
      activeOpacity={0.7}
    >
      <Ionicons name="arrow-back" size={28} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
});

export default BackButton;
