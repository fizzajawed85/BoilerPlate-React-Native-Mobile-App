import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Facebook, Linkedin, Github } from 'lucide-react-native';

import Svg, { Path } from 'react-native-svg';

const GoogleIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#ea4335"
    />
  </Svg>
);

const SocialLogins = () => {
  const socialButtons = [
    { icon: GoogleIcon, label: 'Google' },
    { icon: Facebook, color: '#1877f2', label: 'Facebook' },
    { icon: Linkedin, color: '#0a66c2', label: 'LinkedIn' },
    { icon: Github, color: '#fff', label: 'GitHub' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>SECURE SOCIAL LOGIN</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.grid}>
        {socialButtons.map((social) => (
          <TouchableOpacity
            key={social.label}
            style={styles.socialBtn}
            activeOpacity={0.7}
          >
            {social.label === 'Google' ? (
              <social.icon />
            ) : (
              <social.icon 
                size={20} 
                color={social.label === 'GitHub' ? '#fff' : (social as any).color} 
                strokeWidth={2.5}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(71, 85, 105, 0.3)', // slate-700/30
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#94a3b8', // slate-400
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 52,
    backgroundColor: 'rgba(30, 41, 59, 0.2)', // slate-800/20
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.3)', // slate-700/30
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SocialLogins;
