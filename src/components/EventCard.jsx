import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const EventCard = ({ event, onRegister, isRegistered, isPast = false }) => {
  const [showWhatsapp, setShowWhatsapp] = useState(false);

  const handleRegistrationClick = async () => {
    if (isRegistered || isPast) return;
    const success = await onRegister(event.id);
    if (success) {
      setShowWhatsapp(true);
    }
  };

  const formattedDate = event.date.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className={`bg-gray-900/50 rounded-lg overflow-hidden border border-cyan-500/20 shadow-lg ${isPast ? 'opacity-60' : 'hover:shadow-cyan-400/20 transition-shadow duration-300'}`}>
      <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 text-white">{event.name}</h3>
        <p className="text-sm text-cyan-400 mb-3 font-mono">{formattedDate}</p>
        <p className="text-gray-400 mb-4">{event.description}</p>
        
        {showWhatsapp || (isRegistered && !isPast) ? (
            <a href={event.whatsappLink} target="_blank" rel="noopener noreferrer" className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300">
              <FaWhatsapp /> Join WhatsApp
            </a>
        ) : (
            <button 
              className={`mt-4 w-full py-2 px-4 rounded-lg font-bold transition-colors duration-300 ${
                isPast || isRegistered 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-cyan-600 hover:bg-cyan-700'
              }`}
              onClick={handleRegistrationClick}
              disabled={isPast || isRegistered}
            >
              {isPast ? 'Event Over' : isRegistered ? 'Registered' : 'Register'}
            </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;