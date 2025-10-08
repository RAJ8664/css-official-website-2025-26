import React from 'react';
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requiresProfileCompletion, setRequiresProfileCompletion] = useState(false);
    
    
    const initializedRef = useRef(false);
    const processingAuthChangeRef = useRef(false);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', userId)
                .single();
            
            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                console.error("Error fetching profile:", error);
                return null;
            }
           
            return data;
        } catch (error) {
            console.error("Error in fetchProfile:", error);
            return null;
        }
    };

    const checkProfileCompletion = (profileData) => {
        return profileData && profileData.full_name && profileData.scholar_id;
    };

    const processAuthSession = async (session, source) => {
        // Prevent concurrent processing
        if (processingAuthChangeRef.current) {
            return;
        }

        processingAuthChangeRef.current = true;
        
        try {
            if (session?.user) {
                setUser(session.user);
                
                const userProfile = await fetchProfile(session.user.id);
                setProfile(userProfile);
                
                const profileComplete = checkProfileCompletion(userProfile);
                setRequiresProfileCompletion(!profileComplete);
            } else {
                setUser(null);
                setProfile(null);
                setRequiresProfileCompletion(false);
            }
        } catch (error) {
            console.error('❌ Error processing auth session:', error);
        } finally {
            processingAuthChangeRef.current = false;
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            if (initializedRef.current) {
                return;
            }

            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error("Session error:", error);
                    return;
                }

                
                if (mounted && session) {
                    await processAuthSession(session, 'initial_check');
                } else if (mounted) {
                    setLoading(false);
                }
                
                initializedRef.current = true;
            } catch (error) {
                console.error("🚨 Auth initialization error:", error);
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        // Set up auth state change listener with debouncing
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            
            setTimeout(async () => {
                if (!mounted) return;
                
                if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
                    await processAuthSession(session, `event_${event}`);
                } else if (event === 'TOKEN_REFRESHED') {
                    if (session?.user) {
                        setUser(session.user);
                    }
                }
            }, 10); // Small delay to prevent duplicate processing
        });

        // Start the initialization
        initializeAuth();

        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    
    const signIn = async (credentials) => {
        const { data, error } = await supabase.auth.signInWithPassword(credentials);
        if (error) throw error;
        return { data, error: null };
    };

    const signUp = async (email, password, fullName, scholarId) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName, scholar_id: scholarId } }
        });

        if (error) throw error;

        // Create profile
        if (data.user) {
            await supabase.from('profiles').upsert({
                user_id: data.user.id,
                full_name: fullName,
                scholar_id: scholarId,
                updated_at: new Date().toISOString(),
            });
        }

        return data;
    };

    const verifyOtp = async (params) => {
        const { data, error } = await supabase.auth.verifyOtp(params);
        if (error) throw error;
        return data;
    };

    const value = {
        signUp,
        signIn,
        signInWithGoogle: () => supabase.auth.signInWithOAuth({ 
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` }
        }),
        signOut: () => supabase.auth.signOut(),
        verifyOtp,
        user,
        profile,
        loading,
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