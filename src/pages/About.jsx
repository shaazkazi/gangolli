import React from 'react';
import Header from '../components/Header';

const About = () => {
  const stats = [
    { number: '10K+', label: 'Daily Readers' },
    { number: '5000+', label: 'Published Stories' },
    { number: '50+', label: 'Local Contributors' },
    { number: '15+', label: 'Years of Trust' },
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'Editor in Chief',
      image: '/team/editor.jpg'
    },
    {
      name: 'Priya Sharma',
      role: 'Senior Reporter',
      image: '/team/reporter.jpg'
    },
    {
      name: 'Mohammed Ali',
      role: 'Photojournalist',
      image: '/team/photographer.jpg'
    }
  ];

  return (
    <div className="about-page">
      <Header />
      <div className="about-hero">
        <div className="hero-content">
          <h1>GangolliNews</h1>
          <p className="tagline">Your Trusted Source for Local News</p>
        </div>
      </div>

      <div className="about-container">
        <section className="mission-section">
          <div className="section-content">
            <h2>Our Mission</h2>
            <p>Delivering accurate, timely, and relevant news to empower our community with knowledge and understanding.</p>
          </div>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="story-section">
          <div className="section-content">
            <h2>Our Story</h2>
            <div className="story-grid">
              <div className="story-text">
                <p>Founded in 2008, GangolliNews has been the cornerstone of local journalism in the Gangolli region. We've evolved from a small news outlet to a comprehensive digital platform, while maintaining our commitment to grassroots reporting.</p>
                <p>Our dedicated team works tirelessly to bring you stories that matter, from breaking news to in-depth features about our community's culture and heritage.</p>
              </div>
              <div className="story-image">
                <div className="image-overlay"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Our Team</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-image" style={{ backgroundImage: `url(${member.image})` }}>
                  <div className="member-overlay"></div>
                </div>
                <h3>{member.name}</h3>
                <span>{member.role}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-section">
          <h2>Connect With Us</h2>
          <div className="contact-grid">
            <div className="contact-info">
              <div className="info-item">
                <h3>Visit Us</h3>
                <br />Gangolli, Karnataka<br />India 576216
              </div>
              <div className="info-item">
                <h3>Contact</h3>
                <p>Phone: +91 1234567890<br />Email: news@gangollinews.com</p>
              </div>
              <div className="info-item">
                <h3>Follow Us</h3>
                <div className="social-links">
                  <a href="#" className="social-link">Facebook</a>
                  <a href="#" className="social-link">Twitter</a>
                  <a href="#" className="social-link">Instagram</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
