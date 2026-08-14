import {
  CheckCircle2,
  ClipboardList,
  Eye,
  EyeOff,
  FileText,
  LockKeyhole,
  LogOut,
  NotebookPen,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

const ACCESS_STORAGE_KEY = "fifve-team-space-unlocked";
const TODO_STORAGE_KEY = "fifve-team-space-todos";

export default function TeamWorkspaceSection({ t }) {
  const [isUnlocked, setIsUnlocked] = useState(
    () => window.localStorage.getItem(ACCESS_STORAGE_KEY) === "true",
  );
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState("reports");
  const [todos, setTodos] = useState(() => {
    const savedTodos = window.localStorage.getItem(TODO_STORAGE_KEY);
    return savedTodos ? JSON.parse(savedTodos) : t.todos;
  });

  useEffect(() => {
    window.localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

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

  const toggleTodo = (todoId) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId ? { ...todo, done: !todo.done } : todo,
      ),
    );
  };

  const completedCount = todos.filter((todo) => todo.done).length;
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
                {activeTab === "reports" && (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {t.reports.map((report) => (
                      <article
                        key={report.date}
                        className="border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-[#159947]">
                              {report.date}
                            </p>
                            <h3 className="mt-2 text-lg font-extrabold text-slate-900">
                              {report.title}
                            </h3>
                          </div>
                          <FileText
                            size={20}
                            className="shrink-0 text-[#0646c4]"
                          />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {report.summary}
                        </p>
                      </article>
                    ))}
                  </div>
                )}

                {activeTab === "notes" && (
                  <div className="grid gap-4 lg:grid-cols-3">
                    {t.notes.map((note) => (
                      <article
                        key={note.title}
                        className="border-l-4 border-[#f0b429] bg-amber-50 p-5"
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
                  <div className="max-w-3xl">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900">
                          {t.todosTitle}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {t.todosDescription}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
                        {completedCount}/{todos.length}
                      </span>
                    </div>
                    <ul className="divide-y divide-slate-200 border border-slate-200">
                      {todos.map((todo) => (
                        <li key={todo.id}>
                          <label className="flex cursor-pointer items-center gap-3 px-4 py-4 transition hover:bg-slate-50">
                            <input
                              type="checkbox"
                              checked={todo.done}
                              onChange={() => toggleTodo(todo.id)}
                              className="h-5 w-5 accent-[#159947]"
                            />
                            <span
                              className={`flex-1 text-sm font-medium ${todo.done ? "text-slate-400 line-through" : "text-slate-800"}`}
                            >
                              {todo.label}
                            </span>
                            {todo.done && (
                              <CheckCircle2
                                size={18}
                                className="text-[#159947]"
                              />
                            )}
                          </label>
                        </li>
                      ))}
                    </ul>
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
