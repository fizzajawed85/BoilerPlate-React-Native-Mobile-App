import { View, StyleSheet, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  intensity?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, intensity = 20, style, ...props }) => {
  const { isDark, colors } = useTheme();
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.7)',
          borderColor: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)',
        },
        style
      ]} 
      {...props}
    >
      <BlurView intensity={intensity} tint={isDark ? "dark" : "light"} style={styles.blur}>
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  blur: {
    width: '100%',
  },
  content: {
    padding: 0, // Removed hardcoded padding to prevent vertical breakage
  },
});

export default GlassCard;
