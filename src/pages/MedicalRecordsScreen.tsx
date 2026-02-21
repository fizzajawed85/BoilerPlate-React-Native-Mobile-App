import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity, ActivityIndicator, RefreshControl,
  Platform, TextInput, Modal, KeyboardAvoidingView, ScrollView, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getMedicalRecords, addMedicalRecord, deleteMedicalRecord } from '../services/medicalService';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import { 
  ChevronLeft, 
  Plus, 
  Search, 
  FileText, 
  Trash2, 
  Calendar as CalendarIcon,
  X,
  FileCheck2,
  Filter,
  User,
  FilePlus
} from 'lucide-react-native';

const RECORD_TYPES = ['Lab Report', 'Prescription', 'X-Ray', 'Scan', 'Other'];

const MedicalRecordsScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', recordType: 'Other' });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRecords = async () => {
    try {
      setError('');
      const data = await getMedicalRecords();
      setRecords(data.records || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load records');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleAdd = async () => {
    if (!form.title.trim()) return Alert.alert('Error', 'Title is required');
    setSaving(true);
    try {
      await addMedicalRecord(form);
      setModalVisible(false);
      setForm({ title: '', description: '', recordType: 'Other' });
      fetchRecords();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to save record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Record', 'Are you sure you want to remove this record?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteMedicalRecord(id);
            fetchRecords();
          } catch { Alert.alert('Error', 'Failed to delete record'); }
        }
      },
    ]);
  };

  const renderItem = ({ item }: any) => {
    const date = new Date(item.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    return (
      <GlassCard style={styles.recordGlassCard}>
        <View style={styles.cardContent}>
          <View style={[styles.fileIcon, { backgroundColor: colors.primary + '15' }]}>
            <FileText color={colors.primary} size={24} />
          </View>

          <View style={styles.recordInfo}>
            <Text style={[styles.recordName, { color: colors.text }]}>{item.title}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <User color={colors.muted} size={12} />
                <Text style={[styles.metaText, { color: colors.secondaryText }]}>{item.recordType}</Text>
              </View>
              <View style={styles.metaItem}>
                <CalendarIcon color={colors.muted} size={12} />
                <Text style={[styles.metaText, { color: colors.secondaryText }]}>{date}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.deleteBtn, { backgroundColor: colors.danger + '10' }]}
            onPress={() => handleDelete(item._id)}
          >
            <Trash2 color={colors.danger} size={18} />
          </TouchableOpacity>
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
        <Text style={[styles.title, { color: colors.text }]}>Medical Records</Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={() => setModalVisible(true)}>
           <Plus color={colors.text} size={24} />
        </TouchableOpacity>
      </View>

      <GlassCard style={styles.searchGlassCard}>
        <View style={styles.searchContainer}>
          <Search color={colors.primary} size={18} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search records by name or doctor..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </GlassCard>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <TouchableOpacity onPress={fetchRecords} style={[styles.retryBtn, { backgroundColor: colors.primary }]}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : records.length === 0 ? (
        <View style={styles.center}>
          <View style={[styles.emptyIconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
             <FileCheck2 color={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} size={48} />
          </View>
          <Text style={[styles.emptyText, { color: colors.text }]}>No Records Yet</Text>
          <Text style={[styles.emptyDesc, { color: colors.secondaryText }]}>Upload your clinical reports, prescriptions and results securely.</Text>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchRecords(); }}
              tintColor={colors.primary}
            />
          }
        />
      )}

      {/* Add Record Modal */}
      <Modal 
        visible={modalVisible} 
        transparent 
        animationType="slide" 
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <View style={[
              styles.modalContent, 
              { backgroundColor: isDark ? '#111827' : '#fff' }
            ]}>
              <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>New Record</Text>
                  <TouchableOpacity 
                    onPress={() => setModalVisible(false)} 
                    style={[styles.closeBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}
                  >
                    <X color={colors.text} size={20} />
                  </TouchableOpacity>
              </View>

              <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.formContainer}>
                  <Text style={[styles.label, { color: colors.secondaryText }]}>Title</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: colors.text, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}
                    placeholder="e.g., Blood Test"
                    placeholderTextColor={colors.muted}
                    value={form.title}
                    onChangeText={(t) => setForm({ ...form, title: t })}
                  />

                  <Text style={[styles.label, { color: colors.secondaryText }]}>Description (Optional)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: colors.text, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', height: 100 }]}
                    placeholder="Details..."
                    placeholderTextColor={colors.muted}
                    value={form.description}
                    onChangeText={(t) => setForm({ ...form, description: t })}
                    multiline
                    textAlignVertical="top"
                  />

                  <Text style={[styles.label, { color: colors.secondaryText }]}>Category</Text>
                  <View style={styles.typeGrid}>
                    {RECORD_TYPES.map((type) => {
                      const isSelected = form.recordType === type;
                      return (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.typeChip,
                            {
                              backgroundColor: isSelected ? colors.primary : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                              borderColor: isSelected ? colors.primary : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
                            }
                          ]}
                          onPress={() => setForm({ ...form, recordType: type })}
                        >
                          <Text style={[styles.typeChipText, { color: isSelected ? '#fff' : colors.text }]}>{type}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <TouchableOpacity
                    onPress={handleAdd}
                    style={styles.saveBtnContainer}
                    disabled={saving}
                  >
                    <LinearGradient
                      colors={[colors.primary, '#818cf8']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.saveBtnGradient}
                    >
                      {saving ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <View style={styles.saveBtnContent}>
                          <FilePlus color="#fff" size={18} />
                          <Text style={styles.saveBtnText}>Add Record</Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
  addBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#6366f1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  title: { fontSize: 20, fontWeight: '800' },

  searchGlassCard: {
    paddingHorizontal: 16,
    paddingVertical: 0, 
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 14,
    height: 48,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 10, 
    fontSize: 14, 
    fontWeight: '600',
    height: '100%',
    paddingVertical: 0,
  },

  list: { paddingHorizontal: 20, paddingBottom: 120 },

  recordGlassCard: {
    borderRadius: 22,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardContent: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  fileIcon: { width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  recordInfo: { flex: 1, marginLeft: 16 },
  recordName: { fontSize: 16, fontWeight: '700' },
  metaRow: { flexDirection: 'row', marginTop: 4, gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, fontWeight: '500' },
  recordDesc: { fontSize: 13, fontWeight: '500', lineHeight: 20 },
  deleteBtn: { padding: 10, borderRadius: 12 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIconContainer: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  emptyText: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  emptyDesc: { fontSize: 14, fontWeight: '500', textAlign: 'center', lineHeight: 22 },
  errorText: { fontSize: 15, fontWeight: '800', marginBottom: 20, textAlign: 'center' },
  retryBtn: { paddingHorizontal: 30, paddingVertical: 12, borderRadius: 12 },
  retryText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  keyboardView: { flex: 1, justifyContent: 'flex-end' },
  modalContent: {
    height: '92%', // Almost full but feels like a sheet
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    overflow: 'hidden',
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24,
    marginBottom: 20 
  },
  modalTitle: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  closeBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: 60 },
  formContainer: { paddingHorizontal: 24 },
  label: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 10 },
  input: { padding: 18, borderRadius: 18, fontSize: 16, fontWeight: '700', borderWidth: 1, marginBottom: 24 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 35 },
  typeChip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, borderWidth: 1 },
  typeChipText: { fontSize: 14, fontWeight: '800' },
  saveBtnContainer: { 
    alignSelf: 'center', 
    minWidth: '60%',
    shadowColor: '#6366f1', 
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 12,
    elevation: 8,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 40,
  },
  saveBtnGradient: {
    paddingVertical: 14, 
    paddingHorizontal: 28, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  saveBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
});

export default MedicalRecordsScreen;
