// src/pages/Home.jsx
import React from 'react';

function Home() {
  const handleCreateEvent = () => {
    alert('Redirecting to event creation form...');
  };

  return (
    <section className="hero">
      <div className="container">
        <h2>Manage Your College Events</h2>
        <p>Discover, create, and manage all campus events in one place. From academic seminars to social gatherings, never miss out on what's happening at your college.</p>
        <button className="btn btn-primary" onClick={handleCreateEvent}>Create New Event</button>
      </div>
    </section>
  );
}

export default Home;
