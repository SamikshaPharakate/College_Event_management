// src/components/Sidebar.jsx
import React from 'react';

function Sidebar({ onApplyFilters }) {
  return (
    <aside className="sidebar">
      <h3>Filter Events</h3>
      <div className="filter-group">
        <h4>Event Type</h4>
        <div className="filter-options">
          <label><input type="checkbox" defaultChecked /> All Events</label>
          <label><input type="checkbox" /> Academic</label>
          <label><input type="checkbox" /> Cultural</label>
          <label><input type="checkbox" /> Sports</label>
          <label><input type="checkbox" /> Workshops</label>
          <label><input type="checkbox" /> Social</label>
        </div>
      </div>
      <div className="filter-group">
        <h4>Date Range</h4>
        <div className="filter-options">
          <label><input type="radio" name="date" defaultChecked /> Upcoming</label>
          <label><input type="radio" name="date" /> This Week</label>
          <label><input type="radio" name="date" /> This Month</label>
          <label><input type="radio" name="date" /> Past Events</label>
        </div>
      </div>
      <div className="filter-group">
        <h4>Department</h4>
        <div className="filter-options">
          <label><input type="checkbox" defaultChecked /> All Departments</label>
          <label><input type="checkbox" /> Computer Science</label>
          <label><input type="checkbox" /> Engineering</label>
          <label><input type="checkbox" /> Business</label>
          <label><input type="checkbox" /> Arts & Sciences</label>
        </div>
      </div>
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={onApplyFilters}>Apply Filters</button>
    </aside>
  );
}

export default Sidebar;
