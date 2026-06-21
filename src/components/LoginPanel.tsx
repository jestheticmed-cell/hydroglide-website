"use client";

import { ArrowRight, Check } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { authProviders } from "@/lib/auth-providers";
import { getSupabaseAuthClient } from "@/lib/supabase";

export function LoginPanel() {
  const [email, setEmail] = useState("");
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [authError, setAuthError] = useState("");
  const searchParams = useSearchParams();
  const showError = submitted && !email.trim();
  const nextPath = searchParams.get("next") || "/";
  const googleProvider = authProviders.google;
  const callbackError = searchParams.get("error");
  const callbackMessage =
    callbackError === "config"
      ? "Google sign-in is not configured yet. Please try again later."
      : callbackError === "profile"
        ? "Your Google account was verified, but your profile could not be saved. Please try again."
        : callbackError
          ? "Google sign-in was not completed. Please try again."
          : "";

  async function signInWithGoogle() {
    setAuthError("");
    const supabase = getSupabaseAuthClient();

    if (!supabase) {
      setAuthError("Google sign-in is not available yet. Please configure Supabase OAuth settings.");
      return;
    }

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: googleProvider.id,
      options: {
        redirectTo,
        scopes: googleProvider.scopes,
        queryParams: {
          access_type: "offline",
          prompt: "consent"
        }
      }
    });

    if (error) {
      setAuthError("Google sign-in could not be started. Please try again.");
    }
  }

  return (
    <form
      className="w-full"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <button
        type="button"
        onClick={signInWithGoogle}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-line bg-white text-[16px] font-medium text-ink transition hover:border-[#078b8b] hover:bg-[#f4f6f6] focus:outline-none focus:ring-2 focus:ring-[#078b8b] focus:ring-offset-2 sm:h-14 sm:text-[18px]"
      >
        <GoogleIcon />
        <span>Continue with Google</span>
      </button>

      <div className="my-5 grid grid-cols-[1fr_auto_1fr] items-center gap-5 text-[16px] text-graphite sm:my-6 sm:gap-6 sm:text-[18px]">
        <span className="h-px bg-line" />
        <span>or</span>
        <span className="h-px bg-line" />
      </div>

      <label className="block">
        <span className="sr-only">Email</span>
        <div
          className={`flex h-14 items-center rounded-xl border bg-white px-4 transition sm:h-[62px] ${
            showError ? "border-[#ef3f23]" : "border-line focus-within:border-[#078b8b]"
          }`}
        >
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-graphite sm:text-[18px]"
            aria-invalid={showError}
          />
          <button type="submit" className="grid h-10 w-10 place-items-center text-ink transition hover:text-[#078b8b] sm:h-11 sm:w-11" aria-label="Continue with email">
            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
          </button>
        </div>
        {showError ? <span className="mt-2 block text-[16px] text-[#d94016]">Enter an email</span> : null}
      </label>

      <label className="mt-5 flex cursor-pointer items-center gap-3 text-[16px] text-ink sm:mt-6 sm:gap-4 sm:text-[18px]">
        <input type="checkbox" checked={emailOptIn} onChange={(event) => setEmailOptIn(event.target.checked)} className="sr-only" />
        <span className={`grid h-6 w-6 place-items-center rounded-md ${emailOptIn ? "bg-[#3bbab4] text-white" : "border border-line bg-white text-transparent"}`}>
          <Check className="h-4 w-4" aria-hidden="true" />
        </span>
        <span>Email me with news and offers</span>
      </label>

      <p className="mt-8 text-center text-[15px] leading-6 text-graphite">
        By continuing, you agree to our{" "}
        <a href="/terms" className="underline underline-offset-2 hover:text-[#078b8b]">
          Terms of service
        </a>
      </p>

      {authError || callbackMessage ? <p className="mt-5 text-center text-sm leading-6 text-charcoal">{authError || callbackMessage}</p> : null}
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
