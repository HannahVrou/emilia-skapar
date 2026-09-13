import image1 from "../assets/images/tavla2-2.jpg";
import image2 from "../assets/images/broderade_hoodies.jpg";
import image3 from "../assets/images/delsbodrakt_tomtegumma.jpg";
import image4 from "../assets/images/tavla-6.PNG";
import image5 from "../assets/images/tygmarken.jpg";
import image6 from "../assets/images/outdoor_emboderie_caps.jpg";

function About() {
  return (
 <>
      <main>
        <section className="section-about">
          <div className="hero-about"></div>
<div className="sidebyside-about">
          <div className="about-us-div">
            <h3>om oss och det vi gör</h3>
            <p>
              Jag som driver denna firma heter Emilia Alfresson (fd Jonsson) och
              håller till uti Delsbos skogar. Firman startade jag då behovet
              fanns hos ett annat företag, Herman Jonsson AB, varpå jag köpte in
              maskiner för att tillgodose behoven.
            </p>
            <p>
              Sedan har det bara fått rulla på. Behovet av broderade och sydda
              mönster och motiv istället för tryckta var större än vi anande, så
              detta rullade bara på.
            </p>
            <p>
              Intresset har alltid funnits för texil och handarbete så det här
              gick liksom hand i hand kan man säga.
            </p>
            <p>
              Jag gör även custom-beställningar utefter specifika önskemål.
              Roligt som gåva till en avgående chef kanske, eller kanske en
              personlig present till 50-åringen som har allt..?
            </p>
          </div>

          <div className="section-contact">
            <div className="contact-div">
              <h3>kontakt</h3>
              <p>
                Hör gärna av er till oss om ni har frågor eller funderingar.
              </p>
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
              allowfullscreen={""}
              loading={"lazy"}
              referrerpolicy={"strict-origin-when-cross-origin"}
            ></iframe>
          </div>
</div>
 </div>
          <div className="about-div">
            <h3>sånt vi gjort</h3>
            <div className="gallery-about">
              <img src={image6} />
              <img src={image5} />
              <img src={image4} />
              <img src={image3} />
              <img src={image2} />
              <img src={image1} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default About;