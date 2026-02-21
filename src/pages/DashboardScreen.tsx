import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  Dimensions, 
  Platform, 
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import { 
  Bell, 
  Search, 
  Calendar, 
  ClipboardList, 
  MessageSquare,
  Bot,
  Heart, 
  Activity, 
  Footprints, 
  Moon, 
  ChevronRight, 
  CheckCircle2, 
  LogOut,
  Sun,
  Stethoscope
} from 'lucide-react-native';
import axios from 'axios';
import { BASE_API_URL } from '../constants/Config';
import { getNotifications } from '../services/medicalService';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { user, token, logout } = useAuth();
  const { colors, toggleTheme, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  useFocusEffect(
    React.useCallback(() => {
      fetchNotificationCount();
    }, [])
  );

  const fetchNotificationCount = async () => {
    try {
      const data = await getNotifications();
      const unread = data.filter((n: any) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.log('Error fetching notification count:', err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      if (!token) return;
      console.log(`LOG Fetching dashboard from: ${BASE_API_URL}/dashboard`);
      const response = await axios.get(`${BASE_API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('LOG Dashboard data fetched successfully');
      setDashboardData(response.data);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error.response?.status, error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Layout>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoRow}>
              <View style={[styles.logoIconBg, { backgroundColor: colors.primary + '15' }]}>
                <Stethoscope color={colors.primary} size={24} />
              </View>
              <Text style={[styles.brandTitle, { color: colors.text }]}>MedPoint</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ConsultationBot')}
                style={[styles.botHeaderBtn, { backgroundColor: colors.primary + '15' }]}
              >
                <Bot color={colors.primary} size={22} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleTheme}
                style={[styles.themeBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}
              >
                {isDark ? <Sun color={colors.warning} size={20} /> : <Moon color={colors.primary} size={20} />}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.notificationBtn}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Bell color={colors.text} size={24} />
                {unreadCount > 0 && <View style={[styles.notificationDot, { borderColor: colors.background }]} />}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.greetingRow}>
            <Text style={[styles.greetingLabel, { color: colors.secondaryText }]}>Good Morning,</Text>
            <Text style={[styles.greetingName, { color: colors.text }]}>{user?.username || dashboardData?.user?.username || 'Patient'}</Text>
          </View>
        </View>

        {/* ─── Hero Appointment Card ─── */}
        <View style={styles.section}>
          {dashboardData?.upcomingAppointment ? (
            <GlassCard style={styles.heroGlassCard} intensity={40}>

              {/* Status pill */}
              <View style={styles.heroTopRow}>
                <View style={[styles.statusPill,
                  dashboardData.upcomingAppointment.status === 'Pending'
                    ? { backgroundColor: '#f59e0b20', borderColor: '#f59e0b50' }
                    : { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }
                ]}>
                  <View style={[styles.statusDot,
                    { backgroundColor: dashboardData.upcomingAppointment.status === 'Pending' ? '#f59e0b' : colors.primary }
                  ]} />
                  <Text style={[styles.statusPillText,
                    { color: dashboardData.upcomingAppointment.status === 'Pending' ? '#f59e0b' : colors.primary }
                  ]}>
                    {dashboardData.upcomingAppointment.status === 'Pending' ? 'Pending' : 'Confirmed'}
                  </Text>
                </View>
                <Text style={[styles.heroCardLabel, { color: colors.secondaryText }]}>Next Visit</Text>
              </View>

              {/* Doctor Row */}
              <View style={styles.heroDoctorRow}>
                <View style={[styles.heroAvatarRing, { borderColor: colors.primary + '60' }]}>
                  <Image
                    source={{ 
                      uri: dashboardData.upcomingAppointment.doctorImageUrl || 
                           'https://images.unsplash.com/photo-1559839734-2b71f1e3c77d?q=80&w=200&auto=format&fit=crop' 
                    }}
                    style={styles.heroDocAvatar}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.heroDocInfo}>
                  <Text style={[styles.heroDocName, { color: colors.text }]}>{dashboardData.upcomingAppointment.doctorName}</Text>
                  <Text style={[styles.heroDocSpecialty, { color: colors.secondaryText }]}>{dashboardData.upcomingAppointment.specialty}</Text>
                  <View style={styles.heroChipsRow}>
                    <View style={[styles.heroChip, { backgroundColor: colors.primary + '18', borderColor: colors.primary + '35' }]}>
                      <Text style={[styles.heroChipText, { color: colors.primary }]}>{dashboardData.upcomingAppointment.date}</Text>
                    </View>
                    <View style={[styles.heroChip, { backgroundColor: colors.primary + '18', borderColor: colors.primary + '35' }]}>
                      <Text style={[styles.heroChipText, { color: colors.primary }]}>{dashboardData.upcomingAppointment.time}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Action buttons */}
              <View style={[styles.heroActionRow, { borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
                <TouchableOpacity
                  style={[styles.heroSecondaryBtn, { borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)' }]}
                  onPress={() => navigation.navigate('AppointmentHistory')}
                >
                  <Text style={[styles.heroSecondaryBtnText, { color: colors.text }]}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.heroPrimaryBtn, { backgroundColor: colors.primary }]}
                  onPress={() => navigation.navigate('MainTabs', { screen: 'Visits' })}
                >
                  <Text style={styles.heroPrimaryBtnText}>All Visits</Text>
                  <ChevronRight color="#fff" size={16} />
                </TouchableOpacity>
              </View>
            </GlassCard>

          ) : (
            <GlassCard style={styles.heroGlassCard} intensity={40}>
              <View style={styles.emptyHeroBody}>
                <View style={[styles.emptyCalIcon, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                  <Calendar color={colors.primary} size={30} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No Appointments Yet</Text>
                <Text style={[styles.emptySubtext, { color: colors.secondaryText }]}>Book your first visit with a specialist</Text>
              </View>
              <View style={[styles.heroActionRow, { borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
                <TouchableOpacity
                  style={[styles.heroSecondaryBtn, { borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)' }]}
                  onPress={() => navigation.navigate('AppointmentHistory')}
                >
                  <Text style={[styles.heroSecondaryBtnText, { color: colors.text }]}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.heroPrimaryBtn, { backgroundColor: colors.primary }]}
                  onPress={() => navigation.navigate('BookAppointment')}
                >
                  <Text style={styles.heroPrimaryBtnText}>Book Now</Text>
                  <ChevronRight color="#fff" size={16} />
                </TouchableOpacity>
              </View>
            </GlassCard>
          )}
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.gridSection}>
          <View style={styles.gridRow}>
            <ActionCard 
              icon={<Bot color={colors.primary} size={24} />} 
              title="MedBot AI" 
              onPress={() => navigation.navigate('ConsultationBot')} 
              colors={colors}
            />
            <ActionCard 
              icon={<Activity color={colors.primary} size={24} />} 
              title="Book Visit" 
              onPress={() => navigation.navigate('BookAppointment')}
              colors={colors}
            />
          </View>
          <View style={styles.gridRow}>
            <ActionCard 
              icon={<Search color={colors.primary} size={24} />} 
              title="Find Doctor" 
              onPress={() => navigation.navigate('BookAppointment')}
              colors={colors}
            />
            <ActionCard 
              icon={<ClipboardList color={colors.primary} size={24} />} 
              title="My Records" 
              onPress={() => navigation.navigate('MainTabs', { screen: 'Records' })}
              colors={colors}
            />
          </View>
        </View>

        {/* Health Statistics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Health Activity</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.statsScroll}
          >
            {dashboardData?.statistics?.map((stat: any) => (
              <StatCard key={stat.id} stat={stat} colors={colors} />
            ))}
          </ScrollView>
        </View>

        {/* ─── Daily Medication Card ─── */}
        {dashboardData?.medication && (
          <View style={styles.medicationSection}>
            <Text style={[styles.sectionTitle, { color: colors.text, paddingHorizontal: 20 }]}>Daily Medication</Text>
            <GlassCard style={styles.medGlassCard} intensity={40}>
              {/* Left: all text info */}
              <View style={styles.medContent}>
                <Text style={[styles.medLabel, { color: colors.primary }]}>NEXT DOSE</Text>
                <Text style={[styles.medName, { color: colors.text }]}>{dashboardData.medication.name}</Text>
                <Text style={[styles.medDetail, { color: colors.secondaryText }]}>
                  {dashboardData.medication.dosage} • {dashboardData.medication.instruction}
                </Text>
                <Text style={[styles.medTime, { color: colors.secondaryText }]}>8:00 AM</Text>
              </View>

              {/* Right: Done button */}
              <TouchableOpacity
                style={[styles.medDoneBtn, { backgroundColor: colors.primary }]}
                activeOpacity={0.8}
              >
                <Text style={styles.medDoneBtnText}>Done</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>
        )}
      </ScrollView>
    </Layout>
  );
};

const ActionCard = ({ icon, title, onPress, colors }: { icon: any, title: string, onPress: () => void, colors: any }) => (
  <View style={styles.actionCardWrapper}>
    <TouchableOpacity onPress={onPress}>
      <GlassCard style={styles.actionGlassCard}>
        <View style={[styles.actionIconContainer, { backgroundColor: colors.primary + '15' }]}>
          {icon}
        </View>
        <Text style={[styles.actionTitle, { color: colors.text }]}>{title}</Text>
      </GlassCard>
    </TouchableOpacity>
  </View>
);

const StatCard = ({ stat, colors }: { stat: any, colors: any }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'heart_rate': return <Heart color="#f43f5e" size={24} />;
      case 'bp': return <Activity color="#6366f1" size={24} />;
      case 'steps': return <Footprints color="#10b981" size={24} />;
      case 'sleep': return <Moon color="#f59e0b" size={24} />;
      default: return <Activity color={colors.primary} size={24} />;
    }
  };
  const getIconBg = (id: string) => {
    switch (id) {
      case 'heart_rate': return '#f43f5e20';
      case 'bp': return '#6366f120';
      case 'steps': return '#10b98120';
      case 'sleep': return '#f59e0b20';
      default: return colors.primary + '20';
    }
  };

  return (
    <GlassCard style={styles.statGlassCard}>
      <View style={[styles.statIconWrapper, { backgroundColor: getIconBg(stat.id) }]}>
        {getIcon(stat.id)}
      </View>
      <View style={styles.statMain}>
        <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
        <Text style={[styles.statUnit, { color: colors.secondaryText }]}>{stat.unit}</Text>
        <Text style={[styles.statLabel, { color: colors.secondaryText }]}>{stat.label}</Text>
        <View style={styles.trendRow}>
          <Activity color={stat.status === 'up' ? colors.success : colors.danger} size={12} />
          <Text style={[styles.statTrend, { color: stat.status === 'up' ? colors.success : colors.danger }]}>
            {stat.trend}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 15,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoIconBg: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  brandTitle: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  themeBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  botHeaderBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  notificationBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  notificationDot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: '#f43f5e', borderWidth: 1.5 },
  
  greetingRow: { marginTop: 10 },
  greetingLabel: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  greetingName: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5, marginTop: 4 },
  
  section: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { fontSize: 17, fontWeight: '800', marginBottom: 15, letterSpacing: -0.2 },
  
  gridSection: { paddingHorizontal: 16, marginTop: 25 },
  gridRow: { flexDirection: 'row' },
  actionCardWrapper: { flex: 1, padding: 8 },
  actionGlassCard: {
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconContainer: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  actionTitle: { fontSize: 13, fontWeight: '800' },
  statsScroll: { paddingHorizontal: 20, paddingBottom: 10 },

  // ─── HERO CARD: glass card container ───
  heroGlassCard: { borderRadius: 26, overflow: 'hidden' },
  premiumGlassCard: { borderRadius: 26, overflow: 'hidden' },
  heroAccentStrip: { flexDirection: 'row', alignItems: 'center' },
  heroStripLabel: { color: '#fff', fontSize: 12, fontWeight: '800' },

  heroTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 12 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusPillText: { fontSize: 12, fontWeight: '800' },
  heroCardLabel: { fontSize: 12, fontWeight: '700' },

  heroDoctorRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 20, paddingBottom: 18 },
  heroAvatarRing: { width: 88, height: 88, borderRadius: 26, borderWidth: 2.5, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  heroDocAvatar: { width: 88, height: 88, borderRadius: 24 },
  heroDocInfo: { flex: 1 },
  heroDocName: { fontSize: 18, fontWeight: '900', letterSpacing: -0.3 },
  heroDocSpecialty: { fontSize: 13, fontWeight: '600', marginTop: 3, marginBottom: 12 },
  heroChipsRow: { flexDirection: 'row', gap: 8 },
  heroChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1 },
  heroChipText: { fontSize: 12, fontWeight: '800' },

  heroActionRow: { flexDirection: 'row', borderTopWidth: 1 },
  heroSecondaryBtn: { flex: 1, paddingVertical: 17, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1 },
  heroSecondaryBtnText: { fontSize: 14, fontWeight: '800' },
  heroPrimaryBtn: { flex: 1.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 17, gap: 5 },
  heroPrimaryBtnText: { fontSize: 14, fontWeight: '900', color: '#fff' },
  heroMainBtn: { flex: 1.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 17, gap: 5 },
  heroMainBtnText: { fontSize: 14, fontWeight: '900' },
  heroHistoryBtn: { flex: 1, paddingVertical: 17, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1 },
  heroHistoryText: { fontSize: 14, fontWeight: '800' },
  pendingBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  pendingBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  heroBody: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },

  // ─── EMPTY STATE ───
  emptyGlassCard: { borderRadius: 26, overflow: 'hidden' },
  emptyHeroBody: { alignItems: 'center', paddingTop: 28, paddingBottom: 20, paddingHorizontal: 20 },
  emptyCalIcon: { width: 70, height: 70, borderRadius: 35, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyIconContainer: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 17, fontWeight: '900', marginBottom: 6 },
  emptyText: { fontSize: 13, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  emptySubtext: { fontSize: 13, fontWeight: '600', textAlign: 'center', opacity: 0.7 },
  emptyBtnRow: { flexDirection: 'row', gap: 12, width: '100%' },
  emptyHistoryBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', borderRadius: 16 },
  bookNowBtnHero: { flex: 1.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 5 },
  bookNowText: { fontSize: 14, fontWeight: '800' },

  // ─── MEDICATION CARD ───
  medicationSection: { marginTop: 30, marginBottom: 8 },
  medGlassCard: {
    borderRadius: 22,
    marginHorizontal: 20,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
    overflow: 'hidden',
  },
  medicationGlassCard: {
    borderRadius: 22,
    marginHorizontal: 20,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  medIconBubble: { width: 56, height: 56, borderRadius: 18, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginLeft: 18 },
  medContent: { flex: 1, paddingVertical: 18, paddingLeft: 20, paddingRight: 12 },
  medicationInfo: { flex: 1, paddingVertical: 18, paddingHorizontal: 16 },
  medLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  medName: { fontSize: 16, fontWeight: '900' },
  medDetail: { fontSize: 12, fontWeight: '500', marginTop: 3 },
  medTime: { fontSize: 12, fontWeight: '700', marginTop: 6 },
  medTimeText: { fontSize: 12, fontWeight: '700', marginTop: 6 },
  medDoneBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medDoneBtnText: { fontSize: 14, fontWeight: '900', color: '#fff' },
  pillActionBtn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 16, marginRight: 16 },
  pillActionText: { fontSize: 13, fontWeight: '900' },
  medAccentBar: { width: 6 },


  // --- STAT CARDS ---
  statGlassCard: {
    width: 165,
    padding: 20,
    borderRadius: 28,
    marginRight: 14,
    alignItems: 'center',
  },
  statIconWrapper: { width: 54, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  statMain: { alignItems: 'center' },
  statValue: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  statUnit: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  statLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 6, textAlign: 'center' },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  statTrend: { fontSize: 11, fontWeight: '900' },


});

export default DashboardScreen;
