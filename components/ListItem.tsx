import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  title: string;
  desc: string;
  tag: string;
  image: string;
  views: number;
  liked: boolean;
  onPress?: () => void;
}

export function ListItem({ title, desc, tag, image, views, liked, onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.tag}>#{tag}</Text>
          <View style={styles.stats}>
            <Ionicons name="eye-outline" size={14} color="#9CA3AF" />
            <Text style={styles.views}>{views}</Text>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={14}
              color={liked ? '#00a99c' : '#9CA3AF'}
              style={{ marginLeft: 6 }}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EDF3F2',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 14,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  desc: {
    fontSize: 12.5,
    color: '#555',
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tag: {
    fontSize: 12,
    color: '#00a99c',
    backgroundColor: '#E7F6F4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  views: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 3,
  },
});