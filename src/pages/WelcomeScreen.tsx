import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Activity, Rocket } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

const { height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();

  return (
    <Layout>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.topSection}>
          {/* Classy Circular Logo */}
          <View style={[styles.logoRingOuter, { borderColor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)' }]}>
            <View style={[styles.logoRingInner, { borderColor: isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)' }]}>
               <View style={[styles.logoMain, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
                  <Activity color="#fff" size={height < 700 ? 32 : 38} strokeWidth={1.5} />
               </View>
            </View>
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.brandTitle, { color: isDark ? '#fff' : colors.text }]}>Med<Text style={[styles.brandTitleBold, { color: colors.primary }]}>Point</Text></Text>
            <View style={[styles.titleDot, { backgroundColor: colors.primary }]} />
          </View>
        </View>

        <View style={styles.bottomSection}>
          <GlassCard style={styles.formCard}>
            <Text style={[styles.cardTitle, { color: '#fff' }]}>Your Health,{"\n"}Simplified</Text>
            <Text style={[styles.cardSubtitle, { color: isDark ? '#94a3b8' : '#e2e8f0' }]}>
              Premium healthcare management at your fingertips.
            </Text>

            <Button 
              variant="premium"
              title="Get Started Now"
              icon={<Rocket color="#fff" size={20} strokeWidth={1.5} />}
              onPress={() => navigation.navigate('Register')}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Existing member? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.signInText, { color: colors.primary }]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: height < 700 ? 10 : 20,
  },
  topSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoRingOuter: {
    width: height < 700 ? 110 : 136,
    height: height < 700 ? 110 : 136,
    borderRadius: 70,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  logoRingInner: {
    width: height < 700 ? 80 : 100,
    height: height < 700 ? 80 : 100,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  logoMain: {
    width: height < 700 ? 58 : 70,
    height: height < 700 ? 58 : 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: height < 700 ? 8 : 12,
  },
  brandTitle: {
    fontSize: height < 700 ? 22 : 26,
    fontWeight: '300',
    letterSpacing: 1.5,
  },
  brandTitleBold: {
    fontWeight: '800',
  },
  titleDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginLeft: 5,
  },
  bottomSection: {
    paddingHorizontal: 16,
    marginBottom: height < 700 ? 8 : 15,
  },
  formCard: {
    borderRadius: 35,
    padding: height < 700 ? 20 : 28,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: height < 700 ? 22 : 26,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: height < 700 ? 28 : 34,
    marginBottom: height < 700 ? 6 : 8,
  },
  cardSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: height < 700 ? 20 : 25,
    paddingHorizontal: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  signInText: {
    fontSize: 14,
    fontWeight: '800',
  },
});

export default WelcomeScreen;
