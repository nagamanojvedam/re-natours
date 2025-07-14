import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__logo">
        <img src="/img/logo-green.png" alt="Natour logo" />
      </div>
      <ul className="footer__nav">
        <li>
          <Link to="/about">About us</Link>
        </li>
        <li>
          <Link to="/download">Download apps</Link>
        </li>
        <li>
          <Link to="/guide">Become a guide</Link>
        </li>
        <li>
          <Link to="/careers">Careers</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
      <p className="footer__copyright">
        &copy; by Jonas Schmedtmann. Feel free to use this project for your own
        purposes, <strong>EXCEPT</strong> producing your own course or
        tutorials.
      </p>
    </footer>
  );
}

export default Footer;
