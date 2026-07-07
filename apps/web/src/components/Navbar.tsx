import { Badge } from "./ui/Badge";
import { Logo } from "./ui/Logo";

/** Public header: just the business logo/wordmark and a status badge. */
const Navbar = () => {
  return (
    <header className="mx-auto flex w-full max-w-300 items-center justify-between px-6 py-5 sm:px-7">
      <Logo href="#top" />
      <Badge dot>Coming soon</Badge>
    </header>
  );
};

export default Navbar;
