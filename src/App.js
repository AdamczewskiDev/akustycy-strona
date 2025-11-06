import React, { useState } from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [result, setResult] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState({});

  const validateForm = (formData) => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Imię jest wymagane";
    }

    if (!formData.email.trim()) {
      errors.email = "Email jest wymagany";
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "Nieprawidłowy format email";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Temat jest wymagany";
    }

    if (!formData.message.trim()) {
      errors.message = "Wiadomość jest wymagana";
    }

    return errors;
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    // Walidacja
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setResult("Proszę poprawić błędy w formularzu");
      return;
    }

    setErrors({});
    setResult("Wysyłanie...");

    const formDataObj = new FormData(event.target);
    formDataObj.append("access_key", process.env.REACT_APP_ACCESS_KEY);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Formularz wysłany pomyślnie!");
        event.target.reset();
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        console.log("Error", data);
        setResult(`Błąd: ${data.message}`);
      }
    } catch (error) {
      console.error("Błąd wysyłania:", error);
      setResult("Wystąpił błąd podczas wysyłania formularza");
    }
  };

  return (
    <div className="App">
      <ReactFullpage
        licenseKey={"gplv3-license"}
        scrollingSpeed={1000}
        // responsiveWidth={768}
        render={({ state, fullpageApi }) => {
          return (
            <ReactFullpage.Wrapper>
              {/* Sekcja 1: Przywitanie */}
              <div className="section section-1">
                <div className="container">
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
                        <strong>SoundTech Pro</strong> to zespół doświadczonych
                        akustyków specjalizujących się w kompleksowej obsłudze
                        technicznej wydarzeń kulturalnych, biznesowych i
                        prywatnych.
                      </p>
                      <p>
                        Dysponujemy nowoczesnym sprzętem renomowanych marek oraz
                        wieloletnim doświadczeniem w branży. Gwarantujemy
                        profesjonalną obsługę od planowania po realizację
                        wydarzenia.
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
                        <p>
                          ul. Dźwiękowa 15
                          <br />
                          00-123 Warszawa
                        </p>
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
                        <p>
                          Pon-Pt: 9:00-18:00
                          <br />
                          Sob: 10:00-14:00
                        </p>
                      </div>
                    </div>

                    <div className="contact-cta">
                      <h3>Masz pytania?</h3>
                      {/* <p>Skontaktuj się z nami już dziś!</p> */}

                      {/* Informacja o formularzu */}
                      <div className="form-info">
                        <div className="form-info-icon">📝</div>
                        <p className="form-info-text">
                          Przewiń w dół, aby wypełnić formularz kontaktowy
                        </p>
                        <div className="scroll-down-arrow">↓</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sekcja 4: Formularz */}
              <div className="section section-4">
                <div className="container">
                  <h2>Formularz kontaktowy</h2>
                  <div className="form-container">
                    <form onSubmit={onSubmit} className="contact-form">
                      {/* Honeypot */}
                      <input
                        type="checkbox"
                        name="botcheck"
                        className="hidden"
                        style={{ display: "none" }}
                      />

                      <div className="form-group">
                        <input
                          type="text"
                          name="name"
                          placeholder="Imię i nazwisko"
                          value={formData.name}
                          onChange={handleInputChange}
                          aria-label="Imię i nazwisko"
                          required
                        />
                        {errors.name && (
                          <span className="error-message">{errors.name}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          aria-label="Email"
                          required
                        />
                        {errors.email && (
                          <span className="error-message">{errors.email}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          name="subject"
                          placeholder="Temat"
                          value={formData.subject}
                          onChange={handleInputChange}
                          aria-label="Temat"
                          required
                        />
                        {errors.subject && (
                          <span className="error-message">
                            {errors.subject}
                          </span>
                        )}
                      </div>
                      <div className="form-group">
                        <textarea
                          name="message"
                          placeholder="Wiadomość"
                          rows="5"
                          value={formData.message}
                          onChange={handleInputChange}
                          aria-label="Wiadomość"
                          required
                        ></textarea>
                        {errors.message && (
                          <span className="error-message">
                            {errors.message}
                          </span>
                        )}
                      </div>
                      <button type="submit" className="submit-btn">
                        Wyślij wiadomość
                      </button>
                    </form>

                    {result && <div className="form-result">{result}</div>}
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
