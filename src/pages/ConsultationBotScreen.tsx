import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import { 
  ChevronLeft, 
  Send, 
  Bot, 
  User,
  MessageSquare,
  Stethoscope,
  Calendar,
  ClipboardList,
  Info
} from 'lucide-react-native';
import { getDoctors } from '../services/medicalService';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ConsultationBotScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm MedBot, your healthcare assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    getDoctors().then(data => {
      setDoctorsCount(data.doctors?.length || 0);
    }).catch(() => {});
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate Bot Response
    setTimeout(() => {
      const botResponse = generateResponse(userMessage.text.toLowerCase());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (input: string): string => {
    // Knowledge Base Logic
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hi there! I'm here to guide you through MedPoint. You can ask me about booking appointments, managing records, or our available doctors.";
    }
    if (input.includes('book') || input.includes('appointment')) {
      return "To book an appointment, go to the Dashboard and click 'Book Visit'. You can choose from our specialists, select a date on the calendar, and pick an available time slot. Our system ensures no double-bookings!";
    }
    if (input.includes('doctor') || input.includes('specialist')) {
      return `We currently have ${doctorsCount} expert doctors available in various specialties including Cardiology, Dermatology, Neurology, and more. You can view their full profiles in the booking section.`;
    }
    if (input.includes('record') || input.includes('file') || input.includes('report')) {
      return "You can manage all your medical documents in the 'Records' section. Upload lab reports, prescriptions, or X-rays to keep your health history safe and accessible.";
    }
    if (input.includes('hackathon') || input.includes('about')) {
      return "MedPoint is a full-stack Medical Appointment & Records Management System developed for the Grand Hackathon. It features a React Native frontend and a Node.js/Express backend with JWT authentication.";
    }
    if (input.includes('profile') || input.includes('edit')) {
      return "You can update your personal information, phone number, and location in the 'Profile' tab. You can even upload your own profile picture!";
    }
    if (input.includes('login') || input.includes('signup') || input.includes('auth')) {
      return "The app uses secure JWT authentication. Once you log in, your session is saved so you can quickly access your medical data.";
    }
    if (input.includes('help') || input.includes('guide')) {
      return "I can help you navigate the app! Ask me about 'booking', 'records', 'doctors', or 'profile'.";
    }
    if (input.includes('thanks') || input.includes('thank you')) {
      return "You're very welcome! Stay healthy!";
    }

    return "That's an interesting question! While I'm still learning, I can tell you all about how to book appointments, manage your medical records, or find doctors in this system. What would you like to know?";
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[
        styles.messageWrapper,
        isUser ? styles.userMessageWrapper : styles.botMessageWrapper
      ]}>
        {!isUser && (
          <View style={[styles.avatarMarker, { backgroundColor: colors.primary }]}>
            <Bot color="#fff" size={14} />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isUser 
            ? [styles.userBubble, { backgroundColor: colors.primary }] 
            : [styles.botBubble, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6' }]
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? { color: '#fff' } : { color: colors.text }
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timestamp,
            isUser ? { color: 'rgba(255,255,255,0.6)' } : { color: colors.muted }
          ]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {isUser && (
          <View style={[styles.avatarMarker, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
            <User color={colors.text} size={14} />
          </View>
        )}
      </View>
    );
  };

  return (
    <Layout>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.text} size={28} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>MedBot AI</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: '#10b981' }]} />
            <Text style={[styles.statusText, { color: colors.secondaryText }]}>Online Assistant</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.infoBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
          <Info color={colors.text} size={20} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isTyping && (
        <View style={styles.typingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.typingText, { color: colors.secondaryText }]}>MedBot is thinking...</Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <GlassCard style={styles.inputGlassCard} intensity={20}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Ask anything..."
              placeholderTextColor={colors.muted}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity 
              style={[
                styles.sendBtn, 
                { backgroundColor: colors.primary },
                !inputText.trim() && { opacity: 0.6 }
              ]}
              onPress={handleSend}
              disabled={!inputText.trim() || isTyping}
            >
              <Send color="#fff" size={20} />
            </TouchableOpacity>
          </View>
        </GlassCard>
      </KeyboardAvoidingView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backBtn: { padding: 5, marginRight: 10 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: '600' },
  infoBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  chatContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    maxWidth: '85%',
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
  },
  botMessageWrapper: {
    alignSelf: 'flex-start',
  },
  avatarMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 6,
    textAlign: 'right',
    fontWeight: '600',
  },

  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  typingText: {
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'italic',
  },

  inputGlassCard: {
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: 15,
    paddingTop: 8,
    paddingBottom: 8,
    fontWeight: '500',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});

export default ConsultationBotScreen;
