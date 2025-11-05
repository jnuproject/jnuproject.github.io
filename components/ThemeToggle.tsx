import { useTheme } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Pressable onPress={toggleTheme} style={{ paddingHorizontal: 12 }}>
      <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={24} color={isDark ? '#fff' : '#000'} />
    </Pressable>
  );
};