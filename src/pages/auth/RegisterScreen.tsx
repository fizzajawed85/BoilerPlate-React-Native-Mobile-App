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
import { Activity, UserPlus } from 'lucide-react-native';

const { height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { register } = useAuth();
  const { colors, isDark } = useTheme();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await register({ username, email, password });
      Alert.alert('Success', 'Account created successfully! Please login.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error: any) {
      console.error('Registration error:', error);
      let message = 'Registration failed. Please try again.';
      
      if (error.response) {
        message = error.response.data?.message || message;
      } else if (error.request) {
        message = 'Cannot connect to server. Check your local connection.';
      } else {
        message = error.message || message;
      }
      
      Alert.alert('Error', message);
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
             <UserPlus color={colors.primary} size={26} strokeWidth={2} />
           </View>
           <Text style={[styles.brandTitle, { color: '#fff' }]}>Med<Text style={[styles.brandTitleBold, { color: colors.primary }]}>Point</Text></Text>
           <Text style={[styles.welcomeText, { color: '#fff' }]}>Create Account</Text>
        </View>

        <GlassCard style={styles.formCard}>
          <Text style={styles.cardSubtitle}>Join the medical community today.</Text>
          
          <View style={styles.inputSection}>
            <Input 
              label="Full Name" 
              placeholder="Dr. John Doe" 
              value={username}
              onChangeText={setUsername}
            />
            <Input 
              label="Email Address" 
              placeholder="name@medpoint.com" 
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
          </View>

          <Button 
            variant="premium"
            title={loading ? "Joining..." : "Join MedPoint"} 
            icon={<UserPlus color="#fff" size={20} strokeWidth={1.5} />}
            onPress={handleRegister} 
            disabled={loading}
          />

          <SocialLogins />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already member? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.link, { color: colors.primary }]}>Sign In</Text>
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
    marginBottom: height < 700 ? 10 : 15,
  },
  logoRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    marginBottom: 6,
  },
  brandTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 1,
  },
  brandTitleBold: {
    fontWeight: '800',
    color: '#6366f1',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  formCard: {
    borderRadius: 30,
    paddingVertical: height < 700 ? 15 : 20,
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
    marginBottom: 8,
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

export default RegisterScreen;
