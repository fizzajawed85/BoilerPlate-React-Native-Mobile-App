import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, Platform, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CheckCircle2, Calendar, Clock, MapPin, X } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';

const BookingConfirmationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors, isDark } = useTheme();
  
  const { doctorName, date, time, location, doctorImageUrl } = route.params || {
    doctorName: 'Dr. Emily Carter',
    date: 'Mon, July 15th',
    time: '2:00 PM',
    location: '123 Health Clinic, Suite 200',
    doctorImageUrl: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c77d?q=80&w=150&auto=format&fit=crop'
  };

  return (
    <Layout>
      <TouchableOpacity 
        onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
        style={[styles.closeBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }]}
      >
        <X color={colors.text} size={22} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={[styles.successIconContainer, { borderColor: colors.primary + '25' }]}>
             <View style={[styles.successIconInner, { backgroundColor: colors.primary }]}>
                <CheckCircle2 color="#fff" size={48} />
             </View>
          </View>
  
          <Text style={[styles.title, { color: colors.text }]}>Appointment{"\n"}Confirmed</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            Your appointment with {doctorName} has been successfully booked.
          </Text>
  
          <GlassCard style={styles.infoGlassCard}>
            <View style={styles.doctorSection}>
              <View style={[styles.avatarContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]}>
                 <Image source={{ uri: doctorImageUrl || 'https://images.unsplash.com/photo-1559839734-2b71f1e3c77d?q=80&w=150&auto=format&fit=crop' }} style={styles.avatar} />
              </View>
              <View style={styles.doctorInfo}>
                 <Text style={[styles.docName, { color: colors.text }]}>{doctorName}</Text>
                 <Text style={[styles.docSpec, { color: colors.secondaryText }]}>General Practitioner</Text>
              </View>
            </View>
  
            <View style={styles.divider} />
  
            <View style={styles.detailRow}>
               <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                  <Calendar color={colors.primary} size={20} />
               </View>
               <View>
                  <Text style={[styles.detailLabel, { color: colors.secondaryText }]}>Date & Time</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{date} at {time}</Text>
               </View>
            </View>
  
            <View style={styles.detailRow}>
               <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                  <MapPin color={colors.primary} size={20} />
               </View>
               <View>
                  <Text style={[styles.detailLabel, { color: colors.secondaryText }]}>Location</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{location || '123 Health Clinic, Suite 200'}</Text>
               </View>
            </View>
          </GlassCard>
  
          <TouchableOpacity 
            style={[styles.calendarBtn, { backgroundColor: colors.primary }]}
            onPress={() => Alert.alert('Success', 'Added to system calendar')}
          >
            <Calendar color="#fff" size={20} />
            <Text style={styles.calendarBtnText}>Add to Calendar</Text>
          </TouchableOpacity>
  
          <TouchableOpacity 
            style={styles.viewAllBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Visits' })}
          >
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All Appointments</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  closeBtn: { position: 'absolute', top: 20, right: 20, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  scrollContainer: { paddingBottom: 50 },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 30, paddingTop: 30 },
  successIconContainer: { width: 120, height: 120, borderRadius: 60, borderWidth: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  successIconInner: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center', shadowColor: '#6366f1', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 15 },
  title: { fontSize: 32, fontWeight: '800', textAlign: 'center', marginBottom: 15, lineHeight: 42, letterSpacing: -1 },
  subtitle: { fontSize: 16, fontWeight: '500', textAlign: 'center', lineHeight: 26, marginBottom: 40, opacity: 0.7 },
  
  infoGlassCard: {
    width: '100%',
    padding: 24,
    borderRadius: 32,
    marginBottom: 30,
  },

  doctorSection: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatar: { width: 54, height: 54, borderRadius: 18 },
  doctorInfo: { marginLeft: 16 },
  docName: { fontSize: 19, fontWeight: '800', letterSpacing: -0.3 },
  docSpec: { fontSize: 14, fontWeight: '600', marginTop: 3 },
  divider: { height: 1, backgroundColor: 'rgba(150,150,150,0.15)', marginVertical: 24 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  detailLabel: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  detailValue: { fontSize: 16, fontWeight: '800' },
  calendarBtn: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, borderRadius: 20, gap: 10, shadowColor: '#6366f1', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15 },
  calendarBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  viewAllBtn: { marginTop: 20, paddingVertical: 12 },
  viewAllText: { fontSize: 15, fontWeight: '800', letterSpacing: 0.3 }
});

export default BookingConfirmationScreen;
