import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  StatusBar, TouchableOpacity, ActivityIndicator, Alert,
  Platform, Dimensions, Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDoctors, bookAppointment, cancelAppointment } from '../services/medicalService';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import { 
  ChevronLeft, 
  ChevronRight,
  Star,
  Sun,
  Moon,
  Calendar as CalendarIcon,
  Clock,
  Stethoscope
} from 'lucide-react-native';

const TIME_SLOTS_MORNING = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'];
const TIME_SLOTS_AFTERNOON = ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'];

const BookAppointmentScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [selectedTime, setSelectedTime] = useState('');
  const [booking, setBooking] = useState(false);
  
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  const route = useRoute<any>();
  const rescheduleId = route.params?.rescheduleId;

  useEffect(() => {
    getDoctors()
      .then((d) => {
        const docs = d.doctors || [];
        setDoctors(docs);
        
        // If rescheduling, pre-select the doctor
        if (route.params?.doctorName) {
          const doc = docs.find((dt: any) => dt.name === route.params.doctorName);
          if (doc) setSelectedDoctor(doc);
        }
      })
      .catch((err) => console.log('Err loading doctors:', err))
      .finally(() => setLoadingDoctors(false));
  }, []);

  const handleBook = async () => {
    if (!selectedDoctor) return Alert.alert('Error', 'Please select a doctor');
    if (!selectedTime) return Alert.alert('Error', 'Please select a time slot');

    setBooking(true);
    try {
      const year = currentCalendarDate.getFullYear();
      const month = (currentCalendarDate.getMonth() + 1).toString().padStart(2, '0');
      const dateStr = `${year}-${month}-${selectedDate.toString().padStart(2, '0')}`;
      const res = await bookAppointment({
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: dateStr,
        time: selectedTime,
        doctorImageUrl: selectedDoctor.imageUrl
      });
      
      // If rescheduling, cancel the old appointment
      if (rescheduleId) {
        try {
          await cancelAppointment(rescheduleId);
        } catch (err) {
          console.error('Failed to cancel old appointment during reschedule:', err);
        }
      }

      navigation.navigate('BookingConfirmation', {
        appointmentId: res.appointment?._id || 'new',
        doctorName: selectedDoctor.name,
        doctorImageUrl: selectedDoctor.imageUrl,
        date: dateStr,
        time: selectedTime,
        location: '123 Health Clinic, Suite 200'
      });
    } catch (err: any) {
      Alert.alert('❌ Booking Failed', err?.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const renderCalendar = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    // Get days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    const handlePrevMonth = () => {
      const prev = new Date(year, month - 1, 1);
      setCurrentCalendarDate(prev);
    };

    const handleNextMonth = () => {
      const next = new Date(year, month + 1, 1);
      setCurrentCalendarDate(next);
    };

    return (
      <GlassCard style={styles.calendarGlassCard}>
        <View style={styles.calendarHeader}>
           <TouchableOpacity onPress={handlePrevMonth}><ChevronLeft color={colors.text} size={20} /></TouchableOpacity>
           <Text style={[styles.monthTitle, { color: colors.text }]}>
             {currentCalendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
           </Text>
           <TouchableOpacity onPress={handleNextMonth}><ChevronRight color={colors.text} size={20} /></TouchableOpacity>
        </View>
        <View style={styles.daysHeader}>
           {['S','M','T','W','T','F','S'].map((d, i) => <Text key={`${d}-${i}`} style={styles.dayLabel}>{d}</Text>)}
        </View>
        <View style={styles.calendarGrid}>
          {blanks.map(b => <View key={`blank-${b}`} style={styles.dayBtn} />)}
          {days.map(d => {
            const isSelected = selectedDate === d;
            const isToday = d === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            const isPast = (d < new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) || (year < new Date().getFullYear()) || (year === new Date().getFullYear() && month < new Date().getMonth());
            
            return (
              <TouchableOpacity 
                key={d} 
                style={[
                  styles.dayBtn, 
                  isSelected && { backgroundColor: colors.primary },
                  isToday && !isSelected && { borderWidth: 1, borderColor: colors.primary }
                ]}
                onPress={() => setSelectedDate(d)}
                disabled={isPast}
              >
                <Text style={[styles.dayText, isSelected ? { color: '#fff' } : { color: isPast ? colors.muted : colors.text }]}>{d}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </GlassCard>
    );
  };

  const renderSlot = (slot: string) => {
    const isSelected = selectedTime === slot;
    return (
      <TouchableOpacity
        key={slot}
        style={[styles.timeBtn, { 
          backgroundColor: isSelected ? colors.primary : 'rgba(255,255,255,0.05)',
          borderColor: isSelected ? 'transparent' : 'rgba(255,255,255,0.1)'
        }]}
        onPress={() => setSelectedTime(slot)}
      >
        <Text style={[styles.timeText, { color: colors.text }]}>{slot}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Layout>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.text} size={28} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Book Appointment</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.progressRow}>
          <View style={[styles.progressStep, { backgroundColor: colors.primary, width: '33%' }]} />
          <View style={[styles.progressStep, { backgroundColor: 'rgba(255,255,255,0.05)', width: '33%' }]} />
          <View style={[styles.progressStep, { backgroundColor: 'rgba(255,255,255,0.05)', width: '33%' }]} />
        </View>
        <View style={styles.progressLabels}>
           <Text style={[styles.stepLabel, { color: colors.primary }]}>Details</Text>
           <Text style={styles.stepLabel}>Review</Text>
           <Text style={styles.stepLabel}>Confirm</Text>
        </View>

        <Text style={[styles.mainLabel, { color: colors.text }]}>Choose a Date</Text>
        {renderCalendar()}

        <Text style={[styles.mainLabel, { color: colors.text }]}>Select Your Doctor</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.docList}>
          {doctors.map(doc => (
            <TouchableOpacity
              key={doc._id}
              onPress={() => setSelectedDoctor(doc)}
            >
              <GlassCard style={[styles.docGlassCard, selectedDoctor?._id === doc._id && { borderColor: colors.primary, borderWidth: 2 }]}>
                <Image 
                  source={{ 
                    uri: doc.imageUrl || 
                         'https://images.unsplash.com/photo-1559839734-2b71f1e3c77d?q=80&w=200&auto=format&fit=crop' 
                  }} 
                  style={styles.docAvatar} 
                />
                <Text style={[styles.docNameTitle, { color: colors.text }]}>{doc.name}</Text>
                <Text style={[styles.docSpecText, { color: colors.secondaryText }]}>{doc.specialty}</Text>
                <View style={styles.ratingRow}>
                  <Star color="#f59e0b" size={14} fill="#f59e0b" />
                  <Text style={[styles.ratingText, { color: colors.secondaryText }]}>4.9 (128)</Text>
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.mainLabel, { color: colors.text }]}>Available Time Slots</Text>

        <View style={styles.timeSection}>
           <View style={styles.timeHeader}>
              <Sun color={colors.secondaryText} size={18} />
              <Text style={[styles.timeTitle, { color: colors.text }]}>Morning</Text>
           </View>
           <View style={styles.timeGrid}>{TIME_SLOTS_MORNING.map(renderSlot)}</View>
        </View>

        <View style={styles.timeSection}>
           <View style={styles.timeHeader}>
              <Moon color={colors.secondaryText} size={18} />
              <Text style={[styles.timeTitle, { color: colors.text }]}>Afternoon</Text>
           </View>
           <View style={styles.timeGrid}>{TIME_SLOTS_AFTERNOON.map(renderSlot)}</View>
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={handleBook}
          disabled={booking}
        >
          {booking ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Confirm Booking</Text>}
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backBtn: { padding: 5 },
  title: { fontSize: 20, fontWeight: '800' },
  container: { paddingHorizontal: 20, paddingBottom: 120 },

  progressRow: { flexDirection: 'row', height: 4, borderRadius: 2, overflow: 'hidden', gap: 4, marginTop: 15 },
  progressStep: { height: 4, borderRadius: 2 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingHorizontal: 2 },
  stepLabel: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5 },

  mainLabel: { fontSize: 18, fontWeight: '800', marginTop: 30, marginBottom: 15, letterSpacing: -0.2 },

  // Glass Elements
  calendarGlassCard: {
    padding: 20,
    borderRadius: 30,
    marginBottom: 10,
  },
  docGlassCard: {
    width: 170,
    padding: 20,
    borderRadius: 28,
    marginRight: 15,
    alignItems: 'center',
  },

  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  monthTitle: { fontSize: 16, fontWeight: '800' },
  daysHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  dayLabel: { width: 34, textAlign: 'center', fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.3)' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  dayBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', margin: 2 },
  dayText: { fontSize: 13, fontWeight: '700' },

  docList: { paddingBottom: 10 },
  docAvatar: { width: 74, height: 74, borderRadius: 37, marginBottom: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)' },
  docNameTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  docSpecText: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 11, fontWeight: '700' },

  timeSection: { marginTop: 15 },
  timeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  timeTitle: { fontSize: 15, fontWeight: '800' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeBtn: { paddingVertical: 14, paddingHorizontal: 8, borderRadius: 16, borderWidth: 1, minWidth: '30%', alignItems: 'center' },
  timeText: { fontSize: 14, fontWeight: '800' },

  primaryBtn: { marginTop: 40, paddingVertical: 18, borderRadius: 20, alignItems: 'center', shadowColor: '#6366f1', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
});

export default BookAppointmentScreen;
