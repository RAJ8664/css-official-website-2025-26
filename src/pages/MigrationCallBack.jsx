
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const MigrationCallback = () => {
    const navigate = useNavigate();
    const { refreshProfile, isCollegeEmail } = useAuth();

    useEffect(() => {
        const handleMigrationCallback = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error('Migration callback error:', error);
                    navigate('/email-migration');
                    return;
                }

                if (session?.user) {
                    const userEmail = session.user.email;
                    console.log('Migration callback - Google email:', userEmail);
                    
                    
                    if (isCollegeEmail(userEmail)) {
                        console.log('College Google email detected, updating verification...');
                        
                        
                        const { error: updateError } = await supabase
                            .from('profiles')
                            .update({
                                college_verified_email: userEmail,
                                college_email_verified: true,
                                email: userEmail, 
                                updated_at: new Date().toISOString()
                            })
                            .eq('user_id', session.user.id);

                        if (updateError) {
                            console.error('Error updating college verification:', updateError);
                        } else {
                            console.log('College email verified via Google OAuth');
                        }
                    } else {
                        
                        console.log('Non-college Google email used');
                        await supabase.auth.signOut(); 
                        navigate('/email-migration', { 
                            state: { 
                                error: 'Please use your college Google account (ending with nits.ac.in, cse.nits.ac.in, etc.)' 
                            } 
                        });
                        return;
                    }

                    
                    await refreshProfile();
                    navigate('/chat', { replace: true });

                } else {
                    navigate('/email-migration');
                }
            } catch (error) {
                console.error('Error in migration callback:', error);
                navigate('/email-migration');
            }
        };

        handleMigrationCallback();
    }, [navigate, refreshProfile, isCollegeEmail]);

    return (
        <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                <p className="text-lg">Verifying college email...</p>
                <p className="text-sm text-gray-400 mt-2">Completing migration</p>
            </div>
        </div>
    );
};

export default MigrationCallback;