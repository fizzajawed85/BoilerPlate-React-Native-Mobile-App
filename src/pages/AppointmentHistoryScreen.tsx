import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  StatusBar, TouchableOpacity, ActivityIndicator, RefreshControl,
  Platform, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAppointmentHistory } from '../services/medicalService';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import {
  ChevronLeft,
  Calendar as CalendarIcon,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  Filter
} from 'lucide-react-native';

const STATUS_COLORS: Record<string, string> = {
  Confirmed: '#10b981',
  Pending: '#f59e0b',
  Cancelled: '#ef4444',
  Completed: '#6366f1',
};

const AppointmentHistoryScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      setError('');
      const data = await getAppointmentHistory();
      setAppointments(data.appointments || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const renderItem = ({ item }: any) => {
    const statusColor = STATUS_COLORS[item.status] || colors.primary;
    const dateObj = new Date(item.date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'short' });

    return (
      <GlassCard style={styles.historyGlassCard}>
        <View style={styles.cardContent}>
          <View style={[styles.dateBox, { backgroundColor: colors.primary + '15' }]}>
            <Text style={[styles.dateDay, { color: colors.primary }]}>{day}</Text>
            <Text style={[styles.dateMonth, { color: colors.secondaryText }]}>{month}</Text>
          </View>

          <View style={[styles.avatarRing, { borderColor: colors.primary + '30' }]}>
             <Image 
                source={{ uri: item.doctorImageUrl || 'https://images.unsplash.com/photo-1559839734-2b71f1e3c77d?q=80&w=200&auto=format&fit=crop' }} 
                style={styles.avatar} 
             />
          </View>
          
          <View style={styles.cardInfo}>
            <Text style={[styles.docName, { color: colors.text }]}>{item.doctorName}</Text>
            <Text style={[styles.specialty, { color: colors.secondaryText }]}>{item.specialty}</Text>
            <View style={styles.timeRow}>
              <Clock color={colors.primary} size={14} />
              <Text style={[styles.timeText, { color: colors.secondaryText }]}>{item.time}</Text>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusColor + '10', borderColor: statusColor + '30' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
          </View>
        </View>
      </GlassCard>
    );
  };

  return (
    <Layout>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.text} size={28} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Past Visits</Text>
        <TouchableOpacity style={styles.filterBtn}>
           <Filter color={colors.text} size={24} />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <AlertCircle color={colors.danger} size={48} />
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <TouchableOpacity onPress={fetchHistory} style={[styles.retryBtn, { backgroundColor: colors.primary }]}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : appointments.length === 0 ? (
        <View style={styles.center}>
          <View style={[styles.emptyIconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
             <CalendarIcon color={colors.muted} size={48} />
          </View>
          <Text style={[styles.emptyText, { color: colors.text }]}>No Records Yet</Text>
          <Text style={[styles.emptyDesc, { color: colors.secondaryText }]}>Your visitation records and past checkups will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item, idx) => item._id || String(idx)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={() => { setRefreshing(true); fetchHistory(); }} 
              tintColor={colors.primary}
            />
          }
        />
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backBtn: { padding: 5 },
  filterBtn: { padding: 5 },
  title: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  list: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 120 },
  
  historyGlassCard: {
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    padding: 4,
  },

  cardContent: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  dateBox: {
    width: 58,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dateDay: { fontSize: 22, fontWeight: '900' },
  dateMonth: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', marginTop: 1 },
  cardInfo: { flex: 1 },
  docName: { fontSize: 17, fontWeight: '800', letterSpacing: -0.4 },
  specialty: { fontSize: 13, fontWeight: '600', marginTop: 3 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  timeText: { fontSize: 12, fontWeight: '800' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  statusText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  
  avatarRing: {
    width: 60,
    height: 60,
    borderRadius: 20,
    borderWidth: 2,
    padding: 2,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  errorText: { fontSize: 16, fontWeight: '800', marginTop: 15, textAlign: 'center' },
  retryBtn: { marginTop: 20, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 12 },
  retryText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  emptyIconContainer: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  emptyText: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  emptyDesc: { fontSize: 14, fontWeight: '500', textAlign: 'center', lineHeight: 22 },
});

export default AppointmentHistoryScreen;
