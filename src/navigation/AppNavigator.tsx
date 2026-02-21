import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../pages/auth/LoginScreen';
import RegisterScreen from '../pages/auth/RegisterScreen';
import ForgotPasswordScreen from '../pages/auth/ForgotPasswordScreen';
import VerifyOtpScreen from '../pages/auth/VerifyOtpScreen';
import ResetPasswordScreen from '../pages/auth/ResetPasswordScreen';
import WelcomeScreen from '../pages/WelcomeScreen';

// Healthcare Screens
import TabNavigator from './TabNavigator';
import DashboardScreen from '../pages/DashboardScreen';
import UpcomingAppointmentsScreen from '../pages/UpcomingAppointmentsScreen';
import AppointmentHistoryScreen from '../pages/AppointmentHistoryScreen';
import BookAppointmentScreen from '../pages/BookAppointmentScreen';
import MedicalRecordsScreen from '../pages/MedicalRecordsScreen';
import ProfileScreen from '../pages/ProfileScreen';
import BookingConfirmationScreen from '../pages/BookingConfirmationScreen';
import HelpSupportScreen from '../pages/HelpSupportScreen';
import NotificationScreen from '../pages/NotificationScreen';
import ConsultationBotScreen from '../pages/ConsultationBotScreen';

import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }} 
      initialRouteName={user ? "MainTabs" : "Welcome"}
    >
      {user ? (
        <>
          <Stack.Screen name="MainTabs"            component={TabNavigator} />
          {/* Individual screens only if they need to be opened as full-screen modals or are NOT in tabs */}
          <Stack.Screen name="AppointmentHistory"   component={AppointmentHistoryScreen} />
          <Stack.Screen name="BookAppointment"      component={BookAppointmentScreen} />
          <Stack.Screen name="BookingConfirmation"  component={BookingConfirmationScreen} />
          <Stack.Screen name="HelpSupport"          component={HelpSupportScreen} />
          <Stack.Screen name="MedicalRecords"       component={MedicalRecordsScreen} />
          <Stack.Screen name="Notifications"        component={NotificationScreen} />
          <Stack.Screen name="ConsultationBot"      component={ConsultationBotScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome"       component={WelcomeScreen} />
          <Stack.Screen name="Login"         component={LoginScreen} />
          <Stack.Screen name="Register"      component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="VerifyOtp"     component={VerifyOtpScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
