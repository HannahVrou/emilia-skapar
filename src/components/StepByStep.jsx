import stepOne from "../assets/images/steg-1.png";
import stepTwo from "../assets/images/steg-2.png";
import stepThree from "../assets/images/steg-3.png";
import arrow from "../assets/images/arrow-right_6.png";

export default function StepByStep() {
  return (
    <>
      <div className="three-steps">
        <h3 className="steps-heading">beställning fotobrodyr</h3>
        <p>Så går det till när du beställer en fotokarikatyr till brodyr.</p>
      <div className="three-steps-div">
        <article className="steps-article">
          <img className="steps-image" src={stepOne} />
          <h4 className="steps-text">
            {/* <b className="steps-number">1. </b>  */}
            1. skicka fotot
          </h4>
        </article>

        <img className="arrow" src={arrow} />

        <article className="steps-article">
          <img className="steps-image" src={stepTwo} />
          <h4 className="steps-text">
            {/* <b className="steps-number">2. </b>  */}
            2. godkänn fil
          </h4>
        </article>

        <img className="arrow" src={arrow} />

        <article className="steps-article">
          <img className="steps-image" src={stepThree} />
          <h4 className="steps-text">
            {/* <b className="steps-number">3. </b> */}
             3. färdig brodyr
          </h4>
        </article>
      </div>
    </div>
    </>
  );
}