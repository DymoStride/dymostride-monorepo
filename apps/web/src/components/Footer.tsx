import { Logo } from "./ui/Logo";

/** Contact email shown in the footer. Swap for the real inbox before launch. */
const CONTACT_EMAIL = "b.kasan@hotmail.com";
const CONTACT_EMAIL_PLACEHOLDER = "hello@dymostride.com";

/** Basic marketing footer: logo, copyright and a contact link. */
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-300 flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between sm:px-7">
        <Logo href="#top" size={26} wordmarkSize={17} />

        <p className="order-3 text-[13px] text-body sm:order-0">
          © {year} Dymostride. All rights reserved.
        </p>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-[13px] font-medium text-muted transition-colors hover:text-body"
        >
          {CONTACT_EMAIL_PLACEHOLDER}
        </a>
      </div>
    </footer>
  );
};

export default Footer;
