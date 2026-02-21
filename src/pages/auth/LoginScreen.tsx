import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/GlassCard';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Layout from '../../components/Layout';
import SocialLogins from '../../components/SocialLogins';
import { useTheme } from '../../context/ThemeContext';
import { Activity, ArrowRight } from 'lucide-react-native';

const { height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuth();
  const { colors, isDark } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.headerContainer}>
           <View style={[styles.logoRing, { borderColor: colors.primary + '30', backgroundColor: colors.primary + '10' }]}>
             <ArrowRight color={colors.primary} size={26} strokeWidth={2} />
           </View>
           <Text style={[styles.brandTitle, { color: '#fff' }]}>Med<Text style={[styles.brandTitleBold, { color: colors.primary }]}>Point</Text></Text>
           <Text style={[styles.welcomeText, { color: '#fff' }]}>Welcome Back</Text>
        </View>

        <GlassCard style={styles.formCard}>
          <Text style={styles.cardSubtitle}>Sign in to access your medical dashboard.</Text>
          
          <View style={styles.inputSection}>
            <Input 
              label="Email Address" 
              placeholder="doctor@medpoint.com" 
              keyboardType="email-address" 
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <Input 
              label="Password" 
              placeholder="••••••••" 
              secureTextEntry 
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity 
              style={styles.forgotBtn}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <Button 
            variant="premium"
            title={loading ? "Checking..." : "Secure Sign In"} 
            icon={<ArrowRight color="#fff" size={20} strokeWidth={1.5} />}
            onPress={handleLogin} 
            disabled={loading}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>QUICK LOGIN</Text>
            <View style={styles.divider} />
          </View>

          <SocialLogins />

          <View style={styles.footer}>
            <Text style={styles.footerText}>New here? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.link, { color: colors.primary }]}>Join MedPoint</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: height < 700 ? 10 : 20,
  },
  logoRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    marginBottom: 6,
  },
  brandTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 1,
  },
  brandTitleBold: {
    fontWeight: '800',
    color: '#6366f1',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 2,
  },
  formCard: {
    borderRadius: 30,
    paddingVertical: height < 700 ? 15 : 25,
    paddingHorizontal: 20,
  },
  cardSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: height < 700 ? 10 : 15,
  },
  inputSection: {
    marginBottom: 10,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -5,
    marginBottom: 5,
  },
  forgotText: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height < 700 ? 10 : 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  dividerText: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '800',
    marginHorizontal: 12,
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height < 700 ? 10 : 15,
  },
  footerText: {
    color: '#64748b',
    fontSize: 13,
  },
  link: {
    color: '#6366f1',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default LoginScreen;
