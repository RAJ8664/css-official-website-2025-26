// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../supabaseClient';
// import { useAuth } from '../context/AuthContext';

// const CollegeVerification = () => {
//     const [collegeEmail, setCollegeEmail] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [step, setStep] = useState('input');
//     const [verificationCode, setVerificationCode] = useState('');
    
//     const { user, profile, refreshProfile } = useAuth();
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (!user) {
//             navigate('/auth');
//             return;
//         }
        
//         if (profile?.college_email_verified) {
//             navigate('/chat');
//             return;
//         }
//     }, [user, profile, navigate]);

//     const validateCollegeEmail = (email) => {
//         const collegeDomains = [
//             'nits.ac.in', 'cse.nits.ac.in', 'ece.nits.ac.in', 'eee.nits.ac.in', 
//             'me.nits.ac.in', 'ch.nits.ac.in', 'maths.nits.ac.in',
//             'physics.nits.ac.in', 'chemistry.nits.ac.in', 'hss.nits.ac.in', 'mba.nits.ac.in'
//         ];
        
//         const domain = email.toLowerCase().split('@')[1];
//         return collegeDomains.includes(domain);
//     };

//     const sendVerificationEmail = async (email) => {
//     const code = Math.floor(100000 + Math.random() * 900000).toString();
    
//     try {

//         // 1. Save to database
//         await supabase.from('college_email_verifications').delete().eq('user_id', user.id);
        
//         const { data: dbData, error: dbError } = await supabase
//             .from('college_email_verifications')
//             .insert({
//                 user_id: user.id,
//                 college_email: email,
//                 verification_token: code,
//                 is_verified: false,
//                 created_at: new Date().toISOString()
//             })
//             .select()
//             .single();

//         if (dbError) throw new Error('Database error: ' + dbError.message);


//         // 2. Send email - use relative path for Vercel
        
//         const response = await fetch('/api/send-verification-email', {
//             method: 'POST',
//             headers: { 
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ 
//                 email: email, 
//                 verificationCode: code 
//             })
//         });


//         if (!response.ok) {
//             const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
//             console.error('❌ API error:', errorData);
//             throw new Error(errorData.error || `HTTP ${response.status}`);
//         }

//         const result = await response.json();
        
//         alert('Verification email sent! Check your inbox.');
//         return code;

//     } catch (error) {
//         console.error('❌ Error in sendVerificationEmail:', error);
        
//         // Even if email fails, return the code
//         alert(`Email service issue. Use verification code: ${code}`);
        
//         return code;
//     }
// };

//     const handleSubmitEmail = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         try {
//             if (!validateCollegeEmail(collegeEmail)) {
//                 throw new Error('Please enter a valid NIT Silchar email (e.g., username@nits.ac.in)');
//             }

//             const code = await sendVerificationEmail(collegeEmail);
//             setStep('verification');
            
//             // Demo only - show code
//             alert(`DEMO: Verification code: ${code}. In production, this would be emailed.`);
            
//         } catch (error) {
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const verifyCode = async () => {
//     setLoading(true);
//     setError('');

//     try {
//         const { data, error } = await supabase
//             .from('college_email_verifications')
//             .select('*')
//             .eq('user_id', user.id)
//             .eq('college_email', collegeEmail)
//             .eq('verification_token', verificationCode)
//             .eq('is_verified', false)
//             .single();

//         if (error || !data) {
//             throw new Error('Invalid verification code. Please try again.');
//         }

//         // Check if code is expired (10 minutes)
//         const createdAt = new Date(data.created_at);
//         const now = new Date();
//         const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
        
//         if (createdAt < tenMinutesAgo) {
//             throw new Error('Verification code has expired. Please request a new one.');
//         }

//         // Update user profile - FIXED COLUMN NAMES
//         const { error: updateError } = await supabase
//             .from('profiles')
//             .update({
//                 college_email: collegeEmail, // Make sure this column exists
//                 college_email_verified: true,
//                 updated_at: new Date().toISOString()
//             })
//             .eq('user_id', user.id);

//         if (updateError) {
//             console.error('Profile update error:', updateError);
//             throw new Error('Failed to update profile. Please try again.');
//         }

//         // Mark verification as complete
//         await supabase
//             .from('college_email_verifications')
//             .update({
//                 is_verified: true,
//                 verified_at: new Date().toISOString()
//             })
//             .eq('id', data.id);

//         await refreshProfile();
//         setStep('success');
        
//         setTimeout(() => {
//             navigate('/chat');
//         }, 2000);

//     } catch (error) {
//         setError(error.message);
//     } finally {
//         setLoading(false);
//     }
// };

//     const resendCode = async () => {
//         setLoading(true);
//         setError('');

//         try {
//             const code = await sendVerificationEmail(collegeEmail);
//             alert(`DEMO: New verification code: ${code}`);
//         } catch (error) {
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!user) {
//         return (
//             <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] flex items-center justify-center">
//                 <div className="text-white text-center">
//                     <p>Please log in to access this page.</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center p-4">
//             <div className="max-w-md w-full bg-black/70 border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-lg">
                
//                 <div className="text-center mb-8">
//                     <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <span className="text-3xl">🎓</span>
//                     </div>
//                     <h1 className="text-3xl font-bold text-white mb-2">NIT Silchar Verification</h1>
//                     <p className="text-gray-400">
//                         Verify your institute email to access the chat
//                     </p>
//                 </div>

//                 {error && (
//                     <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
//                         <div className="flex items-center gap-2">
//                             <span>⚠️</span>
//                             <span>{error}</span>
//                         </div>
//                     </div>
//                 )}

//                 {step === 'input' && (
//                     <form onSubmit={handleSubmitEmail} className="space-y-6">
//                         <div>
//                             <label className="block text-sm font-medium text-cyan-300 mb-3">
//                                 Enter Your NIT Silchar Email
//                             </label>
//                             <input
//                                 type="email"
//                                 value={collegeEmail}
//                                 onChange={(e) => setCollegeEmail(e.target.value)}
//                                 placeholder="username@nits.ac.in"
//                                 className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 text-lg"
//                                 required
//                             />
//                             <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
//                                 <p className="text-sm text-cyan-300 font-semibold mb-2">
//                                     Accepted NIT Silchar Email Formats:
//                                 </p>
//                                 <div className="text-xs text-gray-300 space-y-1">
//                                     <p>• username@nits.ac.in</p>
//                                     <p>• username@cse.nits.ac.in</p>
//                                     <p>• username@ece.nits.ac.in</p>
//                                     <p>• And other department emails</p>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         <button
//                             type="submit"
//                             disabled={loading || !collegeEmail}
//                             className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {loading ? 'Sending Code...' : 'Send Verification Code'}
//                         </button>
//                     </form>
//                 )}

//                 {step === 'verification' && (
//                     <div className="space-y-6">
//                         <div className="text-center">
//                             <p className="text-gray-300 mb-2">
//                                 We sent a verification code to:
//                             </p>
//                             <p className="text-cyan-300 font-semibold text-lg">{collegeEmail}</p>
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-cyan-300 mb-3">
//                                 Enter 6-Digit Verification Code
//                             </label>
//                             <input
//                                 type="text"
//                                 value={verificationCode}
//                                 onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                                 placeholder="000000"
//                                 className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:border-cyan-500"
//                                 maxLength={6}
//                                 required
//                             />
//                         </div>

//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setStep('input')}
//                                 disabled={loading}
//                                 className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
//                             >
//                                 Change Email
//                             </button>
//                             <button
//                                 onClick={verifyCode}
//                                 disabled={loading || verificationCode.length !== 6}
//                                 className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {loading ? 'Verifying...' : 'Verify Code'}
//                             </button>
//                         </div>

//                         <div className="text-center">
//                             <button
//                                 onClick={resendCode}
//                                 disabled={loading}
//                                 className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors disabled:opacity-50"
//                             >
//                                 Didn't receive code? Resend
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 {step === 'success' && (
//                     <div className="text-center space-y-6">
//                         <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
//                             <span className="text-3xl">✅</span>
//                         </div>
//                         <div>
//                             <h3 className="text-2xl font-bold text-green-400 mb-2">Successfully Verified!</h3>
//                             <p className="text-gray-300">
//                                 Your college email has been verified.
//                             </p>
//                         </div>
//                         <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
//                             <p className="text-green-300 text-sm">
//                                 Redirecting to chat...
//                             </p>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CollegeVerification;