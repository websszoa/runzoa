import FooterCopyright from "./footer-copyright";
import FooterInfo from "./footer-info";

export default function Footer() {
  return (
    <footer className="footer__container">
      <FooterInfo />
      <FooterCopyright />
    </footer>
  );
}
