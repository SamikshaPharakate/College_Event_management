// src/components/Footer.jsx
import React from 'react';

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>UniEvents</h3>
            <p>Your comprehensive platform for managing all college events, activities, and gatherings in one place.</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          {/* ...other columns as before */}
        </div>
        <div className="copyright">
          <p>&copy; 2025 UniEvents. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
