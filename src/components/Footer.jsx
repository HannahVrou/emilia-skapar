import logo from "../assets/logos/logo-emilia_skapar-25.png";


export default function Footer() {

  return (
    <footer className="footer">
        <div className="footer-top-section">
          <img src={logo} className="footer-logo"/>
            {/* <h3 className="footer-contact-title">emilia skapar</h3> */}
            <div className="footer-contact-info">
            <p className="footer-adress-text">
                Bänbro 207, Delsbo, Sweden
              </p>
              <p className="footer-contact-text">
                <span className="footer-label">Telefon</span>
                <a href="tel:+46725050066" className="footer-link">072-505 00 66</a>
              </p>
              <p className="footer-contact-text">
                <span className="footer-label">E-post</span>
                <a href="mailto:emiliajonsson@live.com" className="footer-link">
                  hej@emiliaskapar.se
                </a>
              </p>
            </div>
        </div>
              <div className="footer-divider" />
              <div className="footer-bottom-section">
          <p className="footer-copyright">  
            Emilia Skapar 2026 © Utvecklad av <a href="https://www.barlindesign.se/" className="copy-link">Bärlin Design</a>
          </p>
        </div>
    </footer>
  );
}