// src/components/EventCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function EventCard({ event, onRegister, initialRegistered = false }) {
  const [registered, setRegistered] = useState(initialRegistered);

  const handleRegisterClick = async () => {
    if (registered) return;
    try {
      await onRegister(event);
      setRegistered(true);
    } catch (e) {
      alert(e?.message || 'Failed to register for event');
    }
  };

  return (
    <div className="event-card">
      <div className="event-image" style={{ backgroundImage: `url('${event.image}')` }}></div>
      <div className="event-content">
        <span className="event-date">{event.date}</span>
        <h3 className="event-title">{event.title}</h3>
        <div className="event-details">
          <i className="fas fa-map-marker-alt"></i>
          <span>{event.location}</span>
        </div>
        <div className="event-details">
          <i className="fas fa-clock"></i>
          <span>{event.time}</span>
        </div>
        <p className="event-description">{event.description}</p>
        <div className="event-actions">
          <button className={registered ? 'btn btn-success btn-small' : 'btn btn-primary btn-small'} onClick={handleRegisterClick}>
            {registered ? 'Registered' : 'Register'}
          </button>
          <Link to={`/events/${event.id}`} className="btn btn-outline btn-small">Details</Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
