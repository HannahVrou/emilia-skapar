import { useState } from "react";
import image1 from "../assets/images/outlined-products-09.png";
import image2 from "../assets/images/outlined-products-13.png";
import image3 from "../assets/images/outlined-products-11.png";
import image4 from "../assets/images/outlined-products-15.png";
import image5 from "../assets/images/outlined-products-20.png";
import image6 from "../assets/images/outlined-products-01-21.png";
import image7 from "../assets/images/outlined-products-18.png";
import image8 from "../assets/images/outlined-products-17.png";
import StepByStep from "../components/StepByStep";
import background1 from "../assets/images/broderade_hoodies.jpg";
import background2 from "../assets/images/brollops-broderi-tavla.jpg";
import lineart1 from "../assets/images/line_art-20.png";
import lineart2 from "../assets/images/line_art-07.png";
import lineart3 from "../assets/images/line_art-48.png";
import lineart4 from "../assets/images/line_art-0-23.png";
import font1 from "../assets/images/teckensnitt01.png";
import font2 from "../assets/images/teckensnitt02.png";
import font3 from "../assets/images/teckensnitt03.png";
import font4 from "../assets/images/teckensnitt04.png";
import font5 from "../assets/images/teckensnitt05.png";
import font6 from "../assets/images/teckensnitt06.png";

const PRODUCTS = [
  { name: "01. T-shirt", image: image1 },
  { name: "02. Tygpåse", image: image2 },
  { name: "03. Handduk", image: image3 },
  { name: "04. Hoodie", image: image4 },
  { name: "05. Tavla", image: image5 },
  { name: "06. Tygmärke", image: image6 },
  { name: "07. Keps", image: image7 },
  { name: "08. Annat/Egen", image: image8 },
];

const FONTS = [
  { name: "01. Handskrift Textad", image: font1 },
  { name: "02. Kompakt Fet", image: font2 },
  { name: "03. Skrivstil Enkel", image: font3 },
  { name: "04. Lekfull Textad", image: font4 },
  { name: "05. Klassisk Enkel", image: font5 },
  { name: "06. Skrivstil Handskrift", image: font6 },
];

