import { useNavigate } from "react-router-dom";
import logo from "../assets/logos/logo-emilia_skapar-01.png";
// import image1 from "../assets/images/tavla-brudpar.jpg";
// import image2 from "../assets/images/kepsar-3.JPEG";
// import image3 from "../assets/images/broderade_jutevaskor_delsbosom.jpg";
import image1 from "../assets/images/tavla2-2.jpg";
import image2 from "../assets/images/delsbodrakt_tomtegumma.jpg";
import image3 from "../assets/images/broderade_hoodies.jpg";
import image4 from "../assets/images/tavla-6.PNG";
import image5 from "../assets/images/tygmarken.jpg";
import image6 from "../assets/images/outdoor_emboderie_caps.jpg";
import lineart1 from "../assets/images/line_art-02.png";
import lineart2 from "../assets/images/line_art-03.png";
import lineart3 from "../assets/images/line_art-15.png";

function Start() {
  const navigate = useNavigate();

  const handleClickOrder = () => {
    navigate("/bestall");
  };

  const handleClickCompanies = () => {
    navigate("/foretag");
  };

  return (
    <>
      <main>
        <section className="section-start">
          <div className="hero-start">
            <div className="puff-background">
              <div className="logo-container">
                <img src={logo} alt="Emilia Skapar" />
              </div>
              <h2>- ibland med svordomar, alltid med kärlek</h2>
            </div>
          </div>

          <div
            className="div-1"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifySelf: "center",
              alignItems: "center",
              margin: "0",
            }}
          >
            <h4
              style={{ maxWidth: "850px", margin: "0 0 2%" }}
              className="start1-h4"
            >
              Vi gör företagsbroderier, vimplar, broderade tavlor, arbetskläder
              eller vad du än kan komma på – allt skapas i vår sömmaskinspark i
              Delsbo!
            </h4>
            <button onClick={handleClickOrder} className="button-apricot">
              Beställ
            </button>
            <div className="lineart-div left-minus">
              <img src={lineart1} />
            </div>
            <div className="gallery-about-wrapper">
              <h3>produktexempel</h3>
              <p style={{ marginTop: "1%" }}>
                Några utvalda exempel på vad du kan göra hos oss.
              </p>
              <div className="gallery-about">
                <article
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img src={image6} />
                  <p>Broderi på keps</p>
                </article>
                <article
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img src={image5} />
                  <p>Textillappar</p>
                </article>
                <article
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img src={image4} />
                  <p>Textbrodyr doptavla</p>
                </article>
                <article
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img src={image3} />
                  <p>Broderat motiv hoodie</p>
                </article>
                <article
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img src={image2} />
                  <p>Broderad minitavla dräkttomte</p>
                </article>
                <article
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img src={image1} />
                  <p>Textbrodyr bröllop</p>
                </article>
              </div>
              <div className="lineart-div right">
                <img src={lineart2} />
              </div>
            </div>
            <div className="about-us-div">
              <h3>om oss och det vi gör</h3>
              <p>
                Jag som driver företaget heter Emilia Alfresson (fd Jonsson)
                och håller till i lilla Delsbo ute i Hälsingeskogarna. Firman startades 
                då jag uppmärksammade ett behov av brodyr till
                företagsklädsel samt ett bra alternativ till tryck som håller
                länge. Varpå det gjordes ett inköp maskiner och därmed
                tillgodosågs behovet.
              </p>
              <p><b>Inte bara ett alternativ till tryck</b><br/>
                I och med företagsstarten upptäckte jag en uppsjö av alla de
                möjligheter som finns inom maskinbrodyr, vilken bredd det har
                och att det går att skapa otroligt detaljrika motiv på massvis av
                olika typer av underlag. Det har alltid funnits ett intresse för
                texil och handarbete hos mig, så detta gick hand i hand ihop kan
                man säga. En värld öppnade sig för vad som faktiskt gick att
                göra.
              </p>
              <p>
                <b>Gör en custombeställning av din idé</b><br/>
                Förutom företagsbroderier tar vi även emot custom-beställningar
                efter dina egna idéer och specifika önskemål. Kanske som en
                rolig gåva till en avgående chef? En personlig present till
                50-åringen som har allt? Eller något unikt till dig själv!
              </p>
              <p
                style={{
                  textAlign: "center",
                  marginBottom: "2%",
                  marginTop: "2%",
                }}
              >
                Kika in på vår beställningssida och se vad du kommer på:
              </p>
              <button onClick={handleClickOrder} className="button-green">
                Beställ
              </button>
            </div>
            <div className="start-company-div">
              <h4
                style={{
                  maxWidth: "650px",
                  margin: "5% 0 2%",
                  justifySelf: "center",
                }}
                className="start2-h4"
              >
                Är du företagare? Gör din beställning eller bli företagskund hos
                oss på vår företagssida.
              </h4>
              <button onClick={handleClickCompanies} className="button-green">
                Företag
              </button>
              <div className="lineart-div left-minus">
                <img src={lineart3} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Start;
