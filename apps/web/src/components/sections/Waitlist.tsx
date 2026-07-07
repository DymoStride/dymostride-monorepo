import { useId, useState, type FormEvent } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { WAITLIST_EMAIL_ID } from "../../constants/waitlist";

/** Pragmatic email check — good enough for a client-side gate. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** "Coming soon" section with an accessible email waitlist form. */
const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const errorId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    // TODO: POST the email to `/api/waitlist` once the backend is ready.
    setSubmitted(true);
  };

  return (
    <section
      id="waitlist"
      aria-labelledby="waitlist-title"
      className="mx-auto w-full max-w-300 px-6 pb-24 pt-8 sm:px-7"
    >
      <Card className="mx-auto max-w-150 border-line/70 bg-surface/60 px-6 py-12 text-center backdrop-blur-md sm:px-12">
        <Badge dot className="mb-6">
          Coming soon
        </Badge>

        <h2
          id="waitlist-title"
          className="font-display text-[30px] font-black tracking-[-0.02em] text-heading sm:text-[38px]"
        >
          Something great is on the way.
        </h2>

        <p className="mx-auto mt-4 max-w-110 text-[16px] leading-relaxed text-muted sm:text-[17px]">
          We're putting the finishing touches on Dymostride. Leave your email
          and we'll let you know the moment it launches — no spam, just one
          friendly hello.
        </p>

        {submitted ? (
          <p
            role="status"
            className="mx-auto mt-8 max-w-115 rounded-[11px] border border-brand/30 bg-brand/10 px-4 py-3.5 text-[15px] font-semibold text-brand-soft"
          >
            🎉 You're on the list! We'll be in touch soon.
          </p>
        ) : (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-115 flex-col gap-3 sm:flex-row"
          >
            <label htmlFor={WAITLIST_EMAIL_ID} className="sr-only">
              Email address
            </label>
            <input
              id={WAITLIST_EMAIL_ID}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError(null);
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className="w-full flex-1 rounded-[11px] border border-line bg-surface/70 px-4 py-3.5 text-[15px] text-body placeholder:text-faint focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/60 focus:ring-offset-2 focus:ring-offset-bg"
            />
            <Button type="submit" size="lg" className="shrink-0">
              Notify me
            </Button>
          </form>
        )}

        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-3 text-[13.5px] font-medium text-pink"
          >
            {error}
          </p>
        )}
      </Card>
    </section>
  );
};

export default Waitlist;
