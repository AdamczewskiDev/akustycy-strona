import React, { useState } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import './App.css';

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formularz wysłany:', formData);
    alert('Dziękujemy za wiadomość! Skontaktujemy się z Tobą wkrótce.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="App">
      <ReactFullpage
        licenseKey={'YOUR_KEY_HERE'} // Dla wersji darmowej użyj gpl-v3-license
        scrollingSpeed={1000}
        navigation={true}
        navigationPosition={'right'}
        showActiveTooltip={true}
        sectionsColor={['#ffffff', '#ffffff', '#ffffff']}
        render={({ state, fullpageApi }) => {
          return (
            <ReactFullpage.Wrapper>
              {/* Sekcja 1: Przywitanie i Logo */}
              <div className="section section-1">
                <div className="container">
                  <div className="logo-container">
                    <img 
                      src="/logo-animation.gif" 
                      alt="SoundTech Pro Logo" 
                      className="logo-gif"
                    />
                  </div>
                  <h1 className="welcome-title">Witamy w SoundTech Pro</h1>
                  <p className="welcome-subtitle">
                    Profesjonalne rozwiązania akustyczne dla każdego wydarzenia
                  </p>
                </div>
              </div>

              {/* Sekcja 2: O nas */}
              <div className="section section-2">
                <div className="container">
                  <h2>Czym się zajmujemy</h2>
                  <div className="about-content">
                    <div className="about-text">
                      <p>
                        <strong>SoundTech Pro</strong> to zespół doświadczonych akustyków 
                        specjalizujących się w kompleksowej obsłudze technicznej wydarzeń 
                        kulturalnych, biznesowych i prywatnych.
                      </p>
                      <ul className="services-list">
                        <li>🎵 Nagłośnienie koncertów i festiwali</li>
                        <li>🎤 Systemy konferencyjne i prezentacyjne</li>
                        <li>💡 Oświetlenie sceniczne LED i tradycyjne</li>
                        <li>🎭 Kompleksowa obsługa techniczna teatrów</li>
                        <li>🔧 Projektowanie i montaż instalacji audio</li>
                        <li>📡 Transmisje na żywo i nagrania</li>
                      </ul>
                      <p>
                        Dysponujemy nowoczesnym sprzętem renomowanych marek oraz 
                        wieloletnim doświadczeniem w branży. Gwarantujemy profesjonalną 
                        obsługę od planowania po realizację wydarzenia.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sekcja 3: Kontakt */}
              <div className="section section-3">
                <div className="container">
                  <h2>Skontaktuj się z nami</h2>
                  
                  <div className="contact-section">
                    <div className="contact-info">
                      <h3>Dane kontaktowe</h3>
                      <div className="contact-item">
                        <strong>📍 Adres:</strong>
                        <p>ul. Dźwiękowa 15<br />00-123 Warszawa</p>
                      </div>
                      <div className="contact-item">
                        <strong>📞 Telefon:</strong>
                        <p>+48 123 456 789</p>
                      </div>
                      <div className="contact-item">
                        <strong>✉️ Email:</strong>
                        <p>kontakt@soundtechpro.pl</p>
                      </div>
                      <div className="contact-item">
                        <strong>🕒 Godziny pracy:</strong>
                        <p>Pon-Pt: 9:00-18:00<br />Sob: 10:00-14:00</p>
                      </div>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                      <h3>Wyślij wiadomość</h3>
                      <div className="form-group">
                        <input
                          type="text"
                          name="name"
                          placeholder="Twoje imię i nazwisko"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="email"
                          name="email"
                          placeholder="Twój adres email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          name="subject"
                          placeholder="Temat wiadomości"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <textarea
                          name="message"
                          placeholder="Treść wiadomości"
                          rows="5"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </div>
                      <button type="submit" className="submit-btn">
                        Wyślij wiadomość
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </ReactFullpage.Wrapper>
          );
        }}
      />
    </div>
  );
};

export default App;
