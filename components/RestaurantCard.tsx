import { Image, StyleSheet, Text, View } from 'react-native';

export const RestaurantCard = ({ name, desc, image }: any) => (
  <View style={styles.card}>
    <Image source={{ uri: image }} style={styles.image} />
    <View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  name: { fontSize: 16, fontWeight: 'bold' },
  desc: { fontSize: 14, color: '#555' },
});