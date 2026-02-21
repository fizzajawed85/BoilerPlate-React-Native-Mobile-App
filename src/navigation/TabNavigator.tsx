import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  Home, 
  Calendar, 
  ClipboardList, 
  User, 
  PlusCircle 
} from 'lucide-react-native';

import DashboardScreen from '../pages/DashboardScreen';
import UpcomingAppointmentsScreen from '../pages/UpcomingAppointmentsScreen';
import MedicalRecordsScreen from '../pages/MedicalRecordsScreen';
import ProfileScreen from '../pages/ProfileScreen';
import BookAppointmentScreen from '../pages/BookAppointmentScreen';

import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { backgroundColor: colors.card, borderTopColor: colors.border }],
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="Visits" 
        component={UpcomingAppointmentsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      
      {/* Centered Add Button */}
      <Tab.Screen 
        name="Book" 
        component={BookAppointmentScreen} 
        options={{
          tabBarButton: (props: any) => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('BookAppointment')}
              style={styles.actionButtonContainer}
              activeOpacity={0.8}
            >
              <View style={[styles.actionButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
                <PlusCircle color="#fff" size={30} />
              </View>
            </TouchableOpacity>
          ),
          tabBarLabel: () => null,
        }}
      />

      <Tab.Screen 
        name="Records" 
        component={MedicalRecordsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 100 : 85,
    paddingBottom: Platform.OS === 'ios' ? 35 : 25,
    paddingTop: 10,
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
  actionButtonContainer: {
    width: 60,
    height: 70,
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderWidth: 3,
    borderColor: 'transparent',
  }
});

export default TabNavigator;
