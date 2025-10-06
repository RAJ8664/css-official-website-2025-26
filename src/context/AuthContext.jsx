import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
            console.error("Error fetching profile:", error);
        }
        return data;
    };

    useEffect(() => {
        setLoading(true);
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const userProfile = await fetchProfile(session.user.id);
                setUser(session.user);
                setProfile(userProfile);
            } else {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        });

        // Initial session check
        const checkInitialSession = async () => {
             const { data: { session } } = await supabase.auth.getSession();
             if(session?.user) {
                const userProfile = await fetchProfile(session.user.id);
                setUser(session.user);
                setProfile(userProfile);
             }
             setLoading(false);
        }
        checkInitialSession();


        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signInWithGoogle: () => supabase.auth.signInWithOAuth({ 
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        }),
        signOut: () => supabase.auth.signOut(),
        verifyOtp: (data) => supabase.auth.verifyOtp(data),
        user,
        profile,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
