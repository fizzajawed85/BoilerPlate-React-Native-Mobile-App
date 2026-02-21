import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  StatusBar, TouchableOpacity, ActivityIndicator, TextInput, Alert,
  Platform, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUserProfile, updateUserProfile } from '../services/medicalService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Info, 
  LogOut, 
  ChevronLeft,
  Camera,
  Moon,
  Sun,
  ChevronRight
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', phoneNumber: '', location: '', about: '' });
  const [image, setImage] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setError('');
      const data = await getUserProfile();
      setProfile(data.user);
      setForm({
        username: data.user.username || '',
        phoneNumber: data.user.phoneNumber || '',
        location: data.user.location || '',
        about: data.user.about || '',
      });
      if (data.user.profilePicture) {
        setImage(data.user.profilePicture);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSave = async () => {
    if (!form.username.trim()) return Alert.alert('Error', 'Name cannot be empty');
    setSaving(true);
    try {
      const data = await updateUserProfile(form);
      setProfile(data.user);
      setEditing(false);
      Alert.alert('✅ Success', 'Profile updated successfully!');
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        Alert.alert('✅ Photo Selected', 'Your profile photo has been updated locally.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <Layout>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MainTabs', { screen: 'Home' })} 
          style={styles.backBtn}
        >
          <ChevronLeft color={colors.text} size={28} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        <TouchableOpacity onPress={toggleTheme} style={[styles.themeBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
           {isDark ? <Sun color={colors.warning} size={20} /> : <Moon color={colors.primary} size={20} />}
        </TouchableOpacity>
      </View>

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Identity Section */}
        <View style={styles.avatarContainer}>
          <View style={[styles.avatarBorder, { borderColor: colors.primary + '30' }]}>
            <Image 
              source={{ uri: image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' }} 
              style={styles.avatarImage} 
            />
            <TouchableOpacity 
              onPress={pickImage}
              style={[styles.cameraBtn, { backgroundColor: colors.primary, borderColor: colors.background }]}
            >
              <Camera color="#fff" size={16} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>{profile?.username || 'User'}</Text>
          <Text style={[styles.profileEmail, { color: colors.secondaryText }]}>{profile?.email}</Text>
          <TouchableOpacity 
            onPress={() => setEditing(!editing)} 
            style={[styles.editBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}
          >
            <Text style={[styles.editBadgeText, { color: colors.primary }]}>{editing ? 'Back to Profile' : 'Edit Profile'}</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <GlassCard style={styles.formGlassCard}>
          <ProfileField 
            label="Full Name" 
            value={form.username} 
            icon={<User color={colors.primary} size={20} />} 
            editing={editing}
            onChangeText={(v: string) => setForm({...form, username: v})}
            colors={colors}
            isDark={isDark}
          />
          <ProfileField 
            label="Phone Number" 
            value={form.phoneNumber} 
            icon={<Phone color={colors.primary} size={20} />} 
            editing={editing}
            onChangeText={(v: string) => setForm({...form, phoneNumber: v})}
            colors={colors}
            placeholder="+1 234 567 890"
            isDark={isDark}
          />
          <ProfileField 
            label="Location" 
            value={form.location} 
            icon={<MapPin color={colors.primary} size={20} />} 
            editing={editing}
            onChangeText={(v: string) => setForm({...form, location: v})}
            colors={colors}
            placeholder="New York, USA"
            isDark={isDark}
          />
          <ProfileField 
            label="About" 
            value={form.about} 
            icon={<Info color={colors.primary} size={20} />} 
            editing={editing}
            onChangeText={(v: string) => setForm({...form, about: v})}
            colors={colors}
            multiline
            placeholder="Tell us about yourself..."
            isDark={isDark}
          />
          <ProfileOption 
            label="Help & Support" 
            icon={<Info color={colors.primary} size={22} />} 
            onPress={() => navigation.navigate('HelpSupport')}
            colors={colors}
            isDark={isDark}
          />
          <ProfileOption 
            label="Logout" 
            icon={<LogOut color={colors.danger} size={22} />} 
            onPress={logout}
            colors={colors}
            isDark={isDark}
          />
        </GlassCard>
      </ScrollView>
    </Layout>
  );
};

const ProfileField = ({ label, value, icon, editing, onChangeText, colors, multiline, placeholder, isDark }: any) => (
  <View style={[styles.fieldWrapper, { borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
    <View style={styles.fieldHeader}>
      <View style={[styles.fieldIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
        {icon}
      </View>
      <Text style={[styles.fieldLabel, { color: colors.secondaryText }]}>{label}</Text>
    </View>
    {editing ? (
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
      />
    ) : (
      <Text style={[styles.fieldValue, { color: colors.text }]}>{value || 'Not set'}</Text>
    )}
  </View>
);

const ProfileOption = ({ label, icon, onPress, colors, isLast, isDark }: any) => (
  <TouchableOpacity 
    style={[styles.optionRow, !isLast && { borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.optionContent}>
      <View style={[styles.optionIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
        {icon}
      </View>
      <Text style={[styles.optionLabel, { color: colors.text }]}>{label}</Text>
    </View>
     <ChevronRight color={colors.secondaryText} size={20} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { paddingBottom: 120 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backBtn: { padding: 5 },
  title: { fontSize: 20, fontWeight: '800' },
  themeBtn: { padding: 10, borderRadius: 12 },
  avatarContainer: { alignItems: 'center', marginVertical: 20 },
  avatarBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    padding: 4,
    marginBottom: 15,
    position: 'relative',
  },
  avatarImage: { width: '100%', height: '100%', borderRadius: 56 },
  cameraBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#0f172a',
  },
  profileName: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 },
  profileEmail: { fontSize: 14, fontWeight: '500', marginBottom: 15 },
  editBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editBadgeText: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  
  formGlassCard: {
    marginHorizontal: 20,
    borderRadius: 30,
    padding: 0,
    overflow: 'hidden',
  },

  fieldWrapper: { padding: 20, borderBottomWidth: 1 },
  fieldHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  fieldIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  fieldLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  fieldValue: { fontSize: 17, fontWeight: '700', paddingLeft: 50 },
  input: {
    marginLeft: 50,
    fontSize: 16,
    fontWeight: '700',
    padding: 12,
    borderWidth: 1,
    borderRadius: 14,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveBtn: {
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  logoutBtn: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderTopWidth: 1,
  },
  logoutIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: { fontSize: 16, fontWeight: '800' },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  optionContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  optionIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  optionLabel: { fontSize: 16, fontWeight: '700' },
});

export default ProfileScreen;
