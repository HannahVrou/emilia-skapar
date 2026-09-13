function Contact() {
  return (
    <>
      <main>
        <section className="section-about">
          {/* <div className="hero-about"></div> */}
          <div className="sidebyside-contact">
            <div className="section-contact">
              <div className="contact-div">
            <h3>direktmeddelande</h3>
            <p>Skicka ett meddelande till oss, så svarar vi så fort vi kan.</p>
            <div className="direct-form-wrapper">
            <form onSubmit={console.log("message submitted")}>
              <label>Namn:</label>
              <input type="text" placeholder="Ange ditt namn"/>
              <label>E-mail:</label>
              <input type="email" placeholder="Ange den mail vi svarar till"/>
              <label>Telefon:</label>
              <input type="tel" placeholder="Ange telefonnummer"/>
              <label>Meddelande:</label>
              <textarea className="direct-form-message" placeholder="Skriv ditt meddelande"/>
            <button type="button" className="direct-submit-button" onClick={console.log("send button clicked")}>
              Skicka</button>
            </form>
            </div>
            </div>
            </div>
            <div className="section-contact">
              <div className="contact-div">
                <h3>kontaktuppgifter</h3>
                <p>
                  Hör gärna av er med era frågor och funderingar.
                </p>
                
                  <b>Emilia Skapar</b>
                  <h5>
                  Bänbro 207, Delsbo <br />
                  SWEDEN
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
