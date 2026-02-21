import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  StatusBar, TouchableOpacity, ActivityIndicator, RefreshControl,
  Platform, ScrollView, Image, Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getUpcomingAppointments, cancelAppointment, getAllAppointments } from '../services/medicalService';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import { 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MoreVertical,
  AlertCircle,
  XCircle,
  Stethoscope,
  Bell,
  Plus,
  FileText,
  CheckCircle2
} from 'lucide-react-native';

const STATUS_COLORS: Record<string, string> = {
  Confirmed: '#10b981',
  Pending: '#f59e0b',
  Cancelled: '#ef4444',
  Completed: '#6366f1',
};

const UpcomingAppointmentsScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      setError('');
      const data = await getAllAppointments();
      setAppointments(data.appointments || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchAppointments();
    }, [])
  );

  const upcoming = appointments.filter(a => ['Confirmed', 'Pending'].includes(a.status));
  const past = appointments.filter(a => ['Completed', 'Cancelled'].includes(a.status));

  const handleCancel = async (id: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await cancelAppointment(id);
              fetchAppointments();
              Alert.alert('Success', 'Appointment cancelled successfully');
            } catch (err: any) {
              Alert.alert('Error', err?.response?.data?.message || 'Failed to cancel appointment');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleReschedule = (item: any) => {
    navigation.navigate('BookAppointment', { 
      rescheduleId: item._id,
      doctorName: item.doctorName,
      specialty: item.specialty,
      doctorImageUrl: item.doctorImageUrl
    });
  };

  const renderUpcomingCard = (item: any) => (
    <GlassCard style={[styles.appointmentGlassCard, { borderColor: colors.border }]}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
           <Image 
             source={{ uri: item.doctorImageUrl || 'https://images.unsplash.com/photo-1559839734-2b71f1e3c77d?q=80&w=200&auto=format&fit=crop' }} 
             style={styles.docAvatar} 
             resizeMode="cover"
           />
           <View style={styles.docInfo}>
              <Text style={[styles.docName, { color: colors.text }]}>{item.doctorName}</Text>
              <Text style={[styles.specialty, { color: colors.secondaryText }]}>{item.specialty}</Text>
           </View>
           <TouchableOpacity style={styles.moreBtn}>
              <MoreVertical color={colors.muted} size={20} />
           </TouchableOpacity>
        </View>

        <View style={[styles.infoRow, { backgroundColor: colors.primary + '10' }]}>
           <View style={styles.infoItem}>
              <CalendarIcon color={colors.primary} size={16} />
              <Text style={[styles.infoText, { color: colors.text }]}>{item.date}</Text>
           </View>
           <View style={styles.infoItem}>
              <Clock color={colors.primary} size={16} />
              <Text style={[styles.infoText, { color: colors.text }]}>{item.time}</Text>
           </View>
        </View>

        <View style={styles.cardActionRow}>
          <TouchableOpacity
            style={[styles.cancelBtn, { backgroundColor: colors.danger + '10' }]}
            onPress={() => handleCancel(item._id)}
          >
            <Text style={[styles.cancelText, { color: colors.danger }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rescheduleBtn, { backgroundColor: colors.primary }]}
            onPress={() => handleReschedule(item)}
          >
            <Text style={[styles.rescheduleText, { color: isDark ? '#fff' : colors.text }]}>Reschedule</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GlassCard>
  );

  const renderPastItem = (item: any) => {
    const statusColor = STATUS_COLORS[item.status] || colors.primary;
    const isCancelled = item.status === 'Cancelled';

    return (
      <GlassCard style={[styles.pastGlassCard, { borderColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }]}>
        <View style={styles.pastCardHeader}>
          <View style={[styles.pastIconContainer, { backgroundColor: statusColor + '10' }]}>
             {isCancelled ? <XCircle color={colors.danger} size={22} /> : <CheckCircle2 color={colors.success} size={22} />}
          </View>
          <View style={styles.pastInfo}>
            <Text style={[styles.pastDocName, { color: colors.text }]}>{item.doctorName}</Text>
            <Text style={[styles.pastSpecialty, { color: colors.secondaryText }]}>{item.specialty}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
          </View>
        </View>
        
        <View style={[styles.pastDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]} />
        
        <View style={styles.pastCardFooter}>
          <View style={styles.footerItem}>
             <CalendarIcon color={colors.primary} size={14} />
             <Text style={[styles.footerText, { color: colors.secondaryText }]}>{item.date}</Text>
          </View>
          <View style={styles.footerItem}>
             <Clock color={colors.primary} size={14} />
             <Text style={[styles.footerText, { color: colors.secondaryText }]}>{item.time}</Text>
          </View>
        </View>
      </GlassCard>
    );
  };

  return (
    <Layout>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MainTabs', { screen: 'Home' })} style={styles.backBtn}>
          <ChevronLeft color={colors.text} size={28} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Upcoming Visits</Text>
        <TouchableOpacity style={styles.historyBtn} onPress={() => navigation.navigate('AppointmentHistory')}>
           <CalendarIcon color={colors.text} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAppointments(); }} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Upcoming Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming</Text>
          <TouchableOpacity
            style={[styles.scheduleBtn, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}
            onPress={() => navigation.navigate('BookAppointment')}
          >
            <Plus color={colors.primary} size={18} />
            <Text style={[styles.scheduleBtnText, { color: colors.primary }]}>New</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 30 }} />
        ) : upcoming.length > 0 ? (
          upcoming.map((item) => (
            <React.Fragment key={item._id || item.id}>
              {renderUpcomingCard(item)}
            </React.Fragment>
          ))
        ) : (
          <Text style={[styles.emptyTextSimple, { color: colors.secondaryText }]}>No upcoming appointments</Text>
        )}

        {/* Past Section */}
        <View style={[styles.sectionHeaderRow, { marginTop: 40 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Past Visits</Text>
        </View>

        {past.length > 0 ? (
          past.map((item) => (
            <React.Fragment key={item._id || item.id}>
              {renderPastItem(item)}
            </React.Fragment>
          ))
        ) : !loading && (
          <Text style={[styles.emptyTextSimple, { color: colors.secondaryText }]}>No past appointments</Text>
        )}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backBtn: { padding: 5 },
  historyBtn: { padding: 5 },
  title: { fontSize: 20, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  scheduleBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, gap: 4 },
  scheduleBtnText: { fontSize: 13, fontWeight: '700' },

  // Glass Cards
  appointmentGlassCard: {
    borderRadius: 28,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  docAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  docInfo: { flex: 1 },
  docName: { fontSize: 18, fontWeight: '700' },
  specialty: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  moreBtn: { padding: 8 },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderRadius: 15,
    marginBottom: 15,
  },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 14, fontWeight: '600' },

  cardActionRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { fontSize: 14, fontWeight: '700' },
  rescheduleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rescheduleText: { fontSize: 14, fontWeight: '700' },

  pastGlassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginBottom: 12,
  },

  premiumHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, padding: 24, paddingBottom: 0 },
  premiumAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: 15, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)' },
  premiumInfo: { flex: 1 },
  premiumSpecialty: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  premiumDocName: { color: '#fff', fontSize: 19, fontWeight: '800' },
  premiumDetails: { flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginBottom: 20 },
  premiumChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 14, gap: 8 },
  premiumChipText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  // Past Card Components
  pastIconContainer: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  pastInfo: { flex: 1, paddingRight: 8 },
  pastDocName: { fontSize: 16, fontWeight: '800' },
  pastSpecialty: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  pastCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  pastDivider: { height: 1, marginVertical: 10 },
  pastCardFooter: { flexDirection: 'row', gap: 16 },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { fontSize: 12, fontWeight: '600' },
  
  emptyTextSimple: { textAlign: 'center', marginVertical: 30, fontSize: 15, fontWeight: '600' },
});

export default UpcomingAppointmentsScreen;
