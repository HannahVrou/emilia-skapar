import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logos/emilia_skapar-logo-00-27.png"

export default function Navbar() {
  const navigate = useNavigate();

  const homeClick = () => {
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-links">
          <li>
            <NavLink to="/" end>start</NavLink>
          </li>
          <li>
            <NavLink to="/bestall">beställ</NavLink>
          </li>
          <img src={logo} onClick={homeClick} className="nav-logo"/>
          <li>
            <NavLink to="/foretag">företag</NavLink>
          </li>
          {/* <li>
            <NavLink to="/omoss">om oss</NavLink>
          </li> */}
          <li>
            <NavLink to="/kontakt">kontakt</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}