import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  Download,
  Eye,
  EyeOff,
  FileText,
  History,
  ListChecks,
  LockKeyhole,
  LogOut,
  NotebookPen,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ACCESS_STORAGE_KEY = "fifve-team-space-unlocked";
const TODO_STORAGE_KEY = "fifve-team-space-todos";
const REPORT_DATABASE = "fifve-team-space";
const REPORT_STORE = "reports";
const TODO_STATUSES = ["open", "in_progress", "done"];

function createId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
}

function readTodos(defaultTodos) {
  try {
    const savedTodos = window.localStorage.getItem(TODO_STORAGE_KEY);
    const parsedTodos = savedTodos ? JSON.parse(savedTodos) : defaultTodos;

    if (!Array.isArray(parsedTodos)) {
      return defaultTodos;
    }

    return parsedTodos.map((todo) => ({
      ...todo,
      status: TODO_STATUSES.includes(todo.status)
        ? todo.status
        : todo.done
          ? "done"
          : "open",
      owner: todo.owner || "",
      description: todo.description || "",
      dueDate: todo.dueDate || "",
      steps: Array.isArray(todo.steps) ? todo.steps : [],
      history: Array.isArray(todo.history) ? todo.history : [],
    }));
  } catch {
    return defaultTodos;
  }
}

function openReportDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }

    const request = window.indexedDB.open(REPORT_DATABASE, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(REPORT_STORE)) {
        database.createObjectStore(REPORT_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function listSavedReports() {
  const database = await openReportDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(REPORT_STORE, "readonly");
    const request = transaction.objectStore(REPORT_STORE).getAll();
    request.onsuccess = () => {
      resolve(
        request.result.sort(
          (first, second) =>
            new Date(second.uploadedAt).getTime() -
            new Date(first.uploadedAt).getTime(),
        ),
      );
    };
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
  });
}

async function saveReport(report) {
  const database = await openReportDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(REPORT_STORE, "readwrite");
    transaction.objectStore(REPORT_STORE).put(report);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
  });
}

async function removeSavedReport(id) {
  const database = await openReportDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(REPORT_STORE, "readwrite");
    transaction.objectStore(REPORT_STORE).delete(id);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
  });
}

function escapeCsvValue(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.position = "fixed";
  link.style.left = "-10000px";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}

