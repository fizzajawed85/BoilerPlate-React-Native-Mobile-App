import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Plus, Minus, Search } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';

const FAQS = [
  { 
    id: 1, 
    question: "How do I schedule an appointment?", 
    answer: "Go to the Home or Appointments tab and tap 'Schedule New'. Select your preferred doctor, date, and time slot to confirm." 
  },
  { 
    id: 2, 
    question: "Can I view my medical records?", 
    answer: "Yes, you can upload and view your medical reports in the 'Records' tab. All data is encrypted and secure." 
  },
  { 
    id: 3, 
    question: "How do I contact my doctor?", 
    answer: "After booking an appointment, doctor contact details will be available in the appointment details screen." 
  },
  { 
    id: 4, 
    question: "What if I need to cancel?", 
    answer: "You can cancel any upcoming appointment from the Appointments tab up to 24 hours before the scheduled time." 
  },
  { 
    id: 5, 
    question: "Is my data secure?", 
    answer: "We use hospital-grade encryption and secure private storage to ensure your medical history remains private." 
  }
];

const HelpSupportScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <Layout>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.text} size={28} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Help & Support</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heroTitle, { color: colors.text }]}>FAQs</Text>
        <Text style={[styles.heroSubtitle, { color: colors.secondaryText }]}>Find solutions to common medical portal queries below.</Text>

        <View style={styles.faqList}>
          {FAQS.map(faq => {
            const isExpanded = expanded === faq.id;
            return (
              <GlassCard 
                key={faq.id} 
                style={[
                  styles.faqGlassCard, 
                  { borderColor: isExpanded ? colors.primary : 'rgba(255,255,255,0.05)' }
                ]}
              >
                <TouchableOpacity 
                   style={styles.faqHeader} 
                   onPress={() => toggle(faq.id)}
                   activeOpacity={0.7}
                >
                  <Text style={[styles.question, { color: colors.text }]}>{faq.question}</Text>
                  <View style={[styles.iconContainer, { backgroundColor: isExpanded ? colors.primary : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)') }]}>
                    {isExpanded ? <Minus color="#fff" size={18} /> : <Plus color={colors.primary} size={18} />}
                  </View>
                </TouchableOpacity>
                
                {isExpanded && (
                  <View style={styles.answerContainer}>
                     <Text style={[styles.answer, { color: colors.secondaryText }]}>{faq.answer}</Text>
                  </View>
                )}
              </GlassCard>
            );
          })}
        </View>

        <Text style={[styles.contactText, { color: colors.secondaryText }]}>
           Still Need Support?{"\n"}Reach us at <Text style={{ color: colors.primary, fontWeight: '800' }}>concierge@medpoint.com</Text>
        </Text>
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
    marginBottom: 20,
  },
  backBtn: { padding: 5 },
  title: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  container: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 60 },
  heroTitle: { fontSize: 34, fontWeight: '900', color: '#fff', marginBottom: 10, letterSpacing: -1 },
  heroSubtitle: { fontSize: 16, lineHeight: 24, marginBottom: 40, opacity: 0.8 },
  faqList: { gap: 16 },
  faqGlassCard: { borderRadius: 28, overflow: 'hidden', borderWidth: 1 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  question: { flex: 1, fontSize: 16, fontWeight: '800', paddingRight: 10, letterSpacing: -0.2 },
  iconContainer: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  answerContainer: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 5 },
  answer: { fontSize: 14, lineHeight: 22, fontWeight: '500' },
  contactText: { textAlign: 'center', marginTop: 50, fontSize: 14, lineHeight: 22, fontWeight: '600' }
});

export default HelpSupportScreen;
