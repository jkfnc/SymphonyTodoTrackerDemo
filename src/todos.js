const FILTERS = new Set(["all", "active", "completed"]);

export function createTodo(title) {
  const trimmed = String(title || "").trim();
  if (!trimmed) {
    throw new Error("title is required");
  }

  return {
    id: crypto.randomUUID(),
    title: trimmed,
    completed: false,
    createdAt: new Date().toISOString()
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

export function clearCompleted(todos) {
  return todos.filter((todo) => !todo.completed);
}

export function getCounts(todos) {
  const completed = todos.filter((todo) => todo.completed).length;
  return {
    all: todos.length,
    active: todos.length - completed,
    completed
  };
}
