import { jsPDF } from "jspdf";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleUserRound,
  CreditCard,
  Download,
  ImagePlus,
  Mail,
  ShieldCheck,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useId, useState } from "react";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  birthDate: "",
  email: "",
  team: "",
  isTransfer: false,
  previousTeam: "",
  photo: null,
  acceptsTerms: false,
};

export default function LicenseApplicationSection({ t, teams }) {
  const photoInputId = useId();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [photoPreview, setPhotoPreview] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [errors, setErrors] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [licenceReference, setLicenceReference] = useState("");

  useEffect(() => {
    if (!form.photo) {
      setPhotoPreview("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(form.photo);
    setPhotoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [form.photo]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: false }));
  };

  const updatePhoto = (event) => {
    const [photo] = event.target.files;
    if (!photo) {
      return;
    }

    setForm((currentForm) => ({ ...currentForm, photo }));
    setErrors((currentErrors) => ({ ...currentErrors, photo: false }));
  };

  const validateProfile = () => {
    const nextErrors = {
      firstName: !form.firstName.trim(),
      lastName: !form.lastName.trim(),
      birthDate: !form.birthDate,
      email: !form.email,
      photo: !form.photo,
    };
    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const validateTeam = () => {
    const nextErrors = {
      team: !form.team,
      previousTeam:
        form.isTransfer &&
        (!form.previousTeam || form.previousTeam === form.team),
      acceptsTerms: !form.acceptsTerms,
    };
    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const moveForward = () => {
    const isStepValid = step === 1 ? validateProfile() : validateTeam();
    if (isStepValid) {
      setStep((currentStep) => currentStep + 1);
    }
  };

  const submitPreview = () => {
    setLicenceReference(
      `FIFVE-2026-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    );
    setIsComplete(true);
    setIsLicenseModalOpen(true);
  };

  const reset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setStep(1);
    setPaymentMethod("paypal");
    setIsComplete(false);
    setIsLicenseModalOpen(false);
    setLicenceReference("");
  };

  const selectedTeam = teams.find((team) => team.name === form.team);
  const previousTeam = teams.find((team) => team.name === form.previousTeam);
  const licenceAmount = form.isTransfer ? t.transferAmountValue : t.amountValue;
  const steps = [t.steps.identity, t.steps.team, t.steps.payment];
  const licenceData = {
    reference: licenceReference,
    fullName: `${form.firstName} ${form.lastName}`,
    birthDate: form.birthDate,
    email: form.email,
    team: selectedTeam?.name,
    previousTeam: previousTeam?.name,
    type: form.isTransfer ? t.transferLabel : t.newLicenceLabel,
    amount: licenceAmount,
    photoUrl: photoPreview,
  };

  return (
    <section id="licence" className="px-6 pt-10">
      <div className="mx-auto max-w-7xl">
        <article className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_30px_90px_rgba(6,70,196,0.16)] ring-1 ring-white">
          <div className="relative overflow-hidden bg-linear-to-br from-[#04379a] via-[#0b61e8] to-[#087f43] px-6 py-9 text-white md:px-9 md:py-11">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.22)_25%,rgba(255,255,255,0.22)_26%,transparent_26%,transparent_75%,rgba(255,255,255,0.16)_75%,rgba(255,255,255,0.16)_76%,transparent_76%)] bg-size-[32px_32px] opacity-20" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-100 backdrop-blur-sm">
                  <ShieldCheck size={15} />
                  {t.badge}
                </p>
                <h2 className="mt-4 text-3xl font-black md:text-4xl">
                  {t.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-50 md:text-base">
                  {t.subtitle}
                </p>
              </div>
              <div className="inline-flex w-fit items-center gap-3 rounded-lg border border-white/20 bg-slate-950/15 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/15">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-100">
                    {t.amountLabel}
                  </p>
                  <p className="text-lg font-black">{licenceAmount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-px border-b border-slate-200 bg-slate-200 md:grid-cols-3">
            {steps.map((label, index) => {
              const stepNumber = index + 1;
              const isActive = step === stepNumber;
              const isDone = step > stepNumber || isComplete;

              return (
                <div
                  key={label}
                  className={`flex items-center gap-3 bg-white px-5 py-4 text-sm font-bold transition md:px-7 ${
                    isActive ? "text-[#0646c4]" : "text-slate-500"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs shadow-sm ${isDone ? "bg-[#159947] text-white" : isActive ? "bg-[#0646c4] text-white" : "bg-slate-100 text-slate-500"}`}
                  >
                    {isDone ? <Check size={15} /> : stepNumber}
                  </span>
                  {label}
                </div>
              );
            })}
          </div>

          {isComplete ? (
            <div className="px-6 py-9 md:px-8 md:py-10">
              <div className="mx-auto max-w-2xl text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-[#159947]">
                  <Check size={28} />
                </div>
                <h3 className="mt-5 text-2xl font-black text-slate-900">
                  {t.previewTitle}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
                  {t.previewDescription}
                </p>
                <div className="mt-6 border border-amber-200 bg-amber-50 p-4 text-left text-sm leading-6 text-amber-900">
                  {t.previewNotice}
                </div>
                <button
                  type="button"
                  onClick={() => setIsLicenseModalOpen(true)}
                  className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#159947] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#087f43]"
                >
                  <ShieldCheck size={17} />
                  {t.viewLicenceAction}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold text-[#0646c4] transition hover:bg-blue-50"
                >
                  {t.restartAction}
                </button>
              </div>
            </div>
          ) : (
            <div className="px-6 py-8 md:px-9 md:py-10">
              {step === 1 && (
                <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
                  <div className="border-b border-slate-200 pb-6 lg:border-r lg:border-b-0 lg:pb-0 lg:pr-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0646c4] text-white shadow-lg shadow-blue-500/25">
                      <CircleUserRound size={22} />
                    </div>
                    <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                      {t.identityTitle}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {t.identityDescription}
                    </p>
                    <p className="mt-5 inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-[#087f43]">
                      <ShieldCheck size={16} />
                      {t.privacyNote}
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label={t.firstNameLabel}
                      error={errors.firstName}
                      errorText={t.requiredError}
                    >
                      <input
                        name="firstName"
                        value={form.firstName}
                        onChange={updateField}
                        className={inputClass(errors.firstName)}
                        autoComplete="given-name"
                      />
                    </Field>
                    <Field
                      label={t.lastNameLabel}
                      error={errors.lastName}
                      errorText={t.requiredError}
                    >
                      <input
                        name="lastName"
                        value={form.lastName}
                        onChange={updateField}
                        className={inputClass(errors.lastName)}
                        autoComplete="family-name"
                      />
                    </Field>
                    <Field
                      label={t.birthDateLabel}
                      error={errors.birthDate}
                      errorText={t.requiredError}
                    >
                      <input
                        name="birthDate"
                        type="date"
                        max={new Date().toISOString().slice(0, 10)}
                        value={form.birthDate}
                        onChange={updateField}
                        className={inputClass(errors.birthDate)}
                      />
                    </Field>
                    <Field
                      label={t.emailLabel}
                      error={errors.email}
                      errorText={t.requiredError}
                    >
                      <div className="relative">
                        <Mail
                          size={17}
                          className="pointer-events-none absolute left-3 top-3.5 text-slate-400"
                        />
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={updateField}
                          className={`${inputClass(errors.email)} pl-10`}
                          autoComplete="email"
                        />
                      </div>
                    </Field>
                    <div className="sm:col-span-2">
                      <p className="text-sm font-bold text-slate-800">
                        {t.photoLabel}
                      </p>
                      <label
                        htmlFor={photoInputId}
                        className={`mt-2 flex min-h-32 cursor-pointer items-center gap-4 rounded-lg border-2 border-dashed p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#0646c4] hover:bg-blue-50 hover:shadow-md ${errors.photo ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"}`}
                      >
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt=""
                            className="h-22 w-18 rounded-md border border-white object-cover shadow-sm"
                          />
                        ) : (
                          <div className="flex h-22 w-18 shrink-0 items-center justify-center rounded-md bg-white text-[#0646c4] shadow-sm">
                            <ImagePlus size={24} />
                          </div>
                        )}
                        <span>
                          <span className="block text-sm font-bold text-slate-900">
                            {photoPreview ? t.photoReplace : t.photoAction}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">
                            {t.photoHint}
                          </span>
                        </span>
                        <input
                          id={photoInputId}
                          type="file"
                          accept="image/jpeg,image/png"
                          onChange={updatePhoto}
                          className="sr-only"
                        />
                      </label>
                      {errors.photo && (
                        <p className="mt-2 text-xs font-medium text-red-700">
                          {t.requiredError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="mx-auto max-w-3xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#159947] text-white shadow-lg shadow-emerald-500/20">
                    <UsersRound size={22} />
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                    {t.teamTitle}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {t.teamDescription}
                  </p>
                  <Field
                    label={t.teamLabel}
                    error={errors.team}
                    errorText={t.requiredError}
                    className="mt-6"
                  >
                    <select
                      name="team"
                      value={form.team}
                      onChange={updateField}
                      className={inputClass(errors.team)}
                    >
                      <option value="">{t.teamPlaceholder}</option>
                      {teams.map((team) => (
                        <option key={team.name} value={team.name}>
                          {team.name} - {team.country}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <fieldset className="mt-6">
                    <legend className="text-sm font-bold text-slate-800">
                      {t.licenceTypeLabel}
                    </legend>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2">
                      <label
                        className={`cursor-pointer rounded-lg border p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${!form.isTransfer ? "border-[#0646c4] bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white hover:border-blue-200"}`}
                      >
                        <input
                          name="isTransfer"
                          type="radio"
                          checked={!form.isTransfer}
                          onChange={() =>
                            setForm((currentForm) => ({
                              ...currentForm,
                              isTransfer: false,
                              previousTeam: "",
                            }))
                          }
                          className="sr-only"
                        />
                        <span className="block text-sm font-extrabold text-slate-900">
                          {t.newLicenceLabel}
                        </span>
                        <span className="mt-1 block text-sm text-slate-600">
                          {t.newLicenceDescription}
                        </span>
                      </label>
                      <label
                        className={`cursor-pointer rounded-lg border p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${form.isTransfer ? "border-[#0646c4] bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white hover:border-blue-200"}`}
                      >
                        <input
                          name="isTransfer"
                          type="radio"
                          checked={form.isTransfer}
                          onChange={() =>
                            setForm((currentForm) => ({
                              ...currentForm,
                              isTransfer: true,
                            }))
                          }
                          className="sr-only"
                        />
                        <span className="block text-sm font-extrabold text-slate-900">
                          {t.transferLabel}
                        </span>
                        <span className="mt-1 block text-sm text-slate-600">
                          {t.transferDescription}
                        </span>
                      </label>
                    </div>
                  </fieldset>
                  {form.isTransfer && (
                    <Field
                      label={t.previousTeamLabel}
                      error={errors.previousTeam}
                      errorText={t.previousTeamError}
                      className="mt-5"
                    >
                      <select
                        name="previousTeam"
                        value={form.previousTeam}
                        onChange={updateField}
                        className={inputClass(errors.previousTeam)}
                      >
                        <option value="">{t.previousTeamPlaceholder}</option>
                        {teams
                          .filter((team) => team.name !== form.team)
                          .map((team) => (
                            <option key={team.name} value={team.name}>
                              {team.name} - {team.country}
                            </option>
                          ))}
                      </select>
                    </Field>
                  )}
                  <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/40">
                    <input
                      name="acceptsTerms"
                      type="checkbox"
                      checked={form.acceptsTerms}
                      onChange={updateField}
                      className="mt-0.5 h-5 w-5 accent-[#159947]"
                    />
                    <span>{t.consentLabel}</span>
                  </label>
                  {errors.acceptsTerms && (
                    <p className="mt-2 text-xs font-medium text-red-700">
                      {t.consentError}
                    </p>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-7 lg:grid-cols-[1fr_0.8fr]">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-800 shadow-lg shadow-amber-500/10">
                      <CreditCard size={22} />
                    </div>
                    <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                      {t.paymentTitle}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {t.paymentDescription}
                    </p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("paypal")}
                        className={`cursor-pointer rounded-lg border p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${paymentMethod === "paypal" ? "border-[#0646c4] bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white hover:border-blue-200"}`}
                        aria-pressed={paymentMethod === "paypal"}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="text-lg font-black text-[#003087]">
                            Pay<span className="text-[#009cde]">Pal</span>
                          </span>
                          {paymentMethod === "paypal" && (
                            <Check size={18} className="text-[#0646c4]" />
                          )}
                        </span>
                        <span className="mt-2 block text-sm font-medium text-slate-600">
                          {t.paypalDescription}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`cursor-pointer rounded-lg border p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${paymentMethod === "card" ? "border-[#0646c4] bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white hover:border-blue-200"}`}
                        aria-pressed={paymentMethod === "card"}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-900">
                            <CreditCard size={20} className="text-[#0646c4]" />
                            {t.cardLabel}
                          </span>
                          {paymentMethod === "card" && (
                            <Check size={18} className="text-[#0646c4]" />
                          )}
                        </span>
                        <span className="mt-2 block text-sm font-medium text-slate-600">
                          {t.cardDescription}
                        </span>
                      </button>
                    </div>
                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        {t.paymentMethodLabel}
                      </p>
                      <p className="mt-2 inline-flex items-center gap-2 font-bold text-slate-900">
                        <CreditCard size={18} className="text-[#0646c4]" />
                        {paymentMethod === "paypal"
                          ? t.paypalLabel
                          : t.cardLabel}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {t.paymentFutureNote}
                      </p>
                    </div>
                  </div>
                  <aside className="rounded-lg border border-blue-100 bg-linear-to-b from-[#f2f7ff] to-white p-5 shadow-sm lg:sticky lg:top-28 lg:self-start">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#0646c4]">
                      {t.summaryLabel}
                    </p>
                    <dl className="mt-4 space-y-3 text-sm">
                      <SummaryRow
                        label={t.playerLabel}
                        value={`${form.firstName} ${form.lastName}`}
                      />
                      <SummaryRow
                        label={t.teamLabel}
                        value={selectedTeam?.name}
                      />
                      {form.isTransfer && (
                        <SummaryRow
                          label={t.previousTeamLabel}
                          value={previousTeam?.name}
                        />
                      )}
                      <SummaryRow label={t.emailLabel} value={form.email} />
                      <SummaryRow
                        label={t.paymentMethodLabel}
                        value={
                          paymentMethod === "paypal"
                            ? t.paypalLabel
                            : t.cardLabel
                        }
                      />
                      <SummaryRow label={t.amountLabel} value={licenceAmount} />
                    </dl>
                  </aside>
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((currentStep) => currentStep - 1)}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <ArrowLeft size={16} />
                    {t.backAction}
                  </button>
                ) : (
                  <span />
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={moveForward}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0646c4] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:bg-[#04379a] hover:shadow-xl"
                  >
                    {t.continueAction}
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submitPreview}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#159947] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:bg-[#087f43] hover:shadow-xl"
                  >
                    <CreditCard size={16} />
                    {t.paymentAction}
                  </button>
                )}
              </div>
            </div>
          )}
        </article>
      </div>
      {isLicenseModalOpen && (
        <LicenseModal
          data={licenceData}
          t={t}
          onClose={() => setIsLicenseModalOpen(false)}
        />
      )}
    </section>
  );
}

function LicenseModal({ data, t, onClose }) {
  const downloadLicence = async () => {
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const logo = await toDataUrl("/images/logo_fifve.jpeg");
    const barcode = createBarcode(data.reference);
    const qrCode = createQrCode(data.reference);

    pdf.setFillColor(6, 70, 196);
    pdf.rect(0, 0, 210, 46, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(19);
    pdf.text("FIFVE", 22, 22);
    pdf.setFontSize(10);
    pdf.text(t.pdfTitle, 22, 30);
    if (logo) {
      pdf.addImage(logo, "JPEG", 160, 10, 28, 28);
    }
    if (data.photoUrl) {
      pdf.addImage(
        data.photoUrl,
        data.photoUrl.startsWith("data:image/png") ? "PNG" : "JPEG",
        22,
        58,
        40,
        50,
      );
    }

    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(16);
    pdf.text(data.fullName.toUpperCase(), 76, 68);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    const details = [
      [t.birthDateLabel, formatDate(data.birthDate)],
      [t.teamLabel, data.team],
      [t.licenceTypeLabel, data.type],
      [t.licenceNumberLabel, data.reference],
      [t.statusLabel, t.statusValue],
    ];
    details.forEach(([label, value], index) => {
      const y = 82 + index * 9;
      pdf.setTextColor(100, 116, 139);
      pdf.text(`${label}:`, 76, y);
      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      pdf.text(String(value || "-"), 118, y);
      pdf.setFont("helvetica", "normal");
    });
    pdf.setDrawColor(219, 234, 254);
    pdf.line(22, 122, 188, 122);
    pdf.addImage(barcode, "PNG", 22, 132, 104, 25);
    pdf.addImage(qrCode, "PNG", 144, 128, 38, 38);
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(8);
    pdf.text(t.pdfControlHint, 22, 170);
    pdf.save(`licence-${data.reference}.pdf`);
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t.modalLicenceTitle}
    >
      <div className="max-h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-[#0646c4] px-5 py-4 text-white sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
              {t.demoLabel}
            </p>
            <h3 className="mt-1 text-lg font-black">{t.modalLicenceTitle}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex cursor-pointer p-2 transition hover:bg-white/10"
            aria-label={t.closeLicenceAction}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 sm:p-7">
          <div className="overflow-hidden border border-blue-100 bg-[#f7fbff] shadow-lg">
            <div className="flex items-center justify-between bg-[#0646c4] px-5 py-4 text-white">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-blue-200">
                  FIFVE 2026
                </p>
                <p className="mt-1 text-lg font-black">{t.pdfTitle}</p>
              </div>
              <img
                src="/images/logo_fifve.jpeg"
                alt="FIFVE"
                className="h-12 w-12 rounded-full bg-white p-1 object-contain"
              />
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-[108px_1fr]">
              <img
                src={data.photoUrl}
                alt=""
                className="h-36 w-28 border border-slate-200 object-cover"
              />
              <div>
                <p className="text-xl font-black text-slate-900">
                  {data.fullName}
                </p>
                <p className="mt-1 text-sm text-slate-600">{data.team}</p>
                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <ModalDetail
                    label={t.birthDateLabel}
                    value={formatDate(data.birthDate)}
                  />
                  <ModalDetail label={t.licenceTypeLabel} value={data.type} />
                  <ModalDetail
                    label={t.licenceNumberLabel}
                    value={data.reference}
                  />
                  <ModalDetail label={t.statusLabel} value={t.statusValue} />
                </dl>
              </div>
            </div>
            <div className="border-t border-blue-100 bg-white px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {t.licenceNumberLabel}
              </p>
              <p className="mt-1 font-mono text-sm font-bold text-slate-900">
                {data.reference}
              </p>
              <div
                className="mt-3 h-10"
                style={{
                  backgroundImage: `url(${createBarcode(data.reference)})`,
                  backgroundSize: "auto 100%",
                }}
              />
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">
            {t.modalLicenceDescription}
          </p>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              {t.closeLicenceAction}
            </button>
            <button
              type="button"
              onClick={downloadLicence}
              className="inline-flex cursor-pointer items-center justify-center gap-2 bg-[#0646c4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#04379a]"
            >
              <Download size={17} />
              {t.downloadLicenceAction}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalDetail({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 font-semibold text-slate-800">{value}</dd>
    </div>
  );
}

function formatDate(value) {
  return value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("fr-FR")
    : "-";
}

async function toDataUrl(url) {
  const response = await fetch(url);
  if (!response.ok) return "";
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

function createBarcode(value) {
  const canvas = document.createElement("canvas");
  canvas.width = 480;
  canvas.height = 96;
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  [...value].forEach((character, index) => {
    const code = character.charCodeAt(0);
    const x = index * 15 + 8;
    const width = 2 + (code % 4);
    context.fillStyle = "#0f172a";
    context.fillRect(x, 0, width, 74);
    context.fillRect(x + width + 2, 0, 1 + ((code >> 2) % 3), 74);
  });
  context.font = "14px monospace";
  context.fillText(value, 8, 91);
  return canvas.toDataURL("image/png");
}

function createQrCode(value) {
  const size = 29;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  const seed = [...value].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const finder = (x < 7 && y < 7) || (x > 21 && y < 7) || (x < 7 && y > 21);
      const isDark = finder
        ? x % 6 === 0 || y % 6 === 0 || (x > 1 && x < 5 && y > 1 && y < 5)
        : (x * 17 + y * 31 + seed) % 5 < 2;
      context.fillStyle = isDark ? "#0f172a" : "#ffffff";
      context.fillRect(x, y, 1, 1);
    }
  }
  return canvas.toDataURL("image/png");
}

function Field({ label, error, errorText, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-bold text-slate-800">{label}</span>
      {children}
      {error && (
        <span className="mt-2 block text-xs font-medium text-red-700">
          {error === true ? errorText : error}
        </span>
      )}
    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-bold text-slate-900">{value}</dd>
    </div>
  );
}

function inputClass(hasError) {
  return `mt-2 w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#0646c4] focus:ring-4 focus:ring-blue-100 ${hasError ? "border-red-400" : "border-slate-300 hover:border-blue-300"}`;
}