function Order() {
  const [formData, setFormData] = useState({
    namn: "",
    mail: "",
    telefon: "",
    beskrivning: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [selectedProducts, setSelectedProducts] = useState([]);

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isProductSelected = (productName) =>
    selectedProducts.some((p) => p.name === productName);

  const toggleProduct = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.name === product.name);
      if (exists) {
        return prev.filter((p) => p.name !== product.name);
      }
      return [
        ...prev,
        {
          name: product.name,
          image: product.image,
          quantity: 1,
          font: "",
          colorProduct: "",
          colorThread: "",
          size: "",
          idea: "",
        },
      ];
    });
  };

  const updateProductField = (productName, field, value) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.name === productName ? { ...p, [field]: value } : p)),
    );
  };

  const handleFileChange = (e) => {
    setMessage("");

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
        showMessage("Endast .webp .jpeg .jpg .png .gif");
        return false;
      }
      if (file.size > maxSize) {
        showMessage(`${file.name} är för stor (max 5MB)`);
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);

    // Gör att samma fil kan väljas igen efter borttagning
    e.target.value = "";
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mail) {
      showMessage("E-post är obligatorisk");
      return;
    }

    setLoading(true);
    setMessage("");

    const submitData = new FormData();
    submitData.append("namn", formData.namn);
    submitData.append("mail", formData.mail);
    submitData.append("telefon", formData.telefon);
    submitData.append("beskrivning", formData.beskrivning);

    // eslint-disable-next-line no-unused-vars
    const produkter = selectedProducts.map(({ image, ...rest }) => rest);
    submitData.append("produkter", JSON.stringify(produkter));
    files.forEach((file, index) => {
      submitData.append(`file_${index}`, file);
    });

    try {
      const response = await fetch(
        "https://emiliaskapar.se/api/order.php",
        {
          method: "POST",
          body: submitData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        showMessage("Din beställning har skickats!", "success");
        setFormData({
          namn: "",
          mail: "",
          telefon: "",
          beskrivning: "",
        });
        setFiles([]);
        setSelectedProducts([]);
      } else {
        showMessage("Fel: " + (data.error || "Något gick fel."));
      }
    } catch (error) {
      showMessage("Anslutningsfel. Försök igen om ett tag.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFont = (fontName) => FONTS.find((f) => f.name === fontName);

  const renderProduct = (product) => (
    <article
      key={product.name}
      className={`orders-product ${isProductSelected(product.name) ? "selected" : ""}`}
      onClick={() => toggleProduct(product)}
    >
      <h5 className="product-number">{product.name}</h5>
      <img src={product.image} alt={product.name} />
    </article>
  );

  return (
    <>
      <main>
        <section className="section-orders">
          <div className="howto-section">
            <StepByStep />
            <div className="lineart-div right" style={{ marginTop: "-16%" }}>
              <img src={lineart4} alt="" />
            </div>
          </div>
          <section className="background-section-2">
            <img src={background2} alt="" />
          </section>
          <section className="price-section">
            <h3 className="price-h3">angående priser</h3>
            <p
              style={{
                textAlign: "center",
                width: "55%",
                lineHeight: "1.4",
                marginLeft: "14%",
              }}
            >
              Vi lämnar ett prisförslag till dig efter att du skickat in din beställningsförfrågan.
              Meddela gärna då om du vill ha pris för vardera produkt eller
              en totalsumma för alla produkter.
            </p>
            <div className="lineart-div left" style={{ marginTop: "-6%" }}>
              <img src={lineart3} alt="" />
            </div>
          </section>
          <section className="section-products-n-fonts">
            <div
              className="lineart-div right"
              style={{ width: "70%", marginLeft: "30%", marginTop: "-3%" }}
            >
              <img src={lineart2} alt="" />
            </div>

            <div className="orders-div">
              <div className="orders-products-div">
                <h3 className="product-h3">välj produkt</h3>
                <p
                  style={{
                    textAlign: "center",
                    width: "80%",
                    lineHeight: "1.4",
                  }}
                >
                  Välj önskade produkter ur vårt sortiment för brodyr, finns den inte med välj
                  alternativ 08. Annat/Egen och beskriv din idé.
                </p>
                <div className="products">
                  {PRODUCTS.slice(0, 2).map(renderProduct)}
                </div>
                <div className="products">
                  {PRODUCTS.slice(2, 4).map(renderProduct)}
                </div>
                <div className="products">
                  {PRODUCTS.slice(4, 6).map(renderProduct)}
                </div>
                <div className="products">
                  {PRODUCTS.slice(6, 8).map(renderProduct)}
                </div>
              </div>

              <div className="orders-fonts-div">
                <h3 className="fonts-h3">teckensnitt urval</h3>
                <p
                  style={{
                    textAlign: "center",
                    width: "85%",
                    lineHeight: "1.4",
                  }}
                >
                  Teckensnitt vi erbjuder för textbrodyr, du väljer
                  teckensnittet i produktrutan efter att du valt produkt. Vill
                  du ej ha text, lämna tomt.
                </p>
                <div className="fonts-text-div">
                  {FONTS.map((font) => (
                    <div className="fonts-text" key={font.name}>
                      <b className="font-number">{font.name}</b>
                      <img src={font.image} alt={font.name} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FORMULÄR */}
          <div className="orders-order-div">
            <h3 className="order-h3">beställningsförfrågan</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label>Valda produkter</label>
                {selectedProducts.length === 0 ? (
                  <p className="no-products-text">
                    Ingen produkt vald ännu, välj produkt ovan
                  </p>
                ) : (
                  <div className="selected-products-list">
                    {selectedProducts.map((product) => (
                      <div key={product.name} className="selected-product-card">
                        <div className="selected-product-header">
                          <div className="product-image-n-name">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="mini-image-product"
                            />
                            <span className="product-chip-name">
                              {product.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleProduct(product)}
                            className="chip-remove"
                          >
                            × Ta bort
                          </button>
                        </div>

                        <div className="selected-product-fields">
                          <label className="mini-label">
                            Antal:
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
                            Teckensnitt:
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
                              <option value="">Inget val</option>
                              {FONTS.map((font) => (
                                <option key={font.name} value={font.name}>
                                  {font.name}
                                </option>
                              ))}
                            </select>
                          </label>

                          {getFont(product.font) && (
                            <img
                              src={getFont(product.font).image}
                              alt={product.font}
                              className="mini-image-font"
                            />
                          )}
                          <label className="mini-label">
                            Önskad färg - produkt:
                            <input
                              type="text"
                              placeholder=""
                              value={product.colorProduct}
                              onChange={(e) =>
                                updateProductField(
                                  product.name,
                                  "colorProduct",
                                  e.target.value,
                                )
                              }
                              className="mini-input"
                            />
                          </label>

                          <label className="mini-label">
                            Önskad färg - tråd:
                            <input
                              type="text"
                              placeholder=""
                              value={product.colorThread}
                              onChange={(e) =>
                                updateProductField(
                                  product.name,
                                  "colorThread",
                                  e.target.value,
                                )
                              }
                              className="mini-input"
                            />
                          </label>

                          <label className="mini-label">
                            Önskad storlek:
                            <input
                              type="text"
                              placeholder="t.ex. 50x70 cm, S, M, XL"
                              value={product.size}
                              onChange={(e) =>
                                updateProductField(
                                  product.name,
                                  "size",
                                  e.target.value,
                                )
                              }
                              className="mini-input"
                            />
                          </label>

                          <label className="mini-label">
                            Beskrivning:
                            <textarea
                              placeholder="Beskriv här din idé för produkten"
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
                <label htmlFor="namn">För- och efternamn</label>
                <input
                  type="text"
                  id="namn"
                  name="namn"
                  value={formData.namn}
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
                  placeholder="Beskriv här ev. övriga önskemål"
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
                    color: messageType === "success" ? "#89af55" : "#e7455b",
                  }}
                >
                  {message}
                  {messageType === "error" && (
                    <i
                      style={{
                        display: "block",
                        marginTop: "6px",
                        color: "#e7455b",
                        fontWeight: "400",
                        fontSize: "1.0rem",
                      }}
                    >
                      Kvarstår problemet, maila oss på: hej@emiliaskapar.se
                    </i>
                  )}
                </p>
              )}

              {/* FÖRHANDSGRANSKNING */}
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
                      <div className="lineart-div left">
              <img src={lineart1} alt="" />
            </div>
          </div>         
        </section>

        <section className="background-section-1">
          <img src={background1} alt="" />
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
    backgroundColor: "var(--brown)",
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
    backgroundColor: "var(--green)",
    color: "white",
    border: "none",
    borderRadius: "400px",
    fontFamily: '"Mona Sans", sans-serif',
    fontSize: "1.25rem",
    fontWeight: "500",
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
