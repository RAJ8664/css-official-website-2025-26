import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { refreshProfile, isCollegeEmail } = useAuth();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error('Auth callback error:', error);
                    navigate('/auth');
                    return;
                }

                if (session?.user) {
                    const userEmail = session.user.email;
                    
                    
                    if (isCollegeEmail(userEmail)) {
                        
                        const { error: updateError } = await supabase
                            .from('profiles')
                            .update({
                                college_email_verified: true,
                                email: userEmail, 
                                updated_at: new Date().toISOString()
                            })
                            .eq('user_id', session.user.id);

                        if (updateError) {
                            console.error('Error updating college verification:', updateError);
                        } else {
                            console.log('College email verification status updated.');}
                    }

                    await refreshProfile();
                    
                    
                    let redirectTo = '/esperanza'; 
                    
                    
                    const storedRedirect = localStorage.getItem('postVerificationRedirect');
                    if (storedRedirect) {
                        redirectTo = storedRedirect;
                        localStorage.removeItem('postVerificationRedirect');
                    }
                    
                    
                    const urlParams = new URLSearchParams(window.location.search);
                    const fromMigration = urlParams.get('from_migration');
                    
                    if (fromMigration === 'true') {
                        redirectTo = '/chat'; 
                    }

                    
                    const previousPath = document.referrer;
                    if (previousPath && previousPath.includes('/esperanza')) {
                        redirectTo = '/esperanza';
                    }

                    
                    const intendedDestination = sessionStorage.getItem('auth_redirect');
                    if (intendedDestination) {
                        redirectTo = intendedDestination;
                        sessionStorage.removeItem('auth_redirect');
                    }

                    navigate(redirectTo, { replace: true });

                } else {
                    
                    const timeout = setTimeout(() => {
                        navigate('/auth', { replace: true });
                    }, 5000);

                    return () => clearTimeout(timeout);
                }
            } catch (error) {
                console.error('Error in auth callback:', error);
                navigate('/auth', { replace: true });
            }
        };

        handleAuthCallback();
    }, [navigate, refreshProfile, isCollegeEmail]);

    return (
        <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                <p className="text-lg">Completing authentication...</p>
                <p className="text-sm text-gray-400 mt-2">You will be redirected shortly</p>
            </div>
        </div>
    );
};

export default AuthCallback;