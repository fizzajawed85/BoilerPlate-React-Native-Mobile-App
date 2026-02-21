import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL, API_TIMEOUT } from '../constants/Config';

// Helper: get stored token
const getToken = async (): Promise<string | null> => {
    const storedAuth = await SecureStore.getItemAsync('auth');
    if (!storedAuth) return null;
    return JSON.parse(storedAuth).token || null;
};

// Create a pre-configured axios client with auth header
const makeClient = async () => {
    const token = await getToken();
    return axios.create({
        baseURL: BASE_URL,
        timeout: API_TIMEOUT,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

// --- APPOINTMENTS ---
export const getDoctors = async () => {
    const client = await makeClient();
    const res = await client.get('/api/appointments/doctors');
    return res.data;
};

export const bookAppointment = async (data: {
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    doctorImageUrl?: string;
}) => {
    const client = await makeClient();
    const res = await client.post('/api/appointments/book', data);
    return res.data;
};

export const getUpcomingAppointments = async () => {
    const client = await makeClient();
    const res = await client.get('/api/appointments/upcoming');
    return res.data;
};

export const getAppointmentHistory = async () => {
    const client = await makeClient();
    const res = await client.get('/api/appointments/history');
    return res.data;
};

export const getAllAppointments = async () => {
    const client = await makeClient();
    const res = await client.get('/api/appointments/all');
    return res.data;
};

export const cancelAppointment = async (id: string) => {
    const client = await makeClient();
    const res = await client.put(`/api/appointments/${id}/cancel`);
    return res.data;
};

// --- USER PROFILE ---
export const getUserProfile = async () => {
    const client = await makeClient();
    const res = await client.get('/api/user/profile');
    return res.data;
};

export const updateUserProfile = async (data: {
    username?: string;
    phoneNumber?: string;
    location?: string;
    about?: string;
}) => {
    const client = await makeClient();
    const res = await client.put('/api/user/update', data);
    return res.data;
};

// --- MEDICAL RECORDS ---
export const getMedicalRecords = async () => {
    const client = await makeClient();
    const res = await client.get('/api/records');
    return res.data;
};

export const addMedicalRecord = async (data: {
    title: string;
    description?: string;
    recordType?: string;
}) => {
    const client = await makeClient();
    const res = await client.post('/api/records/add', data);
    return res.data;
};

export const deleteMedicalRecord = async (id: string) => {
    const client = await makeClient();
    const res = await client.delete(`/api/records/${id}`);
    return res.data;
};

// --- NOTIFICATIONS ---
export const getNotifications = async () => {
    const client = await makeClient();
    const res = await client.get('/api/notifications');
    return res.data;
};

export const markNotificationsRead = async () => {
    const client = await makeClient();
    const res = await client.put('/api/notifications/mark-all-read');
    return res.data;
};

export const markNotificationRead = async (id: string) => {
    const client = await makeClient();
    const res = await client.put(`/api/notifications/${id}/read`);
    return res.data;
};
