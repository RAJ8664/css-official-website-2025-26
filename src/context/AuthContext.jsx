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
    
    // Use refs to track state without causing re-renders
    const initializedRef = useRef(false);
    const processingAuthChangeRef = useRef(false);

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
                    console.log('❌ No profile found');
                    return null;
                }
                console.error("Error fetching profile:", error);
                return null;
            }
            console.log('✅ Profile found');
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
            console.log('⏳ Skipping - already processing auth change');
            return;
        }

        processingAuthChangeRef.current = true;
        
        try {
            console.log(`🔄 Processing auth from: ${source}`, session?.user?.email);

            if (session?.user) {
                setUser(session.user);
                
                const userProfile = await fetchProfile(session.user.id);
                setProfile(userProfile);
                
                const profileComplete = checkProfileCompletion(userProfile);
                setRequiresProfileCompletion(!profileComplete);
                
                console.log('✅ Auth processing complete:', {
                    user: session.user.email,
                    profileExists: !!userProfile,
                    profileComplete: profileComplete
                });
            } else {
                console.log('✅ No session - clearing auth state');
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
                console.log('🚫 Already initialized, skipping');
                return;
            }

            try {
                console.log('🔄 Initial auth check...');
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error("Session error:", error);
                    return;
                }

                console.log('📋 Initial session:', session ? 'Found' : 'None');
                
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

            console.log('🎯 Auth state change:', event);
            
            // Use setTimeout to break the synchronous call chain that causes duplicates
            setTimeout(async () => {
                if (!mounted) return;
                
                // Only process meaningful events
                if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
                    await processAuthSession(session, `event_${event}`);
                } else if (event === 'TOKEN_REFRESHED') {
                    // Just update user without refetching profile
                    if (session?.user) {
                        setUser(session.user);
                    }
                }
            }, 10); // Small delay to prevent duplicate processing
        });

        // Start the initialization
        initializeAuth();

        return () => {
            console.log('🧹 Cleaning up auth');
            mounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    // Auth methods
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