function formatDateTime(value, language) {
  return new Date(value).toLocaleString(language === "en" ? "en-GB" : "fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getHistoryDescription(event, t) {
  if (event.type === "created") {
    return `${t.historyCreated}${event.owner ? ` · ${event.owner}` : ""}`;
  }
  if (event.type === "status") {
    return `${t.historyStatus}: ${t.statuses[event.from]} → ${t.statuses[event.to]}${event.owner ? ` · ${event.owner}` : ""}`;
  }
  if (event.type === "owner") {
    return `${t.historyOwner}: ${event.from || t.unassigned} → ${event.to || t.unassigned}`;
  }
  if (event.type === "title") {
    return `${t.historyTitle}: ${event.from} → ${event.to}`;
  }
  if (event.type === "step_added") {
    return `${t.historyStepAdded}: ${event.text}`;
  }
  if (event.type === "step_completed") {
    return `${event.done ? t.historyStepCompleted : t.historyStepReopened}: ${event.text}`;
  }
  if (event.type === "details") {
    return t.historyDetailsUpdated;
  }
  return event.message || "";
}

export default function TeamWorkspaceSection({ t, language = "fr" }) {
  const [isUnlocked, setIsUnlocked] = useState(
    () => window.localStorage.getItem(ACCESS_STORAGE_KEY) === "true",
  );
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState("reports");
  const [todos, setTodos] = useState(() => readTodos(t.todos));
  const [isCreatingTodo, setIsCreatingTodo] = useState(false);
  const [expandedTodos, setExpandedTodos] = useState(() => new Set());
  const [stepDrafts, setStepDrafts] = useState({});
  const [uploadedReports, setUploadedReports] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [storageError, setStorageError] = useState(false);
  const fileInputRef = useRef(null);
  const [newTodo, setNewTodo] = useState({
    label: "",
    owner: "",
    description: "",
    dueDate: "",
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [todos]);

  useEffect(() => {
    if (!isUnlocked) {
      return undefined;
    }

    let isCurrent = true;
    listSavedReports()
      .then((reports) => {
        if (isCurrent) {
          setUploadedReports(reports);
          setReportError("");
        }
      })
      .catch(() => {
        if (isCurrent) {
          setReportError(t.reportStorageError);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [isUnlocked, t.reportStorageError]);

  const unlock = (event) => {
    event.preventDefault();
    const teamPassword = import.meta.env.VITE_TEAM_SPACE_PASSWORD || "cs-fifve";

    if (password === teamPassword) {
      window.localStorage.setItem(ACCESS_STORAGE_KEY, "true");
      setIsUnlocked(true);
      setHasError(false);
      setPassword("");
      return;
    }

    setHasError(true);
  };

  const lock = () => {
    window.localStorage.removeItem(ACCESS_STORAGE_KEY);
    setIsUnlocked(false);
    setPassword("");
  };

  const updateTodo = (todoId, update) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId ? { ...todo, ...update } : todo,
      ),
    );
  };

  const updateStatus = (todo, nextStatus) => {
    if (todo.status === nextStatus) {
      return;
    }

    const event = {
      id: createId(),
      type: "status",
      from: todo.status,
      to: nextStatus,
      owner: todo.owner,
      at: new Date().toISOString(),
    };
    updateTodo(todo.id, {
      status: nextStatus,
      done: nextStatus === "done",
      history: [...todo.history, event],
      updatedAt: event.at,
    });
  };

  const addTodo = (event) => {
    event.preventDefault();
    const now = new Date().toISOString();
    const todo = {
      ...newTodo,
      id: createId(),
      status: "open",
      done: false,
      steps: [],
      history: [
        {
          id: createId(),
          type: "created",
          owner: newTodo.owner.trim(),
          at: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    setTodos((currentTodos) => [todo, ...currentTodos]);
    setNewTodo({ label: "", owner: "", description: "", dueDate: "" });
    setIsCreatingTodo(false);
    setExpandedTodos((current) => new Set(current).add(todo.id));
  };

  const saveTodoDetails = (todo, event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const label = String(formData.get("label") || "").trim();
    const owner = String(formData.get("owner") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const dueDate = String(formData.get("dueDate") || "");
    const history = [...todo.history];
    const now = new Date().toISOString();

    if (todo.label !== label) {
      history.push({
        id: createId(),
        type: "title",
        from: todo.label,
        to: label,
        at: now,
      });
    }
    if (todo.owner !== owner) {
      history.push({
        id: createId(),
        type: "owner",
        from: todo.owner,
        to: owner,
        at: now,
      });
    }
    if (todo.description !== description || todo.dueDate !== dueDate) {
      history.push({ id: createId(), type: "details", at: now });
    }

    updateTodo(todo.id, {
      owner,
      description,
      dueDate,
      history,
      updatedAt: now,
    });
  };

  const addStep = (todo) => {
    const text = (stepDrafts[todo.id] || "").trim();
    if (!text) {
      return;
    }

    const now = new Date().toISOString();
    updateTodo(todo.id, {
      label,
      steps: [...todo.steps, { id: createId(), text, done: false }],
      history: [
        ...todo.history,
        { id: createId(), type: "step_added", text, at: now },
      ],
      updatedAt: now,
    });
    setStepDrafts((current) => ({ ...current, [todo.id]: "" }));
  };

  const toggleStep = (todo, step) => {
    const now = new Date().toISOString();
    const done = !step.done;
    updateTodo(todo.id, {
      steps: todo.steps.map((item) =>
        item.id === step.id ? { ...item, done } : item,
      ),
      history: [
        ...todo.history,
        {
          id: createId(),
          type: "step_completed",
          text: step.text,
          done,
          at: now,
        },
      ],
      updatedAt: now,
    });
  };

  const exportTodos = () => {
    const headers = [
      t.exportTask,
      t.ownerLabel,
      t.statusLabel,
      t.dueDateLabel,
      t.descriptionLabel,
      t.stepsLabel,
      t.historyLabel,
    ];
    const rows = todos.map((todo) => [
      todo.label,
      todo.owner || t.unassigned,
      t.statuses[todo.status],
      todo.dueDate,
      todo.description,
      todo.steps
        .map((step) => `${step.done ? "[x]" : "[ ]"} ${step.text}`)
        .join("\n"),
      todo.history
        .map(
          (event) =>
            `${formatDateTime(event.at, language)} — ${getHistoryDescription(event, t)}`,
        )
        .join("\n"),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(";"))
      .join("\r\n");
    downloadBlob(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
      `fifve-todos-${new Date().toISOString().slice(0, 10)}.csv`,
    );
  };

  const uploadReports = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }

    setIsUploading(true);
    setReportError("");
    try {
      const uploadedAt = new Date().toISOString();
      for (const file of files) {
        await saveReport({
          id: createId(),
          title: file.name,
          filename: file.name,
          fileType: file.type,
          size: file.size,
          uploadedAt,
          blob: file,
        });
      }
      setUploadedReports(await listSavedReports());
    } catch {
      setReportError(t.reportUploadError);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const downloadReport = (report) => {
    downloadBlob(report.blob, report.filename);
  };

  const deleteReport = async (reportId) => {
    try {
      await removeSavedReport(reportId);
      setUploadedReports((currentReports) =>
        currentReports.filter((report) => report.id !== reportId),
      );
      setReportError("");
    } catch {
      setReportError(t.reportDeleteError);
    }
  };

  const completedCount = todos.filter((todo) => todo.status === "done").length;
  const tabs = [
    { id: "reports", label: t.reportsLabel, icon: FileText },
    { id: "notes", label: t.notesLabel, icon: NotebookPen },
    { id: "todos", label: t.todosLabel, icon: ClipboardList },
  ];

  return (
    <section id="espace-equipe" className="px-6 pt-8">
      <div className="mx-auto max-w-7xl">
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
          <div className="border-b border-slate-200 bg-[#082c62] px-6 py-7 text-white md:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                  <ShieldCheck size={15} />
                  {t.badge}
                </p>
                <h2 className="mt-3 text-2xl font-black md:text-3xl">
                  {t.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-blue-100 md:text-base">
                  {t.subtitle}
                </p>
              </div>
              {isUnlocked && (
                <button
                  type="button"
                  onClick={lock}
                  className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/25 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <LogOut size={16} />
                  {t.lockAction}
                </button>
              )}
            </div>
          </div>

          {!isUnlocked ? (
            <div className="grid gap-7 px-6 py-7 md:grid-cols-[1fr_1.15fr] md:px-8 md:py-9">
              <div className="border-b border-slate-200 pb-6 md:border-r md:border-b-0 md:pb-0 md:pr-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <LockKeyhole size={21} />
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                  {t.lockedTitle}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                  {t.lockedDescription}
                </p>
                <p className="mt-5 text-xs font-semibold text-slate-500">
                  {t.passwordHint}
                </p>
              </div>

              <form onSubmit={unlock} className="self-center">
                <label
                  htmlFor="team-password"
                  className="text-sm font-bold text-slate-800"
                >
                  {t.passwordLabel}
                </label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <div className="relative min-w-0 flex-1">
                    <input
                      id="team-password"
                      type={isPasswordVisible ? "text" : "password"}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setHasError(false);
                      }}
                      className={`w-full rounded-lg border bg-white px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-[#0646c4] focus:ring-4 focus:ring-blue-100 ${
                        hasError ? "border-red-400" : "border-slate-300"
                      }`}
                      autoComplete="current-password"
                      aria-describedby={
                        hasError ? "team-password-error" : undefined
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setIsPasswordVisible((visible) => !visible)
                      }
                      className="absolute inset-y-0 right-0 inline-flex w-12 cursor-pointer items-center justify-center text-slate-500 transition hover:text-[#0646c4] focus:outline-none"
                      aria-label={
                        isPasswordVisible
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                      aria-pressed={isPasswordVisible}
                    >
                      {isPasswordVisible ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0646c4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#04379a]"
                  >
                    <LockKeyhole size={16} />
                    {t.unlockAction}
                  </button>
                </div>
                {hasError && (
                  <p
                    id="team-password-error"
                    className="mt-2 text-sm font-medium text-red-700"
                  >
                    {t.passwordError}
                  </p>
                )}
              </form>
            </div>
          ) : (
            <div>
              <div className="flex overflow-x-auto border-b border-slate-200 px-4 md:px-8">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`inline-flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-4 py-4 text-sm font-bold transition ${
                      activeTab === id
                        ? "border-[#0646c4] text-[#0646c4]"
                        : "border-transparent text-slate-500 hover:text-slate-900"
                    }`}
                    aria-pressed={activeTab === id}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>

              <div className="px-6 py-7 md:px-8 md:py-8">
                <div
                  role="status"
                  className="mb-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900"
                >
                  <ShieldCheck
                    size={17}
                    className="mt-0.5 shrink-0 text-amber-700"
                  />
                  <p>{t.localStorageNotice}</p>
                </div>
                {activeTab === "reports" && (
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-white p-2.5 text-[#0646c4] shadow-sm">
                          <Upload size={19} />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900">
                            {t.uploadReportTitle}
                          </h3>
                          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                            {t.uploadReportDescription}
                          </p>
                        </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.odt,.ods"
                        onChange={uploadReports}
                        className="sr-only"
                        aria-label={t.uploadReportAction}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0646c4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#04379a] disabled:cursor-wait disabled:opacity-60"
                      >
                        <Upload size={16} />
                        {isUploading ? t.uploading : t.uploadReportAction}
                      </button>
                    </div>

                    {reportError && (
                      <p
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                      >
                        {reportError}
                      </p>
                    )}

                    <div>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h3 className="text-lg font-extrabold text-slate-900">
                          {t.savedUploadsTitle}
                        </h3>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                          {uploadedReports.length} {t.uploadsCount}
                        </span>
                      </div>
                      {uploadedReports.length ? (
                        <div className="mb-6 grid gap-4 sm:grid-cols-2">
                          {uploadedReports.map((report) => (
                            <article
                              key={report.id}
                              className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4"
                            >
                              <FileText
                                size={19}
                                className="mt-1 shrink-0 text-[#0646c4]"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="break-words font-bold text-slate-900">
                                  {report.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {formatDateTime(report.uploadedAt, language)}
                                  {" · "}
                                  {(report.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => downloadReport(report)}
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-[#0646c4] hover:bg-blue-50"
                                  >
                                    <Download size={14} />
                                    {t.downloadReportAction}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteReport(report.id)}
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 size={14} />
                                    {t.deleteAction}
                                  </button>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <p className="mb-6 rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
                          {t.noUploadedReports}
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="mb-4 text-lg font-extrabold text-slate-900">
                        {t.previousReportsTitle}
                      </h3>
                      <div className="grid gap-4 lg:grid-cols-2">
                        {t.reports.map((report) => (
                          <article
                            key={`${report.date}-${report.title}`}
                            className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-[#159947]">
                                  {report.date}
                                </p>
                                <h4 className="mt-2 text-lg font-extrabold text-slate-900">
                                  {report.title}
                                </h4>
                              </div>
                              <FileText
                                size={20}
                                className="shrink-0 text-[#0646c4]"
                              />
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                              {report.summary}
                            </p>
                            {report.href && (
                              <a
                                href={report.href}
                                download={report.filename || true}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-[#0646c4]/20 bg-white px-3 py-2 text-sm font-bold text-[#0646c4] transition hover:bg-blue-50"
                              >
                                <FileText size={16} />
                                {report.filename || t.downloadReportAction}
                              </a>
                            )}
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notes" && (
                  <div className="grid gap-4 lg:grid-cols-3">
                    {t.notes.map((note) => (
                      <article
                        key={note.title}
                        className="rounded-xl border-l-4 border-[#f0b429] bg-amber-50 p-5"
                      >
                        <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
                          {note.category}
                        </p>
                        <h3 className="mt-2 text-base font-extrabold text-slate-900">
                          {note.title}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-slate-700">
                          {note.text}
                        </p>
                      </article>
                    ))}
                  </div>
                )}

                {activeTab === "todos" && (
                  <div>
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900">
                          {t.todosTitle}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {t.todosDescription}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-800">
                          {completedCount}/{todos.length} {t.completedLabel}
                        </span>
                        <button
                          type="button"
                          onClick={exportTodos}
                          disabled={!todos.length}
                          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-[#0646c4] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Download size={16} />
                          {t.exportTodosAction}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCreatingTodo((creating) => !creating)}
                          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0646c4] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#04379a]"
                        >
                          <Plus size={16} />
                          {t.addTodoAction}
                        </button>
                      </div>
                    </div>

                    {storageError && (
                      <p
                        role="alert"
                        className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                      >
                        {t.todoStorageError}
                      </p>
                    )}

                    {isCreatingTodo && (
                      <form
                        onSubmit={addTodo}
                        className="mb-6 rounded-2xl border border-blue-200 bg-blue-50/50 p-5"
                      >
                        <h4 className="mb-4 font-extrabold text-slate-900">
                          {t.newTodoTitle}
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <label className="text-sm font-bold text-slate-700">
                            {t.todoTaskLabel}
                            <input
                              required
                              value={newTodo.label}
                              onChange={(event) =>
                                setNewTodo((current) => ({
                                  ...current,
                                  label: event.target.value,
                                }))
                              }
                              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          </label>
                          <label className="text-sm font-bold text-slate-700">
                            {t.ownerLabel}
                            <input
                              required
                              value={newTodo.owner}
                              onChange={(event) =>
                                setNewTodo((current) => ({
                                  ...current,
                                  owner: event.target.value,
                                }))
                              }
                              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          </label>
                          <label className="text-sm font-bold text-slate-700">
                            {t.dueDateLabel}
                            <input
                              type="date"
                              value={newTodo.dueDate}
                              onChange={(event) =>
                                setNewTodo((current) => ({
                                  ...current,
                                  dueDate: event.target.value,
                                }))
                              }
                              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          </label>
                          <label className="text-sm font-bold text-slate-700 md:col-span-2">
                            {t.descriptionLabel}
                            <textarea
                              rows="2"
                              value={newTodo.description}
                              onChange={(event) =>
                                setNewTodo((current) => ({
                                  ...current,
                                  description: event.target.value,
                                }))
                              }
                              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          </label>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsCreatingTodo(false)}
                            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
                          >
                            {t.cancelAction}
                          </button>
                          <button
                            type="submit"
                            className="cursor-pointer rounded-lg bg-[#0646c4] px-4 py-2 text-sm font-bold text-white hover:bg-[#04379a]"
                          >
                            {t.saveAction}
                          </button>
                        </div>
                      </form>
                    )}

                    {!todos.length ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center">
                        <ClipboardList
                          size={28}
                          className="mx-auto text-slate-400"
                        />
                        <p className="mt-3 font-semibold text-slate-600">
                          {t.noTodos}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {todos.map((todo) => {
                          const isExpanded = expandedTodos.has(todo.id);
                          const doneSteps = todo.steps.filter(
                            (step) => step.done,
                          ).length;

                          return (
                            <article
                              key={todo.id}
                              className={`overflow-hidden rounded-2xl border ${
                                todo.status === "done"
                                  ? "border-emerald-200 bg-emerald-50/30"
                                  : "border-slate-200 bg-white"
                              }`}
                            >
                              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                                <div className="flex min-w-0 flex-1 items-start gap-3">
                                  <div
                                    className={`mt-0.5 rounded-lg p-2 ${
                                      todo.status === "done"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-blue-50 text-[#0646c4]"
                                    }`}
                                  >
                                    {todo.status === "done" ? (
                                      <CheckCircle2 size={18} />
                                    ) : (
                                      <ListChecks size={18} />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4
                                      className={`break-words font-extrabold ${
                                        todo.status === "done"
                                          ? "text-slate-500 line-through"
                                          : "text-slate-900"
                                      }`}
                                    >
                                      {todo.label}
                                    </h4>
                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                      <span className="inline-flex items-center gap-1.5">
                                        <UserRound size={13} />
                                        {todo.owner || t.unassigned}
                                      </span>
                                      {todo.dueDate && (
                                        <span className="inline-flex items-center gap-1.5">
                                          <Clock3 size={13} />
                                          {new Date(
                                            `${todo.dueDate}T00:00:00`,
                                          ).toLocaleDateString(
                                            language === "en" ? "en-GB" : "fr-FR",
                                          )}
                                        </span>
                                      )}
                                      {todo.steps.length > 0 && (
                                        <span>
                                          {doneSteps}/{todo.steps.length}{" "}
                                          {t.stepsLabel}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                  <select
                                    value={todo.status}
                                    onChange={(event) =>
                                      updateStatus(todo, event.target.value)
                                    }
                                    aria-label={`${t.statusLabel}: ${todo.label}`}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
                                  >
                                    {TODO_STATUSES.map((status) => (
                                      <option key={status} value={status}>
                                        {t.statuses[status]}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExpandedTodos((current) => {
                                        const next = new Set(current);
                                        if (next.has(todo.id)) {
                                          next.delete(todo.id);
                                        } else {
                                          next.add(todo.id);
                                        }
                                        return next;
                                      })
                                    }
                                    aria-expanded={isExpanded}
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0646c4]"
                                  >
                                    <History size={14} />
                                    {isExpanded ? t.hideDetails : t.showDetails}
                                  </button>
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="grid gap-6 border-t border-slate-200 bg-slate-50/70 p-4 md:grid-cols-2 md:p-5">
                                  <div className="space-y-5">
                                    <form
                                      key={`${todo.id}-${todo.updatedAt || ""}`}
                                      onSubmit={(event) =>
                                        saveTodoDetails(todo, event)
                                      }
                                      className="space-y-3"
                                    >
                                      <h5 className="text-sm font-extrabold text-slate-800">
                                        {t.todoDetailsTitle}
                                      </h5>
                                      <label className="block text-xs font-bold text-slate-600">
                                        {t.todoTaskLabel}
                                        <input
                                          name="label"
                                          defaultValue={todo.label}
                                          required
                                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-blue-500"
                                        />
                                      </label>
                                      <label className="block text-xs font-bold text-slate-600">
                                        {t.ownerLabel}
                                        <input
                                          name="owner"
                                          defaultValue={todo.owner}
                                          required
                                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-blue-500"
                                        />
                                      </label>
                                      <label className="block text-xs font-bold text-slate-600">
                                        {t.dueDateLabel}
                                        <input
                                          name="dueDate"
                                          type="date"
                                          defaultValue={todo.dueDate}
                                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-blue-500"
                                        />
                                      </label>
                                      <label className="block text-xs font-bold text-slate-600">
                                        {t.descriptionLabel}
                                        <textarea
                                          name="description"
                                          rows="2"
                                          defaultValue={todo.description}
                                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-blue-500"
                                        />
                                      </label>
                                      <button
                                        type="submit"
                                        className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#0646c4] ring-1 ring-blue-200 hover:bg-blue-50"
                                      >
                                        {t.saveAction}
                                      </button>
                                    </form>

                                    <div>
                                      <h5 className="mb-2 text-sm font-extrabold text-slate-800">
                                        {t.stepsLabel}
                                      </h5>
                                      {todo.steps.length ? (
                                        <ul className="space-y-2">
                                          {todo.steps.map((step) => (
                                            <li
                                              key={step.id}
                                              className="flex items-start gap-2"
                                            >
                                              <input
                                                type="checkbox"
                                                checked={step.done}
                                                onChange={() =>
                                                  toggleStep(todo, step)
                                                }
                                                aria-label={`${t.markStep}: ${step.text}`}
                                                className="mt-0.5 h-4 w-4 accent-[#159947]"
                                              />
                                              <span
                                                className={`text-sm ${
                                                  step.done
                                                    ? "text-slate-400 line-through"
                                                    : "text-slate-700"
                                                }`}
                                              >
                                                {step.text}
                                              </span>
                                            </li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <p className="text-xs text-slate-500">
                                          {t.noSteps}
                                        </p>
                                      )}
                                      <form
                                        onSubmit={(event) => {
                                          event.preventDefault();
                                          addStep(todo);
                                        }}
                                        className="mt-3 flex gap-2"
                                      >
                                        <input
                                          value={stepDrafts[todo.id] || ""}
                                          onChange={(event) =>
                                            setStepDrafts((current) => ({
                                              ...current,
                                              [todo.id]: event.target.value,
                                            }))
                                          }
                                          placeholder={t.newStepPlaceholder}
                                          aria-label={t.newStepPlaceholder}
                                          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500"
                                        />
                                        <button
                                          type="submit"
                                          aria-label={t.addStepAction}
                                          className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#0646c4] px-3 text-white hover:bg-[#04379a]"
                                        >
                                          <Plus size={16} />
                                        </button>
                                      </form>
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-800">
                                      <History size={15} />
                                      {t.historyLabel}
                                    </h5>
                                    {todo.history.length ? (
                                      <ol className="relative ml-1 space-y-4 border-l border-slate-200 pl-4">
                                        {[...todo.history]
                                          .reverse()
                                          .map((entry) => (
                                            <li
                                              key={entry.id}
                                              className="relative"
                                            >
                                              <span className="absolute -left-[1.32rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#0646c4] ring-1 ring-blue-200" />
                                              <p className="text-sm leading-5 text-slate-700">
                                                {getHistoryDescription(entry, t)}
                                              </p>
                                              <time className="mt-1 block text-[11px] text-slate-400">
                                                {formatDateTime(entry.at, language)}
                                              </time>
                                            </li>
                                          ))}
                                      </ol>
                                    ) : (
                                      <p className="text-xs text-slate-500">
                                        {t.noHistory}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
