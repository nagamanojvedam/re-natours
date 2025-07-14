import { Link } from "react-router-dom";

function NavItem({ link, text, icon, active = false }) {
  return (
    <li className={active ? "side-nav--active" : undefined}>
      <Link to={link} aria-current={active ? "page" : undefined}>
        <svg className="nav-icon" aria-hidden="true">
          <use xlinkHref={`img/icons.svg#icon-${icon}`} />
        </svg>
        <span>{text}</span>
      </Link>
    </li>
  );
}

export default NavItem;
