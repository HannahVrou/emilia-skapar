import { useState } from "react";
import logo1 from "../assets/images/gandalf-mc-logo.png";
import logo2 from "../assets/images/halsingecykel-logo.png";
import logo3 from "../assets/images/cirkel-hj_logo-2.png";
// import logo4 from "../assets/images/cirkel-hj_logo-2.png";
import lineart1 from "../assets/images/line_art-15.png";
import lineart2 from "../assets/images/line_art-44.png";
import lineart3 from "../assets/images/line_art-13.png";
import lineart4 from "../assets/images/line_art-09.png";

const API_URL = "https://emiliaskapar.se/api/companies.php";

const emptyOrder = {
  foretag: "",
  kontaktperson: "",
  telefon: "",
  mail: "",
  beskrivning: "",
  text: "",
};

const emptyRequest = {
  foretag: "",
  fornamn: "",
  efternamn: "",
  mail: "",
  telefon: "",
  meddelande: "",
};

function Companies() {
  // Företagsbeställning
  const [formData, setFormData] = useState(emptyOrder);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  // Bli företagskund
  const [requestData, setRequestData] = useState(emptyRequest);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestMessageType, setRequestMessageType] = useState("error");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const allowedTypes = [
      "image/webp",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB per fil

    const validFiles = selectedFiles.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        setMessageType("error");
        setMessage("Endast webp, jpeg, jpg, png och gif kan laddas upp");
        return false;
      }
      if (file.size > maxSize) {
        setMessageType("error");
        setMessage(`${file.name} är för stor (max 5MB)`);
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);

    // Gör det möjligt att välja samma fil igen efter borttagning
    e.target.value = "";
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mail) {
      setMessageType("error");
      setMessage("E-post är obligatorisk");
      return;
    }

    setLoading(true);
    setMessage("");

    const submitData = new FormData();
    submitData.append("formtyp", "bestallning");
    submitData.append("foretag", formData.foretag);
    submitData.append("kontaktperson", formData.kontaktperson);
    submitData.append("telefon", formData.telefon);
    submitData.append("mail", formData.mail);
    submitData.append("beskrivning", formData.beskrivning);
    submitData.append("text", formData.text);

    files.forEach((file, index) => {
      submitData.append(`file_${index}`, file);
    });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessageType("success");
        setMessage("Din beställning har skickats!");
        setFormData(emptyOrder);
        setFiles([]);
      } else {
        setMessageType("error");
        setMessage("Fel: " + (data.error || "Något gick fel"));
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Anslutningsfel. Försök igen senare.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();

    if (!requestData.mail) {
      setRequestMessageType("error");
      setRequestMessage("E-post är obligatorisk");
      return;
    }

    setRequestLoading(true);
    setRequestMessage("");

    const submitData = new FormData();
    submitData.append("formtyp", "foretagskund");
    submitData.append("foretag", requestData.foretag);
    submitData.append("fornamn", requestData.fornamn);
    submitData.append("efternamn", requestData.efternamn);
    submitData.append("mail", requestData.mail);
    submitData.append("telefon", requestData.telefon);
    submitData.append("meddelande", requestData.meddelande);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        setRequestMessageType("success");
        setRequestMessage("Tack! Din förfrågan har skickats.");
        setRequestData(emptyRequest);
      } else {
        setRequestMessageType("error");
        setRequestMessage("Fel: " + (data.error || "Något gick fel"));
      }
    } catch (error) {
      setRequestMessageType("error");
      setRequestMessage("Anslutningsfel. Försök igen senare.");
      console.error("Error:", error);
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <>
      <main>
        <section className="section-companies">
          <div className="companies-logos-div">
            <h3>några av våra kunder</h3>
            <div className="company-logos">
              <div className="wrap-company-logo">
                <img src={logo1} alt="Gandalf MC Delsbo" />
                <p>Gandalf MC Delsbo</p>
              </div>
              <div className="wrap-company-logo">
                <img src={logo2} alt="Hälsingecykel" />
                <p>Hälsingecykel</p>
              </div>
              <div className="wrap-company-logo">
                <img src={logo3} alt="Herman Jonsson AB" />
                <p>Herman Jonsson AB</p>
              </div>
            </div>
            <div
              className="lineart-div left"
              style={{
                marginLeft: "-0%",
                marginTop: "-13%",
                marginBottom: "-4%",
              }}
            >
              <img src={lineart1} />
            </div>
          </div>

          <div className="company-div">
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
                <label htmlFor="text">Önskad text</label>
                <input
                  type="text"
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="file">
                  Ladda upp logotyp (webp, jpeg, jpg, png, gif) - fler bilder är
                  OK
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
                    color: messageType === "success" ? "#699147" : "#e77474",
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
            <div className="lineart-div left" style={{ marginLeft: "-5%" }}>
              <img src={lineart2} />
            </div>
          </div>

          <section className="company-support-section">
            <h3 className="company-h3">behöver du hjälp?</h3>
            <p>Kontakta oss vid behov så hjälper vi dig gärna:</p>
            <p>
              Telefon:
              <br />
              072-505 00 66
            </p>
            <p>
              E-post:
              <br />
              emiliajonsson@live.com
            </p>
            <div
              className="lineart-div left-minus"
              style={{ marginTop: "-15%" }}
            >
              <img src={lineart4} />
            </div>
          </section>

          <div className="companies-contact">
            <div className="lineart-div right" style={{ marginBottom: "-12%" }}>
              <img src={lineart3} />
            </div>
            <h3 className="company-request-h3">bli företagskund</h3>
            <p style={{ marginBottom: "2%", textAlign: "center" }}>
              Önskar du bli företagskund hos oss? Fyll i formuläret eller
              kontakta oss på nedan kontaktuppgifter. Vi besvarar er förfrågan
              så fort vi har möjlighet!
            </p>
            <p className="company-p-heading">Telefon:</p>
            <p className="company-p">072-505 00 66</p>
            <br />
            <p className="company-p-heading">E-post:</p>
            <p className="company-p">hej@emiliaskapar.se</p>

            <div className="request-form-wrapper">
              <form onSubmit={handleRequestSubmit}>
                <label htmlFor="req-foretag">Företag:</label>
                <input
                  type="text"
                  id="req-foretag"
                  name="foretag"
                  placeholder="Företagsnamn"
                  value={requestData.foretag}
                  onChange={handleRequestChange}
                  required
                />

                <label htmlFor="req-fornamn">Kontaktperson förnamn:</label>
                <input
                  type="text"
                  id="req-fornamn"
                  name="fornamn"
                  placeholder="Förnamn"
                  value={requestData.fornamn}
                  onChange={handleRequestChange}
                  required
                />

                <label htmlFor="req-efternamn">Kontaktperson efternamn:</label>
                <input
                  type="text"
                  id="req-efternamn"
                  name="efternamn"
                  placeholder="Efternamn"
                  value={requestData.efternamn}
                  onChange={handleRequestChange}
                />

                <label htmlFor="req-mail">E-mail:</label>
                <input
                  type="email"
                  id="req-mail"
                  name="mail"
                  placeholder="Ange mail vi ska svara till"
                  value={requestData.mail}
                  onChange={handleRequestChange}
                  required
                />

                <label htmlFor="req-telefon">Telefon:</label>
                <input
                  type="tel"
                  id="req-telefon"
                  name="telefon"
                  placeholder="Telefonnummer vi når er på"
                  value={requestData.telefon}
                  onChange={handleRequestChange}
                />

                <label htmlFor="req-meddelande">Meddelande:</label>
                <textarea
                  id="req-meddelande"
                  name="meddelande"
                  className="request-form-message"
                  placeholder="Skriv ditt meddelande"
                  value={requestData.meddelande}
                  onChange={handleRequestChange}
                />

                {requestMessage && (
                  <p
                    style={{
                      ...styles.message,
                      color:
                        requestMessageType === "success"
                          ? "#699147"
                          : "#e77474",
                    }}
                  >
                    {requestMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={requestLoading}
                  className="request-submit-button"
                >
                  {requestLoading ? "Skickar..." : "Skicka"}
                </button>
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
    width: "35vw",
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