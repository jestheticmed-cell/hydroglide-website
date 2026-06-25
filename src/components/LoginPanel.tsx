"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authProviders } from "@/lib/auth-providers";
import { getSupabaseAuthClient } from "@/lib/supabase";

function getAuthRedirectOrigin() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  const currentOrigin = window.location.origin;
  const isLocalOrigin = currentOrigin.includes("localhost") || currentOrigin.includes("127.0.0.1");

  if (!isLocalOrigin) {
    return currentOrigin;
  }

  if (configuredUrl && !configuredUrl.includes("localhost") && !configuredUrl.includes("127.0.0.1")) {
    return configuredUrl;
  }

  return currentOrigin;
}

export function LoginPanel() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const [authError, setAuthError] = useState("");
  const [emailNotice, setEmailNotice] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code">("email");
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/account";
  const googleProvider = authProviders.google;
  const showEmailError = submitted && !email.trim();
  const showCodeError = codeSubmitted && verificationCode.trim().length < 6;
  const callbackError = searchParams.get("error");
  const callbackDetail = searchParams.get("detail");
  const callbackMessage =
    callbackDetail ||
    (callbackError === "config"
      ? "Google sign-in is not configured yet. Please try again later."
      : callbackError === "profile"
        ? "Your Google account was verified, but your profile could not be saved. Please try again."
        : callbackError
          ? "Google sign-in was not completed. Please try again."
          : "");
  const accountPath = `/account?email=${encodeURIComponent(email)}&next=${encodeURIComponent(nextPath)}`;

  async function requestEmailCode() {
    setSubmitted(true);
    setAuthError("");
    setEmailNotice("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || isEmailLoading) return;

    setIsEmailLoading(true);
    setEmailNotice("Sending verification code...");
    const supabase = getSupabaseAuthClient();

    if (!supabase) {
      setEmailNotice("");
      setAuthError("Email sign-in is not configured yet. Please add Supabase URL and anon key.");
      setIsEmailLoading(false);
      return;
    }

    const { error } = await supabase.auth
      .signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: true
        }
      })
      .catch((requestError: Error) => ({ data: null, error: requestError }));

    if (error) {
      setEmailNotice("");
      setAuthError(error.message || "Email verification could not be sent. Please try again.");
      setIsEmailLoading(false);
      return;
    }

    setEmail(normalizedEmail);
    setEmailNotice("We sent a verification code to your email.");
    setStep("code");
    setIsEmailLoading(false);
  }

  async function verifyEmailCode() {
    setCodeSubmitted(true);
    setAuthError("");

    if (verificationCode.trim().length < 6 || isEmailLoading) return;

    const supabase = getSupabaseAuthClient();

    if (!supabase) {
      setAuthError("Email sign-in is not configured yet. Please add Supabase URL and anon key.");
      return;
    }

    setIsEmailLoading(true);
    const { data, error } = await supabase.auth
      .verifyOtp({
        email,
        token: verificationCode.trim(),
        type: "email"
      })
      .catch((requestError: Error) => ({ data: { session: null, user: null }, error: requestError }));

    if (error) {
      setAuthError("The verification code is incorrect or expired. Please try again.");
      setIsEmailLoading(false);
      return;
    }

    const accessToken = data.session?.access_token;

    if (!accessToken) {
      setAuthError("Email sign-in was verified, but the session could not be started. Please try again.");
      setIsEmailLoading(false);
      return;
    }

    const synced = await syncAuthenticatedUser(accessToken, "email");

    if (!synced) {
      setAuthError("Your email was verified, but your profile could not be saved. Please try again.");
      setIsEmailLoading(false);
      return;
    }

    router.push(accountPath);
  }

  async function signInWithGoogle() {
    setAuthError("");
    setEmailNotice("");

    if (isGoogleLoading) return;

    setIsGoogleLoading(true);
    const supabase = getSupabaseAuthClient();

    if (!supabase) {
      setAuthError("Google sign-in is not available yet. Please configure Supabase OAuth settings.");
      setIsGoogleLoading(false);
      return;
    }

    const redirectTo = `${getAuthRedirectOrigin()}/auth/callback?next=${encodeURIComponent(nextPath)}`;
    const { error } = await supabase.auth
      .signInWithOAuth({
        provider: googleProvider.id,
        options: {
          redirectTo,
          scopes: googleProvider.scopes,
          queryParams: {
            access_type: "offline",
            prompt: "consent"
          }
        }
      })
      .catch((requestError: Error) => ({ data: null, error: requestError }));

    if (error) {
      setAuthError(error.message || "Google sign-in could not be started. Please try again.");
      setIsGoogleLoading(false);
    }
  }

  async function syncAuthenticatedUser(accessToken: string, provider: "google" | "facebook" | "email") {
    try {
      const response = await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ provider })
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  return (
    <form
      className="w-full"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (step === "email") {
          requestEmailCode();
          return;
        }

        verifyEmailCode();
      }}
    >
      {step === "email" ? (
        <>
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={isGoogleLoading}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-line bg-white text-[16px] font-medium text-ink transition hover:border-[#078b8b] hover:bg-[#f4f6f6] focus:outline-none focus:ring-2 focus:ring-[#078b8b] focus:ring-offset-2 disabled:cursor-wait disabled:opacity-70 sm:h-14 sm:text-[18px]"
          >
            <GoogleIcon />
            <span>{isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
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
                showEmailError ? "border-[#ef3f23]" : "border-line focus-within:border-[#078b8b]"
              }`}
            >
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-graphite sm:text-[18px]"
                aria-invalid={showEmailError}
              />
              <button
                type="button"
                onClick={requestEmailCode}
                disabled={isEmailLoading}
                className="grid h-10 w-10 place-items-center text-ink transition hover:text-[#078b8b] disabled:cursor-wait disabled:opacity-60 sm:h-11 sm:w-11"
                aria-label="Continue with email"
              >
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              </button>
            </div>
            {showEmailError ? <span className="mt-2 block text-[16px] text-[#d94016]">Enter an email</span> : null}
          </label>

          <label className="mt-5 flex cursor-pointer items-center gap-3 text-[16px] text-ink sm:mt-6 sm:gap-4 sm:text-[18px]">
            <input type="checkbox" checked={emailOptIn} onChange={(event) => setEmailOptIn(event.target.checked)} className="sr-only" />
            <span className={`grid h-6 w-6 place-items-center rounded-md ${emailOptIn ? "bg-[#3bbab4] text-white" : "border border-line bg-white text-transparent"}`}>
              <Check className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>Email me with news and offers</span>
          </label>
        </>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setVerificationCode("");
              setCodeSubmitted(false);
              setAuthError("");
            }}
            className="mb-5 inline-flex items-center gap-2 text-[15px] text-graphite transition hover:text-[#078b8b]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Change email
          </button>
          <h2 className="text-[22px] font-semibold text-ink">Enter verification code</h2>
          <p className="mt-2 text-[15px] leading-6 text-graphite">We sent a code to {email}.</p>

          <label className="mt-5 block">
            <span className="sr-only">Verification code</span>
            <div
              className={`flex h-14 items-center rounded-xl border bg-white px-4 transition sm:h-[62px] ${
                showCodeError ? "border-[#ef3f23]" : "border-line focus-within:border-[#078b8b]"
              }`}
            >
              <input
                inputMode="numeric"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Verification code"
                className="h-full min-w-0 flex-1 bg-transparent text-[16px] tracking-[0.18em] text-ink outline-none placeholder:tracking-normal placeholder:text-graphite sm:text-[18px]"
                aria-invalid={showCodeError}
              />
              <button
                type="button"
                onClick={verifyEmailCode}
                disabled={isEmailLoading}
                className="grid h-10 w-10 place-items-center text-ink transition hover:text-[#078b8b] disabled:cursor-wait disabled:opacity-60 sm:h-11 sm:w-11"
                aria-label="Verify email code"
              >
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              </button>
            </div>
            {showCodeError ? <span className="mt-2 block text-[16px] text-[#d94016]">Enter the verification code</span> : null}
          </label>

          <button
            type="button"
            onClick={requestEmailCode}
            disabled={isEmailLoading}
            className="mt-5 text-[15px] text-[#078b8b] underline underline-offset-4 transition hover:text-ink disabled:cursor-wait disabled:opacity-60"
          >
            Resend code
          </button>
        </div>
      )}

      <p className="mt-8 text-center text-[15px] leading-6 text-graphite">
        By continuing, you agree to our{" "}
        <a href="/terms" className="underline underline-offset-2 hover:text-[#078b8b]">
          Terms of service
        </a>
      </p>

      {emailNotice ? <p className="mt-4 text-center text-sm leading-6 text-graphite">{emailNotice}</p> : null}
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
