import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import { 
  ChevronLeft, 
  Bell, 
  Calendar, 
  ClipboardList, 
  Info, 
  CheckCircle2,
  Trash2,
  MailOpen
} from 'lucide-react-native';
import { getNotifications, markNotificationsRead, markNotificationRead } from '../services/medicalService';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'record' | 'general';
  read: boolean;
  createdAt: string;
}

const NotificationScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    try {
      await markNotificationsRead();
      fetchNotifications();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleNotificationPress = async (item: Notification) => {
    if (!item.read) {
      try {
        await markNotificationRead(item.id);
        setNotifications(prev => 
          prev.map(n => n.id === item.id ? { ...n, read: true } : n)
        );
      } catch (err) {
        console.error('Error marking read:', err);
      }
    }
    
    // Optional: Navigate based on type
    if (item.type === 'appointment') {
      navigation.navigate('MainTabs', { screen: 'Visits' });
    } else if (item.type === 'record') {
      navigation.navigate('MainTabs', { screen: 'Records' });
    }
  };

  const getIcon = (type: string, read: boolean) => {
    const iconSize = 22;
    const color = read ? colors.secondaryText : colors.primary;
    
    switch (type) {
      case 'appointment': return <Calendar color={color} size={iconSize} />;
      case 'record': return <ClipboardList color={color} size={iconSize} />;
      default: return <Info color={color} size={iconSize} />;
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => handleNotificationPress(item)}
      style={styles.notificationWrapper}
    >
      <GlassCard 
        style={[styles.notificationCard, !item.read && { borderColor: colors.primary + '30', borderWidth: 1 }]} 
        intensity={item.read ? 20 : 40}
      >
        <View style={[styles.iconContainer, { backgroundColor: item.read ? (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6') : colors.primary + '15' }]}>
          {getIcon(item.type, item.read)}
        </View>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={[styles.title, { color: colors.text }, !item.read && { fontWeight: '800' }]}>{item.title}</Text>
            {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
          </View>
          <Text style={[styles.message, { color: colors.secondaryText }]} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={[styles.date, { color: colors.muted }]}>
            {new Date(item.createdAt).toLocaleDateString()} • {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  return (
    <Layout>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.text} size={28} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllRead} style={styles.actionBtn}>
          <MailOpen color={colors.primary} size={22} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.center}>
          <View style={[styles.emptyIconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6' }]}>
            <Bell color={colors.muted} size={40} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>All Caught Up!</Text>
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>You have no new notifications.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
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
    paddingBottom: 20,
    paddingTop: 10,
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  actionBtn: { padding: 5 },

  list: { paddingHorizontal: 20, paddingBottom: 30 },
  notificationWrapper: { marginBottom: 12 },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '600' },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  message: { fontSize: 13, lineHeight: 18, marginBottom: 8 },
  date: { fontSize: 11, fontWeight: '600' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIconContainer: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: 'center' },
});

export default NotificationScreen;
