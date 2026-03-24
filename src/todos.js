const FILTERS = new Set(["all", "active", "completed"]);

function formatDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function getDueOn(todo) {
  if (typeof todo?.dueOn === "string" && /^\d{4}-\d{2}-\d{2}$/.test(todo.dueOn)) {
    return todo.dueOn;
  }

  if (todo?.createdAt) {
    const createdAt = new Date(todo.createdAt);
    if (!Number.isNaN(createdAt.valueOf())) {
      return formatDateKey(createdAt);
    }
  }

  return null;
}

export function createTodo(title) {
  const trimmed = String(title || "").trim();
  if (!trimmed) {
    throw new Error("title is required");
  }

  const now = new Date();

  return {
    id: crypto.randomUUID(),
    title: trimmed,
    completed: false,
    createdAt: now.toISOString(),
    dueOn: formatDateKey(now)
  };
}

export function addTodo(todos, title) {
  return [createTodo(title), ...todos];
}

export function toggleTodo(todos, id) {
  return todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
}

export function deleteTodo(todos, id) {
  return todos.filter((todo) => todo.id !== id);
}

export function filterTodos(todos, filter) {
  const normalized = FILTERS.has(filter) ? filter : "all";
  if (normalized === "active") {
    return todos.filter((todo) => !todo.completed);
  }
  if (normalized === "completed") {
    return todos.filter((todo) => todo.completed);
  }
  return todos;
}

export function getCounts(todos, now = new Date()) {
  const completed = todos.filter((todo) => todo.completed).length;
  const dueTodayKey = formatDateKey(now);
  const dueToday = todos.filter(
    (todo) => !todo.completed && getDueOn(todo) === dueTodayKey
  ).length;

  return {
    all: todos.length,
    active: todos.length - completed,
    completed,
    dueToday
  };
}
