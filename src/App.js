import React from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import './App.css';

function Contact() {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Wysyłanie...");
    const formData = new FormData(event.target);

    // WAŻNE: Zamień na swój prawdziwy klucz z web3forms.com
    formData.append("access_key", "f987af94-36e3-42a5-858a-2cf1696ff7de");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Formularz wysłany pomyślnie!");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(`Błąd: ${data.message}`);
    }
  };

  return (
    <div className="contact-form">
      <h3>Napisz do nas</h3>
      <form onSubmit={onSubmit}>
        {/* Honeypot - ochrona przed botami */}
        <input 
          type="checkbox" 
          name="botcheck" 
          className="hidden" 
          style={{display: 'none'}}
        />
        
        <div className="form-group">
          <input 
            type="text" 
            name="name" 
            placeholder="Imię i nazwisko"
            required
          />
        </div>
        <div className="form-group">
          <input 
            type="email" 
            name="email" 
            placeholder="Email"
            required
          />
        </div>
        <div className="form-group">
          <input 
            type="text" 
            name="subject" 
            placeholder="Temat"
            required
          />
        </div>
        <div className="form-group">
          <textarea 
            name="message" 
            placeholder="Wiadomość"
            rows="5"
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">
          Wyślij wiadomość
        </button>
      </form>
      <div className="form-result">{result}</div>
    </div>
  );
}

// Reszta kodu App.js pozostaje bez zmian...
function App() {
  return (
    <div className="App">
      <ReactFullpage
        licenseKey={'gplv3-license'}
        scrollingSpeed={1000}
        render={({ state, fullpageApi }) => {
          return (
            <ReactFullpage.Wrapper>
              {/* Sekcja 1: Przywitanie */}
              <div className="section section-1">
                <div className="container">
                  <div className="logo-container">
                    <div className="logo-placeholder">🎵</div>
                  </div>
                  <h1 className="welcome-title">SoundTech Pro</h1>
                  <p className="welcome-subtitle">
                    Profesjonalne rozwiązania akustyczne dla każdego wydarzenia
                  </p>
                  <div className="scroll-indicator">
                    <span>Przewiń w dół</span>
                    <div className="arrow-down">↓</div>
                  </div>
                </div>
              </div>

              {/* Sekcja 2: O nas */}
              <div className="section section-2">
                <div className="container">
                  <h2>O nas</h2>
                  <div className="about-content">
                    <div className="about-text">
                      <p>
                        <strong>SoundTech Pro</strong> to zespół doświadczonych akustyków
                        specjalizujących się w kompleksowej obsłudze technicznej wydarzeń
                        kulturalnych, biznesowych i prywatnych.
                      </p>
                      <p>
                        Dysponujemy nowoczesnym sprzętem renomowanych marek oraz wieloletnim 
                        doświadczeniem w branży. Gwarantujemy profesjonalną obsługę od 
                        planowania po realizację wydarzenia.
                      </p>
                      <div className="services">
                        <h3>Nasze usługi:</h3>
                        <ul>
                          <li>Nagłośnienie koncertów i festiwali</li>
                          <li>Obsługa techniczna konferencji</li>
                          <li>Systemy audio dla teatrów</li>
                          <li>Nagłośnienie wesel i imprez prywatnych</li>
                          <li>Wynajem sprzętu audio</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sekcja 3: Kontakt */}
              <div className="section section-3">
                <div className="container">
                  <h2>Kontakt</h2>
                  <div className="contact-section">
                    <div className="contact-info">
                      <h3>Skontaktuj się z nami</h3>
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

                    <Contact />
                  </div>
                </div>
              </div>
            </ReactFullpage.Wrapper>
          );
        }}
      />
    </div>
  );
}

export default App;
