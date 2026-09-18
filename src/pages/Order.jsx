import { useState } from "react";
import image1 from "../assets/images/outlined-products-09.png";
import image2 from "../assets/images/outlined-products-13.png";
import image3 from "../assets/images/outlined-products-11.png";
import image4 from "../assets/images/outlined-products-17.png";
import StepByStep from "../components/StepByStep";

function Order() {
  const [formData, setFormData] = useState({
    kontaktperson: "",
    mail: "",
    telefon: "",
    beskrivning: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isProductSelected = (productName) =>
    selectedProducts.some((p) => p.name === productName);

  const toggleProduct = (productName) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.name === productName);
      if (exists) {
        return prev.filter((p) => p.name !== productName);
      }
      return [
        ...prev,
        { name: productName, quantity: 1, font: "", color: "", idea: "" },
      ];
    });
  };

  const updateProductField = (productName, field, value) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.name === productName ? { ...p, [field]: value } : p)),
    );
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const allowedTypes = [
      "image/webp",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/jpg",
    ];
    const maxSize = 5 * 1024 * 1024;

    const validFiles = selectedFiles.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        setMessage(` Endast .webp .jpeg .jpg .png .gif`);
        return false;
      }
      if (file.size > maxSize) {
        setMessage(` ${file.name} är för stor (max 5MB)`);
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
    submitData.append("kontaktperson", formData.kontaktperson);
    submitData.append("mail", formData.mail);
    submitData.append("telefon", formData.telefon);
    submitData.append("beskrivning", formData.beskrivning);
    submitData.append("produkter", JSON.stringify(selectedProducts));
    files.forEach((file, index) => {
      submitData.append(`file_${index}`, file);
    });

    try {
      const response = await fetch("https://emiliaskapar.se/api/order.php", {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✓ Din beställning har skickats!");
        setFormData({
          kontaktperson: "",
          mail: "",
          telefon: "",
          beskrivning: "",
          produkter: "",
        });
        setFiles([]);
        setSelectedProducts([]);
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
        <section className="section-order1">
          <div className="howto-section">
            <StepByStep />
          </div>
          <div className="order1-div">
            <div className="order1-products-div">
              <h3 className="order1-h3">välj produkt</h3>

              <div className="products">
                <article
                  className={`order1-product ${isProductSelected("T-shirt") ? "selected" : ""}`}
                  onClick={() => toggleProduct("T-shirt")}
                >
                  <h5 className="product-number">01. T-shirt</h5>
                  <img src={image1} />
                </article>
                <article
                  className={`order1-product ${isProductSelected("Tygpåse") ? "selected" : ""}`}
                  onClick={() => toggleProduct("Tygpåse")}
                >
                  <h5 className="product-number">02. Tygpåse</h5>
                  <img src={image2} />
                </article>
              </div>
              <div className="products">
                <article
                  className={`order1-product ${isProductSelected("Handduk") ? "selected" : ""}`}
                  onClick={() => toggleProduct("Handduk")}
                >
                  <h5 className="product-number">03. Handduk</h5>
                  <img src={image3} />
                </article>
                <article
                  className={`order1-product ${isProductSelected("Annan/Egen") ? "selected" : ""}`}
                  onClick={() => toggleProduct("Annan/Egen")}
                >
                  <h5 className="product-number">04. Annan/Egen</h5>
                  <img src={image4} />
                </article>
              </div>
            </div>
            <div className="fonts-div">
              <h3 className="fonts-h3">teckensnitt</h3>
                            <div
                className="fonts-text-div"
              >
              <p
                style={{
                  fontSize: "2rem",
                  fontFamily: "helvetica",
                }}
                className="fonts-text"
              >
                <b className="font-number">01.</b> Helvetica
              </p>

               
                              <p
                style={{
                  fontSize: "2rem",
                  fontFamily: "times new roman",
                }}
                className="fonts-text"
              >
               <b className="font-number">02.</b>   Times New Roman
              </p>
      
              <p
                style={{
                  fontSize: "2rem",
                  fontFamily: "cursive",
                }}
                className="fonts-text"
              >
                <b className="font-number">03.</b> Script
              </p>
              <p
                style={{
                  fontSize: "2rem",
                  fontFamily: "courier new",
                }}
                className="fonts-text"
              >
                <b className="font-number">04.</b> Courier New
              </p>
              <p
                style={{
                  fontSize: "2rem",
                  fontFamily: "verdana",
                }}
                className="fonts-text"
              >
                <b className="font-number">05.</b> Verdana
              </p>
                      </div>
            </div>
          </div>
          <div className="order1-order-div">
            <h3 className="order1-order-h3">beställningsförfrågan</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label>Valda produkter</label>
                {selectedProducts.length === 0 ? (
                  <p className="no-products-text">
                    Inga produkter valda ännu — välj produkt ovan
                  </p>
                ) : (
                  <div className="selected-products-list">
                    {selectedProducts.map((product) => (
                      <div key={product.name} className="selected-product-card">
                        <div className="selected-product-header">
                          <span className="product-chip-name">
                            {product.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleProduct(product.name)}
                            className="chip-remove"
                          >
                            × Ta bort
                          </button>
                        </div>

                        <div className="selected-product-fields">
                          <label className="mini-label">
                            Antal
                            <input
                              type="number"
                              min="1"
                              value={product.quantity}
                              onChange={(e) =>
                                updateProductField(
                                  product.name,
                                  "quantity",
                                  e.target.value,
                                )
                              }
                              className="mini-input"
                            />
                          </label>

                          <label className="mini-label">
                            Teckensnitt
                            <select
                              value={product.font}
                              onChange={(e) =>
                                updateProductField(
                                  product.name,
                                  "font",
                                  e.target.value,
                                )
                              }
                              className="mini-input select-input"
                            >
                              <option value="">Teckensnitt</option>
                              <option value="Helvetica">01. Helvetica</option>
                              <option value="Times New Roman">
                                02. Times New Roman
                              </option>
                              <option value="Script">03. Script</option>
                              <option value="Courier New">
                                04. Courier New
                              </option>
                              <option value="Verdana">05. Verdana</option>
                            </select>
                          </label>

                          <label className="mini-label">
                            Önskad färg broderi
                            <input
                              type="text"
                              placeholder="t.ex. svart, marinblå, guld..."
                              value={product.color}
                              onChange={(e) =>
                                updateProductField(
                                  product.name,
                                  "color",
                                  e.target.value,
                                )
                              }
                              className="mini-input"
                            />
                          </label>

                          <label className="mini-label">
                            Beskrivning
                            <textarea
                              placeholder="Beskriv motiv, storlek, text eller idé för just den här produkten..."
                              value={product.idea}
                              onChange={(e) =>
                                updateProductField(
                                  product.name,
                                  "idea",
                                  e.target.value,
                                )
                              }
                              className="mini-input mini-textarea"
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="kontaktperson">Ditt namn</label>
                <input
                  type="text"
                  id="kontaktperson"
                  name="kontaktperson"
                  value={formData.kontaktperson}
                  onChange={handleInputChange}
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
                <label htmlFor="beskrivning">Beskrivning</label>
                <textarea
                  id="beskrivning"
                  name="beskrivning"
                  value={formData.beskrivning}
                  onChange={handleInputChange}
                  placeholder="Beskriv val av varor, storlekar, färg och form..."
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="file">
                  Ladda upp bilder (webp, jpeg, png, gif) - fler är OK
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
              {message && (
                <p
                  style={{
                    ...styles.message,
                    color: message.includes("✓") ? "#89af55" : "#e7455b",
                  }}
                >
                   {!message.includes("✓") && (
                    <b
                      style={{
                        color: "#e7455b",
                        fontWeight: "800",
                        fontSize: "1.7rem",
                        fontVariationSettings: "'wght' 800,'GRAD' 0,'opsz' 30",
                        marginRight: "2px",
                      }}
                    >
                     ⚠︎ 
                    </b>
                  )}
                  {message}
                  {!message.includes("✓") && (
                    <i
                      style={{
                        display: "block",
                        marginTop: "6px",
                        color: "#e7455b",
                        fontWeight: "400",
                        fontSize: "1.0rem",
                      }}
                    >
                      Kvarstår problemet, maila oss istället på:
                      hej@emiliaskapar.se
                    </i>
                  )}
                </p>
              )}

              {/* FÖRHANDSGRANSKING */}
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

              <button
                type="submit"
                disabled={loading}
                style={styles.button}
                className="submit-button"
              >
                {loading ? "Skickar..." : "Skicka förfrågan"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

const styles = {
  form: {
    width: "35vw",
    margin: "3rem auto",
    padding: "2rem",
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
  selectInput: {
    padding: "0.75rem",
    paddingRight: "20rem",
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
    backgroundColor: "#ffffffdd",
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
    objectFit: "contain",
    borderRadius: "4px",
  },
  fileName: {
    fontSize: "0.85rem",
    color: "black",
    margin: "0",
    wordBreak: "break-word",
    fontWeight: "400",
  },
  removeButton: {
    padding: "0.4rem 1rem",
    backgroundColor: "var(--beige)",
    color: "#fff",
    border: "none",
    borderRadius: "400px",
    fontFamily: '"Mona Sans", sans-serif',
    fontSize: "0.8rem",
    fontWeight: "500",
    cursor: "pointer",
  },
  button: {
    padding: "1rem",
    backgroundColor: "#f79c67",
    color: "white",
    border: "none",
    borderRadius: "400px",
    fontFamily: '"Mona Sans", sans-serif',
    fontSize: "1.25rem",
    fontWeight: "400",
    cursor: "pointer",
    },
  message: {
    textAlign: "left",
    fontWeight: "500",
    whiteSpace: "pre-line",
    fontSize: "1.0rem",
  },
  required: {
    color: "#e7455b",
  },
};

export default Order;
