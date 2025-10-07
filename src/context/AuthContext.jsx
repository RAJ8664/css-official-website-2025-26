import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requiresProfileCompletion, setRequiresProfileCompletion] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const fetchProfile = async (userId) => {
        try {
            console.log('📋 Fetching profile for user:', userId);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', userId)
                .single();
            
            if (error) {
                if (error.code === 'PGRST116') {
                    console.log('❌ No profile found - new user needs to complete profile');
                    return null;
                }
                console.error("Error fetching profile:", error);
                return null;
            }
            console.log('✅ Profile found:', data);
            return data;
        } catch (error) {
            console.error("Error in fetchProfile:", error);
            return null;
        }
    };

    const checkProfileCompletion = (profileData) => {
        const isComplete = profileData && profileData.full_name && profileData.scholar_id;
        console.log('🔍 Profile completion check:', { 
            hasProfile: !!profileData, 
            hasName: !!profileData?.full_name, 
            hasScholarId: !!profileData?.scholar_id,
            isComplete 
        });
        return isComplete;
    };

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            setLoading(true);
            
            try {
                console.log('🔄 Checking for existing session...');
                
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error("Session error:", error);
                    if (mounted) {
                        setLoading(false);
                        setInitialized(true);
                    }
                    return;
                }

                console.log('📋 Session found:', session ? `Yes - ${session.user.email}` : 'No');

                if (session?.user && mounted) {
                    console.log('👤 User detected:', session.user.email);
                    setUser(session.user);
                    
                    // Fetch profile data
                    const userProfile = await fetchProfile(session.user.id);
                    setProfile(userProfile);
                    
                    // Check if profile needs completion
                    const profileComplete = checkProfileCompletion(userProfile);
                    setRequiresProfileCompletion(!profileComplete);
                    
                    console.log('🔐 Auth state:', {
                        user: session.user.email,
                        profileExists: !!userProfile,
                        requiresProfileCompletion: !profileComplete
                    });
                } else if (mounted) {
                    console.log('❌ No user session');
                    setUser(null);
                    setProfile(null);
                    setRequiresProfileCompletion(false);
                }
            } catch (error) {
                console.error("🚨 Auth initialization error:", error);
            } finally {
                if (mounted) {
                    setLoading(false);
                    setInitialized(true);
                    console.log('✅ Auth initialization complete');
                }
            }
        };

        initializeAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            console.log('🔄 Auth state changed:', event, session ? `User: ${session.user?.email}` : 'No session');

            if (session?.user) {
                console.log('👤 User authenticated:', session.user.email);
                setUser(session.user);
                
                // Fetch profile when user logs in
                const userProfile = await fetchProfile(session.user.id);
                setProfile(userProfile);
                
                const profileComplete = checkProfileCompletion(userProfile);
                setRequiresProfileCompletion(!profileComplete);
                
                console.log('📊 After login:', {
                    profileExists: !!userProfile,
                    requiresProfileCompletion: !profileComplete
                });
            } else {
                console.log('👤 User signed out');
                setUser(null);
                setProfile(null);
                setRequiresProfileCompletion(false);
            }
        });

        return () => {
            console.log('🧹 Cleaning up auth listener');
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Enhanced signIn function
    const signIn = async (credentials) => {
        try {
            console.log('🔐 Attempting login for:', credentials.email);
            
            const { data, error } = await supabase.auth.signInWithPassword(credentials);
            
            if (error) {
                console.error('❌ Login error:', error);
                throw error;
            }
            
            console.log('✅ Login successful:', data.user.email);
            
            // Fetch profile immediately after login
            if (data.user) {
                const userProfile = await fetchProfile(data.user.id);
                setProfile(userProfile);
                
                const profileComplete = checkProfileCompletion(userProfile);
                setRequiresProfileCompletion(!profileComplete);
                
                console.log('📋 Profile after login:', {
                    profileExists: !!userProfile,
                    requiresProfileCompletion: !profileComplete
                });
            }
            
            return { data, error: null };
            
        } catch (error) {
            console.error('🚨 Login process error:', error);
            return { data: null, error };
        }
    };

    const signUp = async (email, password, fullName, scholarId) => {
        try {
            console.log('🚀 Starting signup process...');
            
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        scholar_id: scholarId,
                    }
                }
            });

            console.log('📨 Signup response:', { data, error });

            if (error) {
                console.error('❌ Signup error:', error);
                throw error;
            }

            // Create profile if user was created
            if (data.user) {
                try {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .upsert({
                            user_id: data.user.id,
                            full_name: fullName,
                            scholar_id: scholarId,
                            updated_at: new Date().toISOString(),
                        });

                    if (profileError) {
                        console.error('❌ Profile creation error:', profileError);
                    } else {
                        console.log('✅ Profile created successfully');
                    }
                } catch (profileError) {
                    console.error('❌ Profile creation failed:', profileError);
                }
            }

            return data;
            
        } catch (error) {
            console.error('🚨 Signup process error:', error);
            throw error;
        }
    };

    const verifyOtp = async (params) => {
        try {
            console.log('🔑 Verifying OTP for email:', params.email);
            
            const { data, error } = await supabase.auth.verifyOtp({
                email: params.email,
                token: params.token,
                type: params.type || 'email'
            });

            console.log('✅ OTP verification response:', { data, error });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('❌ OTP verification process error:', error);
            throw error;
        }
    };

    const value = {
        signUp,
        signIn, // Use our enhanced signIn function
        signInWithGoogle: () => supabase.auth.signInWithOAuth({ 
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            },
        }),
        signOut: () => supabase.auth.signOut(),
        verifyOtp,
        user,
        profile,
        loading: loading && !initialized,
        requiresProfileCompletion,
        refreshProfile: async () => {
            if (user) {
                const userProfile = await fetchProfile(user.id);
                setProfile(userProfile);
                setRequiresProfileCompletion(!checkProfileCompletion(userProfile));
                return userProfile;
            }
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;