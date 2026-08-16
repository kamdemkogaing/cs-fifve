import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

export default function LoginPage({ language, setLanguage, t }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#f4f8ff] via-[#eef5ff] to-[#e8f5ee] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#0b61e8]/12 blur-3xl" />
        <div className="absolute -right-16 -top-8 h-80 w-80 rounded-full bg-cyan-300/18 blur-3xl" />
        <div className="absolute -bottom-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-300/14 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <header className="rounded-[28px] border border-white/70 bg-white/70 px-4 py-4 shadow-[0_20px_60px_rgba(6,70,196,0.12)] backdrop-blur-xl sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="/"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#0646c4]/15 bg-[#0646c4]/8 text-[#0646c4] transition hover:bg-[#0646c4]/12"
                aria-label={t.backToHome}
              >
                <ArrowLeft size={18} />
              </a>

              <div className="flex min-w-0 items-center gap-3">
                <img
                  src="/images/logo_fifve.jpeg"
                  alt="Logo FIFVE"
                  className="h-14 w-14 rounded-full bg-white object-contain p-1.5 shadow-md sm:h-16 sm:w-16"
                />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0646c4] sm:text-xs">
                    FIFVE 2026
                  </p>
                  <h1 className="text-base font-extrabold sm:text-lg">
                    {t.brandTitle}
                  </h1>
                  <p className="text-xs text-slate-600 sm:text-sm">
                    {t.brandSubtitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 self-start rounded-full border border-slate-200 bg-white p-1 shadow-sm sm:self-auto">
              <button
                type="button"
                onClick={() => setLanguage("fr")}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition sm:px-4 ${
                  language === "fr"
                    ? "bg-[#0646c4] text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
                aria-pressed={language === "fr"}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition sm:px-4 ${
                  language === "en"
                    ? "bg-[#0646c4] text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
                aria-pressed={language === "en"}
              >
                EN
              </button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center py-8 sm:py-10 lg:py-12">
          <div className="w-full max-w-2xl">
            <section className="login-card-enter rounded-4xl border border-white/70 bg-white/78 p-3 shadow-[0_35px_100px_rgba(15,23,42,0.14)] backdrop-blur-2xl sm:p-4 lg:p-5">
              <div className="login-surface-glow relative overflow-hidden rounded-[30px] bg-linear-to-br from-[#03163f] via-[#0a2f7f] to-[#0d56d7] p-6 text-white shadow-[0_28px_90px_rgba(3,22,63,0.45)] sm:p-8">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent" />
                  <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-cyan-300/18 blur-3xl" />
                  <div className="absolute -left-10 bottom-8 h-28 w-28 rounded-full bg-emerald-300/12 blur-3xl" />
                </div>

                <div className="login-content-enter relative flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-white/20 bg-white/12 p-3.5 shadow-lg backdrop-blur-md">
                      <LockKeyhole size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100/90">
                        {t.formBadge}
                      </p>
                      <h3 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-[2rem]">
                        {t.formTitle}
                      </h3>
                    </div>
                  </div>
                  <div className="hidden items-center gap-2 rounded-full border border-white/18 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-50/95 shadow-sm backdrop-blur-md sm:inline-flex">
                    <ShieldCheck size={14} />
                    <span>FIFVE</span>
                  </div>
                </div>

                <p className="login-content-enter relative mt-4 max-w-xl text-sm leading-7 text-blue-50/88 sm:text-[15px]">
                  {t.formDescription}
                </p>

                <form
                  className="login-content-enter relative mt-7 space-y-5"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <div className="rounded-[26px] border border-white/14 bg-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md sm:p-5">
                    <div className="space-y-4">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-blue-50">
                          {t.emailLabel}
                        </span>
                        <div className="login-field-shell login-focus-line group relative">
                          <span className="login-field-icon pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-100/70 transition group-focus-within:text-cyan-200">
                            <Mail size={18} />
                          </span>
                          <input
                            type="email"
                            placeholder={t.emailPlaceholder}
                            className="login-input w-full rounded-2xl border border-white/12 bg-slate-950/18 px-4 py-3.5 pl-11 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none transition placeholder:text-blue-100/60 focus:border-cyan-300 focus:bg-slate-950/26 focus:ring-4 focus:ring-cyan-300/12"
                          />
                        </div>
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-blue-50">
                          {t.passwordLabel}
                        </span>
                        <div className="login-field-shell login-focus-line group relative">
                          <span className="login-field-icon pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-100/70 transition group-focus-within:text-cyan-200">
                            <LockKeyhole size={18} />
                          </span>
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder={t.passwordPlaceholder}
                            className="login-input w-full rounded-2xl border border-white/12 bg-slate-950/18 px-4 py-3.5 pl-11 pr-13 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none transition placeholder:text-blue-100/60 focus:border-cyan-300 focus:bg-slate-950/26 focus:ring-4 focus:ring-cyan-300/12"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((current) => !current)
                            }
                            className="login-eye-toggle absolute inset-y-1.5 right-1.5 inline-flex w-11 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-blue-100/80 transition hover:bg-white/14 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                            aria-label={
                              showPassword
                                ? t.hidePasswordAction
                                : t.showPasswordAction
                            }
                            aria-pressed={showPassword}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <label className="inline-flex items-center gap-2.5 text-sm text-blue-50/90">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/30 bg-white/10 text-cyan-300 accent-cyan-300"
                      />
                      {t.rememberMe}
                    </label>
                    <a
                      href="#"
                      className="text-sm font-semibold text-cyan-200 transition hover:text-white hover:underline hover:underline-offset-4"
                    >
                      {t.forgotPassword}
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="login-submit-button mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-white via-[#f4f8ff] to-[#dff4ff] px-4 py-4 text-sm font-extrabold text-[#0646c4] shadow-[0_18px_40px_rgba(8,145,178,0.24)] transition hover:-translate-y-0.5 hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-cyan-300/28"
                  >
                    <span className="relative z-10">{t.loginAction}</span>
                  </button>
                </form>

                <div className="login-content-enter relative mt-5 rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-center backdrop-blur-sm">
                  <p className="text-xs leading-6 text-blue-100/85">
                    {t.demoNotice}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
