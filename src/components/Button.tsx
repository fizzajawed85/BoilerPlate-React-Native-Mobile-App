import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, View, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'premium';
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({ title, icon, style, variant = 'primary', textStyle, ...props }) => {
  const isPremium = variant === 'premium';
  
  const renderContent = () => (
    <View style={styles.content}>
      <Text style={[styles.text, isPremium && styles.premiumText, textStyle]}>{title}</Text>
      {icon && (
        <View style={[styles.iconContainer, isPremium && styles.premiumIconStyle]}>
          {icon}
        </View>
      )}
    </View>
  );

  if (isPremium) {
    return (
      <TouchableOpacity 
        style={[styles.premiumWrapper, style]} 
        activeOpacity={0.8} 
        {...props}
      >
        <LinearGradient
          colors={['#6366f1', '#4f46e5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.premiumGradient}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.button, styles[variant], style]} 
      activeOpacity={0.7} 
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  secondary: {
    backgroundColor: 'rgba(30, 41, 59, 0.2)',
    borderColor: 'rgba(71, 85, 105, 0.4)',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
  },
  premiumWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 10,
    height: 56,
  },
  premiumGradient: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  premiumText: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginLeft: 12, // Reduced offset for subtle integration
  },
  iconContainer: {
    opacity: 0.8,
  },
  premiumIconStyle: {
    opacity: 0.9,
    // Removed the white circle for a cleaner, more integrated look
  },
});

export default Button;
