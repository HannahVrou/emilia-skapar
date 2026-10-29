import { useState } from "react";
import lineart1 from "../assets/images/line_art-29.png";

function Contact() {
  // State för formulärdata
  const [formData, setFormData] = useState({
    namn: "",
    mail: "",
    telefon: "",
    meddelande: "",
  });

  // State för loading och statusmeddelanden
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Uppdaterar formulärvärdena när användaren skriver
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hanterar inskickning av formuläret
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validering - mail är obligatorisk
    if (!formData.mail) {
      setMessage("E-post är obligatorisk");
      return;
    }

    setLoading(true);
    setMessage("");

    // Förbereder data för skickning
    const submitData = new FormData();
    submitData.append("namn", formData.namn);
    submitData.append("mail", formData.mail);
    submitData.append("telefon", formData.telefon);
    submitData.append("meddelande", formData.meddelande);

    try {
      // Skickar till din backend
      const response = await fetch("https://emiliaskapar.se/api/contact.php", {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        // Framgång - visar meddelande och rensar formulär
        setMessage("✓ Ditt meddelande har skickats!");
        setFormData({
          namn: "",
          mail: "",
          telefon: "",
          meddelande: "",
        });
      } else {
        setMessage("Error: " + (data.error || "Något gick fel"));
      }
    } catch (error) {
      setMessage("Anslutningsfel. Försök igen senare.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <main>
        <section className="section-about">
          {/* <div className="hero-about"></div> */}
            <div className="lineart-div left">
              <img src={lineart1} />
            </div>
          <div className="sidebyside-contact">
            <div className="section-contact">
              <div className="contact-div">
                <h3>direktmeddelande</h3>
                <p>
                  Skicka ett meddelande direkt till oss. Hör gärna av er med era frågor och funderingar, så svarar vi så fort vi kan.
                </p>
                <div className="direct-form-wrapper">
                  <form onSubmit={handleSubmit}>
                    <label>Namn:</label>
                    <input
                      type="text"
                      name="namn"
                      placeholder="Ange ditt namn"
                      value={formData.namn}
                      onChange={handleInputChange}
                    />
                    <label>E-mail:</label>
                    <input
                      type="email"
                      name="mail"
                      placeholder="Ange den mail vi svarar till"
                      value={formData.mail}
                      onChange={handleInputChange}
                      required
                    />
                    <label>Telefon:</label>
                    <input
                      type="tel"
                      name="telefon"
                      placeholder="Ange telefonnummer"
                      value={formData.telefon}
                      onChange={handleInputChange}
                    />
                    <label>Meddelande:</label>
                    <textarea
                      className="direct-form-message"
                      name="meddelande"
                      placeholder="Skriv ditt meddelande"
                      value={formData.meddelande}
                      onChange={handleInputChange}
                    />
                    {message && (
                      <p
                        style={{
                          color: message.includes("✓") ? "#89af55" : "#e7455b",
                          marginTop: "0.5rem",
                          fontSize: "0.95rem",
                          fontWeight: "500",
                        }}
                      >
                        {message}
                      </p>
                    )}
                    <button
                      type="submit"
                      className="direct-submit-button"
                      disabled={loading}
                    >
                      {loading ? "Skickar..." : "Skicka"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="section-contact">
              <div className="contact-div">
                <h3>kontaktuppgifter</h3>
<p></p>

                <b>Emilia Skapar</b>
                <h5>
                  Bänbro 207<br />
                  824 72 Delsbo 
                </h5>

                <h4>Telefon:</h4>
                <h5>072-505 00 66</h5>

                <h4>E-post:</h4>
                <h5>emiliajonsson@live.com</h5>
              </div>
              <div className="map-div">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1886.5293826875632!2d16.57841871353685!3d61.78146027579284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46669daa4ddaa4ab%3A0xbc2f7c9c259039f5!2sB%C3%A4nbro%20207%2C%20824%2072%20Delsbo!5e0!3m2!1ssv!2sse!4v1786471565630!5m2!1ssv!2sse"
                  style={{ border: 0 }}
                  allowFullScreen={""}
                  loading={"lazy"}
                  referrerPolicy={"strict-origin-when-cross-origin"}
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Contact;
