import { View, StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Background Gradients (Blobs) */}
      <View style={[styles.blob1, { opacity: isDark ? 0.6 : 0.2 }]}>
        <LinearGradient
          colors={[colors.primary + '60', 'transparent']}
          style={styles.gradientBlob}
        />
      </View>
      
      <View style={[styles.blob2, { opacity: isDark ? 0.6 : 0.2 }]}>
        <LinearGradient
          colors={[isDark ? 'rgba(30, 41, 59, 0.4)' : colors.primary + '20', 'transparent']}
          style={styles.gradientBlob}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.content}>
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 0, // Removed global padding to let screens manage their own spacing
    zIndex: 10,
  },
  blob1: {
    position: 'absolute',
    top: -height * 0.1,
    left: -width * 0.2,
    width: width,
    height: width,
    borderRadius: width / 2,
  },
  blob2: {
    position: 'absolute',
    bottom: -height * 0.1,
    right: -width * 0.2,
    width: width,
    height: width,
    borderRadius: width / 2,
  },
  gradientBlob: {
    flex: 1,
    borderRadius: width / 2,
  },
});

export default Layout;
