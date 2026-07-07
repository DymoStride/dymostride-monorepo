import { type MouseEvent } from "react";
import { Badge } from "../ui/Badge";
import { buttonVariants } from "../../lib/types/buttonVariants";
import { cn } from "../../lib/utils/tailwindUtils";
import { WAITLIST_EMAIL_ID } from "../../constants/waitlist";

const Hero = () => {
  const focusWaitlist = (event: MouseEvent<HTMLAnchorElement>) => {
    const input = document.getElementById(WAITLIST_EMAIL_ID);
    if (!input) return;

    event.preventDefault();
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    input.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });
    input.focus({ preventScroll: true });
  };

  return (
    <section className="mx-auto flex w-full max-w-3xl animate-fade-up flex-col items-center px-6 pb-16 pt-16 text-center sm:px-7 lg:pt-24">
      <Badge dot className="mb-6">
        Building in progress
      </Badge>

      <h1 className="font-display text-[44px] font-black leading-[0.98] tracking-[-0.035em] text-heading sm:text-[58px] lg:text-[72px]">
        Hit your <span className="text-brand">stride.</span>
      </h1>

      <p className="mb-8 mt-6 max-w-115 text-[18px] leading-relaxed text-muted sm:text-[19px]">
        Dymostride turns every habit into a living grid of green. Build streaks,
        compare with the community, and let your AI coach keep you honest — one
        square at a time.
      </p>

      <a
        href="#waitlist"
        onClick={focusWaitlist}
        className={cn(buttonVariants({ size: "lg" }), "animate-glow-pulse")}
      >
        Join the waitlist
      </a>
    </section>
  );
};

export default Hero;
