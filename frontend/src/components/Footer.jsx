import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__logo">
        {" "}
        <img src="/img/logo-green.png" alt="Natour logo" />
      </div>
      <ul className="footer__nav">
        <li>
          <Link href="#">About us</Link>
        </li>
        <li>
          <Link href="#">Download apps</Link>
        </li>
        <li>
          <Link href="#">Become Link guide</Link>
        </li>
        <li>
          <Link href="#">Careers</Link>
        </li>
        <li>
          <Link href="#">Contact</Link>
        </li>
      </ul>
      <p className="footer__copyright">
        &copy; by Jonas Schmedtmann. Feel free to use this project for your own
        purposes, EXCEPT producing your own course or tutorials.
      </p>
    </footer>
  );
}

export default Footer;
