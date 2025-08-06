import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <nav className={styles.desktopNav}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/episodes">Episodes</NavLink>
        {/* External link */}
        <a
          href="https://www.redbubble.com/people/ReCallTheMidPod/shop"
          target="_blank"
          rel="noopener noreferrer"
        >
          Shop
        </a>
      </nav>

      <div className={styles.burgerIcon} onClick={() => setMenuOpen(true)}>
        <RxHamburgerMenu size={28} />
      </div>

      <div className={`${styles.overlay} ${menuOpen ? styles.show : ""}`}>
        <div className={styles.closeIcon} onClick={() => setMenuOpen(false)}>
          <IoClose size={28} />
        </div>
        <nav className={styles.mobileNav}>
          <NavLink
            to="/"
            className={styles.mobileLink}
            onClick={handleLinkClick}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={styles.mobileLink}
            onClick={handleLinkClick}
          >
            About Us
          </NavLink>
          <NavLink
            to="/episodes"
            className={styles.mobileLink}
            onClick={handleLinkClick}
          >
            Episodes
          </NavLink>
          <a
            href="https://www.redbubble.com/people/ReCallTheMidPod/shop"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileLink}
            onClick={handleLinkClick}
          >
            Shop
          </a>
        </nav>
      </div>
    </header>
  );
}
