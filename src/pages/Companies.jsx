import { useState } from "react";
import logo1 from "../assets/images/gandalf-mc-logo.png";
import logo2 from "../assets/images/halsingecykel-logo.png";
import logo3 from "../assets/images/cirkel-hj_logo-2.png";
// import logo4 from "../assets/images/cirkel-hj_logo-2.png";
import lineart2 from "../assets/images/line_art-05.png";
import lineart3 from "../assets/images/line_art-13.png";
import lineart4 from "../assets/images/line_art-02-09.png";

function Companies() {
  const [formData, setFormData] = useState({
    företagsnamn: "",
    kontaktperson: "",
    telefon: "",
    mail: "",
    beskrivning: "",
    text: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const allowedTypes = ["image/webp", "image/jpeg", "image/jpg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB per fil

    const validFiles = selectedFiles.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        setMessage("Endast webp, jpeg, jpg, png och gif kan laddas upp");
        return false;
      }
      if (file.size > maxSize) {
        setMessage(`${file.name} är för stor (max 5MB)`);
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mail) {
      setMessage("E-post är obligatorisk");
      return;
    }

    setLoading(true);
    setMessage("");

    const submitData = new FormData();
    submitData.append("företagsnamn", formData.foretag);
    submitData.append("kontaktperson", formData.namn);
    submitData.append("telefon", formData.telefon);
    submitData.append("mail", formData.mail);
    submitData.append("beskrivning", formData.beskrivning);
    submitData.append("text", formData.text);

    files.forEach((file, index) => {
      submitData.append(`file_${index}`, file);
    });

    try {
      const response = await fetch(
        "https://emiliaskapar.se/api/companies.php",
        {
          method: "POST",
          body: submitData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✓ Din beställning har skickats!");
        setFormData({
          foretag: "",
          namn: "",
          telefon: "",
          mail: "",
          beskrivning: "",
          text: "",
        });
        setFiles([]);
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
        <section className="section-companies">
          <div className="companies-logos-div">
            <h3>några av våra kunder</h3>
            <div className="company-logos">
              <div className="wrap-company-logo"><img src={logo1}/></div>
              <div className="wrap-company-logo"><img src={logo2}/></div>
              <div className="wrap-company-logo"><img src={logo3}/></div>
              {/* <div className="wrap-company-logo"><img src={logo4}/></div> */}
            </div>
             {/* <div className="lineart-div left-minus">
              <img src={lineart1}/>
            </div> */}
          </div>

          <div className="company-div">
                         <div className="lineart-div left"
             style={{marginLeft:"-5%"}}>
              <img src={lineart2}/>
            </div>
            <h3 className="company-h3" style={{ marginTop: "5%" }}>
              företagsbeställning
            </h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="foretag">
                  Företag <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="foretag"
                  name="foretag"
                  value={formData.foretag}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="kontaktperson">
                  Kontaktperson <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="kontaktperson"
                  name="kontaktperson"
                  value={formData.kontaktperson}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="mail">
                  E-post <span style={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  id="mail"
                  name="mail"
                  value={formData.mail}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="telefon">Telefon</label>
                <input
                  type="tel"
                  id="telefon"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="text1">Önskad text</label>
                <input
                  type="text"
                  id="text"
                  name="text"
                  value={formData.text1}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="file">
                  Ladda upp logotyp (webp, jpeg, jpg, png, gif) - fler bilder är OK
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  accept=".webp,.jpg,.jpeg,.png,.gif"
                  multiple
                  style={styles.fileInput}
                />
              </div>

              {/* FÖRHANDSGRANSKNING BILDER */}
              {files.length > 0 && (
                <div style={styles.previewContainer}>
                  <h4>Förhandsgranskning ({files.length})</h4>

                  <div style={styles.galleryGrid}>
                    {files.map((file, index) => (
                      <div key={index} style={styles.galleryItem}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Förhandsgranskning ${index + 1}`}
                          style={styles.previewImage}
                        />
                        <p style={styles.fileName}>{file.name}</p>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          style={styles.removeButton}
                          className="remove-button"
                        >
                          Ta bort
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {message && (
                <p
                  style={{
                    ...styles.message,
                    color: message.includes("✓") ? "#699147" : "#e77474",
                  }}
                >
                  {message}
                </p>
              )}
              <div style={styles.formGroup}>
                <label htmlFor="beskrivning">Beskrivning</label>
                <textarea
                  id="beskrivning"
                  name="beskrivning"
                  value={formData.beskrivning}
                  onChange={handleInputChange}
                  placeholder="Beskriv era önskemål..."
                  style={styles.textarea}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={styles.button}
                className="submit-button"
              >
                {loading ? "Skickar..." : "Skicka beställning"}
              </button>
            </form>

          </div>
                    <section className="company-support-section">
            <h3 className="company-h3">för hjälp, kontakta oss</h3>
            <p>Kontakta oss vid behov så hjälper vi dig gärna:</p>
            <p>Telefon<br/>
072-505 00 66
</p>
<p>
E-post<br/>
emiliajonsson@live.com</p>
             <div className="lineart-div left-minus" style={{ marginTop: "-12%" }}>
              <img src={lineart4}/>
            </div>
          </section>
                    <div className="companies-contact">
                                              <div className="lineart-div right" style={{ marginBottom: "-12%" }}>
              <img src={lineart3}/>
            </div>
            <h3 className="company-request-h3">
             bli företagskund
            </h3>
            <h4 style={{ marginBottom: "2%" }}>
              Önskar du bli företagskund hos oss? Fyll i formuläret eller kontakta oss på 
              nedan kontaktuppgifter. Vi besvarar er förfrågan så fort vi har möjlighet!
              </h4>
            <p className="company-p-heading">Telefon:</p>
            <p className="company-p">072-505 00 66</p>
            <br />
            <p className="company-p-heading">E-post:</p>
            <p className="company-p">hej@emiliaskapar.se</p>
             <div className="request-form-wrapper">
            <form onSubmit={console.log("message submitted")}>
              <label>Företag:</label>
              <input type="text" placeholder="Företagsnamn"/>
              <label>Kontaktperson förnamn:</label>
              <input type="text" placeholder="Förnamn"/>
              <label>Kontaktperson efternamn:</label>
              <input type="text" placeholder="Efternamn"/>
              <label>E-mail:</label>
              <input type="email" placeholder="Ange mail vi ska svara till"/>
              <label>Telefon:</label>
              <input type="tel" placeholder="Telefonnummer vi når er på"/>
              <label>Meddelande:</label>
              <textarea className="request-form-message" placeholder="Skriv ditt meddelande"/>
            <button type="button" className="request-submit-button" onClick={console.log("send button clicked")}>
              Skicka</button>
            </form>

            </div>
          </div>
        </section>
      </main>
    </>
  );
}

const styles = {
  form: {
    width: "50vw",
    margin: "1rem auto 3rem",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    textAlign: "left",
  },
  input: {
    padding: "0.75rem",
    border: "1px solid #e5ddd5",
    borderRadius: "4px",
    fontFamily: '"Mona Sans", sans-serif',
    fontSize: "1rem",
  },
  textarea: {
    padding: "0.75rem",
    border: "1px solid #e5ddd5",
    borderRadius: "4px",
    fontFamily: '"Mona Sans", sans-serif',
    fontSize: "1rem",
    minHeight: "120px",
    resize: "vertical",
  },
  fileInput: {
    padding: "0.75rem",
  },
  previewContainer: {
    borderRadius: "8px",
    padding: "1.5rem",
    backgroundColor: "#efefef90",
  },
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1rem",
    marginTop: "1rem",
  },
  galleryItem: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  previewImage: {
    maxWidth: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "4px",
  },
  fileName: {
    fontSize: "0.85rem",
    color: "#5e380f",
    margin: "0",
    wordBreak: "break-word",
  },
  removeButton: {
    padding: "0.4rem 1rem",
    backgroundColor: "#5e380f",
    color: "#fff",
    border: "none",
    borderRadius: "400px",
    fontFamily: '"Mona Sans", sans-serif',
    fontSize: "0.8rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  button: {
    padding: "1rem",
    backgroundColor: "#f79b65",
    color: "white",
    border: "none",
    borderRadius: "400px",
    fontFamily: '"Mona Sans", sans-serif',
    fontSize: "1.1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  message: {
    padding: "1rem",
    borderRadius: "4px",
    textAlign: "center",
  },
  required: {
    color: "#f79b65",
    fontSize: "2rem",
  },
};

export default Companies;
