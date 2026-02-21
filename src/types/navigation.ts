export type RootStackParamList = {
    // Auth
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    VerifyOtp: { email: string };
    ResetPassword: { token: string };

    // Main App
    MainTabs: { screen?: string } | undefined;

    // Sub-screens (Stack)
    AppointmentHistory: undefined;
    BookAppointment: undefined;
    BookingConfirmation: {
        appointmentId: string;
        doctorName: string;
        date: string;
        time: string;
        location?: string;
        doctorImageUrl?: string;
    };
    HelpSupport: undefined;
    MedicalRecords: undefined;
    Notifications: undefined;
    ConsultationBot: undefined;
    EditProfile: undefined;

    // Legacy mapping (to prevent crash if called)
    Dashboard: undefined;
    UpcomingAppointments: undefined;
    Profile: undefined;
    Home: undefined;
    Visits: undefined;
};
