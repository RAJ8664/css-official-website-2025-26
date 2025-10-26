import React, { useState, useEffect } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';
import { supabase } from '/src/supabaseClient.js';
import { useNavigate } from 'react-router-dom';

// Toast Component
const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const borderColor = type === 'success' ? 'border-green-500' : 'border-red-500';

    return (
        <div className={`fixed top-4 right-4 left-4 sm:left-auto ${bgColor} border ${borderColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 animate-in slide-in-from-right`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {type === 'success' ? (
                        <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    )}
                    <span className="font-medium text-sm sm:text-base">{message}</span>
                </div>
                <button
                    onClick={onClose}
                    className="ml-2 text-white hover:text-gray-200 transition-colors flex-shrink-0"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

// Form Components
const FormInput = ({ id, label, type = 'text', value, onChange, placeholder, required = false, disabled = false }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-700 disabled:cursor-not-allowed text-base"
        />
    </div>
);

const FormTextarea = ({ id, label, value, onChange, placeholder, required = false, rows = 4 }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-base resize-vertical"
        />
    </div>
);

const SubmitButton = ({ text, loading = false, disabled = false }) => (
    <button
        type="submit"
        disabled={loading || disabled}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-300 disabled:bg-cyan-800 disabled:cursor-not-allowed text-base touch-manipulation active:scale-95"
    >
        {loading ? (
            <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Registering...</span>
            </div>
        ) : (
            text
        )}
    </button>
);

// Event Forms
const RampwalkForm = ({ onRegistrationSuccess, isAlreadyRegistered, showToast }) => {
    const { user, profile: authProfile } = useAuth(); 
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [scholarId, setScholarId] = useState('');
    const [hasPartner, setHasPartner] = useState(false);
    const [partnerName, setPartnerName] = useState('');
    const [partnerScholarId, setPartnerScholarId] = useState('');
    const [partnerContact, setPartnerContact] = useState('');
    const [loading, setLoading] = useState(false);

    // Prefill user data if available
    useEffect(() => {
        if (authProfile?.full_name) setName(authProfile.full_name);
        if (authProfile?.scholar_id) setScholarId(authProfile.scholar_id);
    }, [authProfile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isAlreadyRegistered) return;
        
        setLoading(true);
        
        try {
            const formData = {
                name,
                email: user?.email || '',
                contact_number: contactNumber,
                scholar_id: scholarId,
                has_partner: hasPartner,
                ...(hasPartner && {
                    partner_name: partnerName,
                    partner_scholar_id: partnerScholarId,
                    partner_contact: partnerContact
                })
            };

            const { data, error } = await supabase
                .from('event_registrations')
                .insert([
                    {
                        user_id: user.id,
                        event_slug: 'rampwalk',
                        event_name: 'Rampwalk',
                        form_data: formData,
                        registered_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;

            onRegistrationSuccess();
            showToast('Successfully registered for Rampwalk!', 'success');
            
        } catch (error) {
            console.error('Error submitting registration:', error);
            showToast('Error submitting registration. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (isAlreadyRegistered) {
        return (
            <div className="text-center py-6">
                <div className="text-green-400 text-5xl mb-4">✓</div>
                <h2 className="text-xl font-semibold mb-3 text-white">Already Registered!</h2>
                <p className="text-gray-300 mb-4 text-sm">
                    You have successfully registered for Rampwalk.
                </p>
                <p className="text-cyan-400 text-sm">
                    You can now join the WhatsApp group using the button below.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-2 text-white">Register for Rampwalk</h2>
            
            <FormInput
                id="name"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
            />
            
            <FormInput
                id="email"
                label="Email"
                value={user?.email || ''}
                disabled
            />
            
            <FormInput
                id="contactNumber"
                label="Contact Number"
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter your contact number"
                required
            />
            
            <FormInput
                id="scholarId"
                label="Scholar ID"
                value={scholarId}
                onChange={(e) => setScholarId(e.target.value)}
                placeholder="Enter your scholar ID"
                required
            />

            <div className="mb-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={hasPartner}
                        onChange={(e) => setHasPartner(e.target.checked)}
                        className="mr-3 w-4 h-4"
                    />
                    <span className="text-gray-300 text-sm">I have a partner</span>
                </label>
            </div>

            {hasPartner && (
                <div className="space-y-4 pl-4 border-l-2 border-cyan-500/30">
                    <FormInput
                        id="partnerName"
                        label="Partner's Name"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        placeholder="Enter partner's full name"
                        required
                    />
                    
                    <FormInput
                        id="partnerScholarId"
                        label="Partner's Scholar ID"
                        value={partnerScholarId}
                        onChange={(e) => setPartnerScholarId(e.target.value)}
                        placeholder="Enter partner's scholar ID"
                        required
                    />
                    
                    <FormInput
                        id="partnerContact"
                        label="Partner's Contact Number"
                        type="tel"
                        value={partnerContact}
                        onChange={(e) => setPartnerContact(e.target.value)}
                        placeholder="Enter partner's contact number"
                        required
                    />
                </div>
            )}
            
            <SubmitButton text="Register for Rampwalk" loading={loading} />
        </form>
    );
};

const RizzShowForm = ({ onRegistrationSuccess, isAlreadyRegistered, showToast }) => {
    const { user, profile: authProfile } = useAuth();
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [scholarId, setScholarId] = useState('');
    const [loading, setLoading] = useState(false);

    // Prefill user data if available
    useEffect(() => {
        if (authProfile?.full_name) setName(authProfile.full_name);
        if (authProfile?.scholar_id) setScholarId(authProfile.scholar_id);
    }, [authProfile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isAlreadyRegistered) return;
        
        setLoading(true);
        
        try {
            const formData = {
                name,
                email: user?.email || '',
                contact_number: contactNumber,
                scholar_id: scholarId
            };

            const { data, error } = await supabase
                .from('event_registrations')
                .insert([
                    {
                        user_id: user.id,
                        event_slug: 'rizz-show',
                        event_name: 'Rizz Show',
                        form_data: formData,
                        registered_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;

            onRegistrationSuccess();
            showToast('Successfully registered for Rizz Show!', 'success');
            
        } catch (error) {
            console.error('Error submitting registration:', error);
            showToast('Error submitting registration. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (isAlreadyRegistered) {
        return (
            <div className="text-center py-6">
                <div className="text-green-400 text-5xl mb-4">✓</div>
                <h2 className="text-xl font-semibold mb-3 text-white">Already Registered!</h2>
                <p className="text-gray-300 mb-4 text-sm">
                    You have successfully registered for Rizz Show.
                </p>
                <p className="text-cyan-400 text-sm">
                    You can now join the WhatsApp group using the button below.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-2 text-white">Register for Rizz Show</h2>
            
            <FormInput
                id="name"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
            />
            
            <FormInput
                id="email"
                label="Email"
                value={user?.email || ''}
                disabled
            />
            
            <FormInput
                id="contactNumber"
                label="Contact Number"
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter your contact number"
                required
            />
            
            <FormInput
                id="scholarId"
                label="Scholar ID"
                value={scholarId}
                onChange={(e) => setScholarId(e.target.value)}
                placeholder="Enter your scholar ID"
                required
            />
            
            <SubmitButton text="Register for Rizz Show" loading={loading} />
        </form>
    );
};

const CulturalForm = ({ onRegistrationSuccess, isAlreadyRegistered, showToast }) => {
    const { user, profile: authProfile } = useAuth();
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [scholarId, setScholarId] = useState('');
    const [performanceType, setPerformanceType] = useState('solo');
    const [otherPerformanceType, setOtherPerformanceType] = useState('');
    const [groupMembers, setGroupMembers] = useState('');
    const [loading, setLoading] = useState(false);

    // Prefill user data if available
    useEffect(() => {
        if (authProfile?.full_name) setName(authProfile.full_name);
        if (authProfile?.scholar_id) setScholarId(authProfile.scholar_id);
    }, [authProfile]);

    // Reset other performance type when performance type changes
    useEffect(() => {
        if (performanceType !== 'other') {
            setOtherPerformanceType('');
        }
    }, [performanceType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isAlreadyRegistered) return;
        
        // Validate other performance type if selected
        if (performanceType === 'other' && !otherPerformanceType.trim()) {
            showToast('Please specify your performance type', 'error');
            return;
        }
        
        setLoading(true);
        
        try {
            const formData = {
                name,
                email: user?.email || '',
                contact_number: contactNumber,
                scholar_id: scholarId,
                performance_type: performanceType === 'other' ? otherPerformanceType : performanceType,
                original_performance_type: performanceType, // Keep the original selection
                ...(performanceType === 'other' && {
                    other_performance_type: otherPerformanceType
                }),
                ...(performanceType === 'group' && {
                    group_members: groupMembers
                })
            };

            const { data, error } = await supabase
                .from('event_registrations')
                .insert([
                    {
                        user_id: user.id,
                        event_slug: 'cultural',
                        event_name: 'Cultural Event',
                        form_data: formData,
                        registered_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;

            onRegistrationSuccess();
            showToast('Successfully registered for Cultural Event!', 'success');
            
        } catch (error) {
            console.error('Error submitting registration:', error);
            showToast('Error submitting registration. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (isAlreadyRegistered) {
        return (
            <div className="text-center py-6">
                <div className="text-green-400 text-5xl mb-4">✓</div>
                <h2 className="text-xl font-semibold mb-3 text-white">Already Registered!</h2>
                <p className="text-gray-300 mb-4 text-sm">
                    You have successfully registered for Cultural Event.
                </p>
                <p className="text-cyan-400 text-sm">
                    You can now join the WhatsApp group using the button below.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-2 text-white">Register for Cultural Event</h2>
            
            <FormInput
                id="name"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
            />
            
            <FormInput
                id="email"
                label="Email"
                value={user?.email || ''}
                disabled
            />
            
            <FormInput
                id="contactNumber"
                label="Contact Number"
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter your contact number"
                required
            />
            
            <FormInput
                id="scholarId"
                label="Scholar ID"
                value={scholarId}
                onChange={(e) => setScholarId(e.target.value)}
                placeholder="Enter your scholar ID"
                required
            />

            <div className="mb-4">
                <label htmlFor="performanceType" className="block text-sm font-medium text-gray-300 mb-2">
                    Performance Type <span className="text-red-400">*</span>
                </label>
                <select
                    id="performanceType"
                    value={performanceType}
                    onChange={(e) => setPerformanceType(e.target.value)}
                    required
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-base"
                >
                    <option value="solo">Solo Performance</option>
                    <option value="group">Group Performance</option>
                    <option value="dance">Dance</option>
                    <option value="song">Song</option>
                    <option value="other">Other (Please specify)</option>
                </select>
            </div>

            {/* Other Performance Type Input - Only show when "Other" is selected */}
            {performanceType === 'other' && (
                <FormInput
                    id="otherPerformanceType"
                    label="Specify Your Performance Type"
                    value={otherPerformanceType}
                    onChange={(e) => setOtherPerformanceType(e.target.value)}
                    placeholder="e.g., Drama, Poetry, Instrumental, etc."
                    required
                />
            )}

            {performanceType === 'group' && (
                <FormTextarea
                    id="groupMembers"
                    label="Group Members Names (comma separated)"
                    value={groupMembers}
                    onChange={(e) => setGroupMembers(e.target.value)}
                    placeholder="Enter names of all group members separated by commas"
                    required
                />
            )}
            
            <SubmitButton text="Register for Cultural Event" loading={loading} />
        </form>
    );
};

// Main EventsRegistration Component
const EventsRegistration = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('rampwalk');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showWhatsappModal, setShowWhatsappModal] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState({
        rampwalk: false,
        'rizz-show': false,
        cultural: false
    });
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [toast, setToast] = useState(null);

    // Hardcoded events data
    const events = {
        rampwalk: {
            name: 'Rampwalk',
            slug: 'rampwalk',
            whatsapp_group_link: 'https://chat.whatsapp.com/F3YCuEjZb0oHnJirIPc3S3?mode=wwt'
        },
        rizzShow: {
            name: 'Rizz Show',
            slug: 'rizz-show', 
            whatsapp_group_link: 'https://chat.whatsapp.com/BUTPCVs5pg5IKDr35bz7Ll?mode=wwt'
        },
        cultural: {
            name: 'Cultural Event',
            slug: 'cultural',
            whatsapp_group_link: 'https://chat.whatsapp.com/HYjp4oJt66FKEjcbs0j6sV?mode=wwt'
        }
    };

    const tabs = [
        { id: 'rampwalk', name: 'Rampwalk' },
        { id: 'rizzShow', name: 'Rizz Show' },
        { id: 'cultural', name: 'Cultural' },
    ];

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }
        checkAdminStatus();
        checkRegistrationStatus();
    }, [user, navigate]);

    const checkAdminStatus = async () => {
        if (!user) return;
        
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                return;
            }

            const adminStatus = 
                profile?.role === 'admin' || 
                profile?.is_admin === true ||
                profile?.admin === true ||
                (profile?.email && profile.email.includes('admin')) ||
                (user?.email && user.email.includes('admin'));

            setIsAdmin(adminStatus);
        } catch (error) {
            console.error('Error checking admin status:', error);
        }
    };

    const checkRegistrationStatus = async () => {
        if (!user) return;
        
        try {
            const { data: registrations, error } = await supabase
                .from('event_registrations')
                .select('event_slug')
                .eq('user_id', user.id);

            if (error) throw error;

            const status = {
                rampwalk: false,
                'rizz-show': false,
                cultural: false
            };

            if (registrations) {
                registrations.forEach(reg => {
                    status[reg.event_slug] = true;
                });
            }

            setRegistrationStatus(status);
        } catch (error) {
            console.error('Error checking registration status:', error);
            showToast('Error loading registration status', 'error');
        } finally {
            setLoadingStatus(false);
        }
    };

    const handleRegistrationSuccess = () => {
        setRegistrationStatus(prev => ({
            ...prev,
            [events[activeTab].slug]: true
        }));
    };

    const exportToCSV = async (eventSlug) => {
    if (!isAdmin) return;

    try {
        const { data: registrations, error } = await supabase
            .from('event_registrations')
            .select('*')
            .eq('event_slug', eventSlug);

        if (error) {
            throw error;
        }

        if (!registrations || registrations.length === 0) {
            showToast('No registrations found for this event.', 'error');
            return;
        }

        // Field mapping for human-readable column names
        const fieldMappings = {
            // Common fields
            name: 'Full Name',
            email: 'Email',
            contact_number: 'Contact Number',
            scholar_id: 'Scholar ID',
            
            // Rampwalk specific
            has_partner: 'Has Partner',
            partner_name: 'Partner Name',
            partner_scholar_id: 'Partner Scholar ID',
            partner_contact: 'Partner Contact Number',
            
            // Cultural specific
            performance_type: 'Performance Type',
            original_performance_type: 'Original Selection',
            other_performance_type: 'Other Performance Type',
            group_members: 'Group Members'
        };

        // Get all unique keys and map to human-readable names
        const allKeys = new Set();
        registrations.forEach(reg => {
            Object.keys(reg.form_data).forEach(key => {
                allKeys.add(key);
            });
        });

        const baseHeaders = ['User ID', 'Event Name', 'Registered At'];
        const formHeaders = Array.from(allKeys).sort();
        const headers = [
            ...baseHeaders,
            ...formHeaders.map(key => fieldMappings[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
        ];

        const csvContent = [
            headers.join(','),
            ...registrations.map(reg => {
                const rowData = [
                    reg.user_id,
                    `"${reg.event_name}"`,
                    `"${new Date(reg.registered_at).toLocaleString()}"`
                ];

                // Add all form data in the same order as headers
                formHeaders.forEach(key => {
                    let value = reg.form_data[key];
                    
                    // Handle different data types
                    if (value === null || value === undefined) {
                        value = '';
                    } else if (typeof value === 'boolean') {
                        value = value ? 'Yes' : 'No';
                    } else if (typeof value === 'object') {
                        value = JSON.stringify(value);
                    }
                    
                    // Escape quotes and wrap in quotes
                    const escapedValue = String(value).replace(/"/g, '""');
                    rowData.push(`"${escapedValue}"`);
                });

                return rowData.join(',');
            })
        ].join('\n');

        // Download CSV with BOM for Excel compatibility
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${eventSlug}-registrations-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        showToast('CSV exported successfully with complete data!', 'success');

    } catch (error) {
        console.error('Error exporting CSV:', error);
        showToast('Error exporting data. Please try again.', 'error');
    }
};
    const openWhatsappLink = () => {
        const event = events[activeTab];
        if (event?.whatsapp_group_link) {
            window.open(event.whatsapp_group_link, '_blank');
            setShowWhatsappModal(false);
        }
    };

    const copyWhatsappLink = () => {
        const event = events[activeTab];
        if (event?.whatsapp_group_link) {
            navigator.clipboard.writeText(event.whatsapp_group_link)
                .then(() => showToast('WhatsApp link copied to clipboard!', 'success'))
                .catch(() => showToast('Failed to copy link. Please manually copy it.', 'error'));
        }
    };

    if (!user || loadingStatus) {
        return (
            <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    const currentEventSlug = events[activeTab].slug;
    const isRegisteredForCurrentEvent = registrationStatus[currentEventSlug];

    return (
        <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white">
            {/* Toast Container */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}

            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400 text-center sm:text-left">
                        Event Registration for ESPERANZA
                    </h1>
                    {isAdmin && (
                        <button 
                            onClick={() => exportToCSV(currentEventSlug)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors w-full sm:w-auto text-center"
                        >
                            Export {events[activeTab]?.name} CSV
                        </button>
                    )}
                </div>

                {/* Tab Navigation - Mobile Friendly */}
                <div className="flex overflow-x-auto mb-6 border-b border-gray-700 hide-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 py-3 px-4 font-medium text-sm sm:text-base transition-colors duration-300 whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'border-b-2 border-cyan-500 text-cyan-400'
                                    : 'text-gray-400 hover:text-white border-b-2 border-transparent'
                            }`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Form Container */}
                <div className="bg-gray-900 bg-opacity-50 p-4 sm:p-6 rounded-xl shadow-xl border border-cyan-500/30 mb-6">
                    {activeTab === 'rampwalk' && (
                        <RampwalkForm 
                            onRegistrationSuccess={handleRegistrationSuccess}
                            isAlreadyRegistered={isRegisteredForCurrentEvent}
                            showToast={showToast}
                        />
                    )}
                    {activeTab === 'rizzShow' && (
                        <RizzShowForm 
                            onRegistrationSuccess={handleRegistrationSuccess}
                            isAlreadyRegistered={isRegisteredForCurrentEvent}
                            showToast={showToast}
                        />
                    )}
                    {activeTab === 'cultural' && (
                        <CulturalForm 
                            onRegistrationSuccess={handleRegistrationSuccess}
                            isAlreadyRegistered={isRegisteredForCurrentEvent}
                            showToast={showToast}
                        />
                    )}
                </div>

                {/* WhatsApp Join Button - Only show if registered */}
                {isRegisteredForCurrentEvent && (
                    <div className="text-center">
                        <button
                            onClick={() => setShowWhatsappModal(true)}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 mx-auto w-full sm:w-auto active:scale-95 touch-manipulation"
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.17-3.495-8.418"/>
                            </svg>
                            Join {events[activeTab]?.name} WhatsApp
                        </button>
                    </div>
                )}

                {/* WhatsApp Modal - Mobile Optimized */}
                {showWhatsappModal && (
                    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-4 sm:p-6">
                        <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl p-6 w-full max-w-md max-h-[80vh] sm:max-h-[90vh] overflow-y-auto backdrop-blur-lg">
                            <h3 className="text-xl font-bold text-cyan-400 mb-4">Join WhatsApp Group</h3>
                            <p className="text-gray-300 mb-2">
                                Join the WhatsApp group for:
                            </p>
                            <p className="text-white font-bold mb-4 text-lg">{events[activeTab]?.name}</p>
                            
                            <p className="text-gray-300 mb-6 text-sm">
                                Click below to join the WhatsApp group for updates and discussions:
                            </p>
                            
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={openWhatsappLink}
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.17-3.495-8.418"/>
                                    </svg>
                                    Join WhatsApp Group
                                </button>
                                
                                <button
                                    onClick={copyWhatsappLink}
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy Link
                                </button>
                                
                                <button
                                    onClick={() => setShowWhatsappModal(false)}
                                    className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all active:scale-95"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom CSS for mobile optimizations */}
            <style jsx>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                @media (max-width: 640px) {
                    input, select, textarea {
                        font-size: 16px; /* Prevents zoom on iOS */
                    }
                }
            `}</style>
        </div>
    );
};

export default EventsRegistration;