import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                setUser(session.user);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
            setLoading(false);
        });

        // Check for an existing session
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
            }
            setLoading(false);
        };

        checkSession();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signInWithGoogle: () => supabase.auth.signInWithOAuth({ provider: 'google' }),
        signOut: () => supabase.auth.signOut(),
        verifyOtp: (data) => supabase.auth.verifyOtp(data),
        user,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;