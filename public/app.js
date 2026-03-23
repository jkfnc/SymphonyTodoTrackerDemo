import { addTodo, deleteTodo, filterTodos, getCounts, toggleTodo } from "../src/todos.js";
import { syncFilterButtons } from "../src/filter-buttons.js";

const storageKey = "symphony.todo-tracker.todos";

const elements = {
  form: document.querySelector("#todo-form"),
  input: document.querySelector("#todo-input"),
  list: document.querySelector("#todo-list"),
  counts: document.querySelector("#counts"),
  emptyState: document.querySelector("#empty-state"),
  filters: [...document.querySelectorAll(".filter")]
};

const state = {
  todos: loadTodos(),
  filter: "all"
};

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  state.todos = addTodo(state.todos, elements.input.value);
  elements.input.value = "";
  persist();
  render();
});

elements.filters.forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter || "all";
    render();
  });
});

function loadTodos() {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist() {
  localStorage.setItem(storageKey, JSON.stringify(state.todos));
}

function render() {
  const filtered = filterTodos(state.todos, state.filter);
  const counts = getCounts(state.todos);

  elements.counts.textContent = `${counts.all} total, ${counts.active} active, ${counts.completed} completed`;
  elements.emptyState.hidden = filtered.length > 0;
  elements.list.innerHTML = "";

  syncFilterButtons(elements.filters, state.filter, counts);

  filtered.forEach((todo) => {
    const item = document.createElement("li");
    item.className = `todo-item${todo.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-check";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => {
      state.todos = toggleTodo(state.todos, todo.id);
      persist();
      render();
    });

    const meta = document.createElement("div");
    meta.className = "todo-meta";

    const title = document.createElement("span");
    title.className = "todo-title";
    title.textContent = todo.title;

    const createdAt = document.createElement("span");
    createdAt.className = "todo-date";
    createdAt.textContent = new Date(todo.createdAt).toLocaleString();

    meta.append(title, createdAt);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "todo-delete";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => {
      state.todos = deleteTodo(state.todos, todo.id);
      persist();
      render();
    });

    item.append(checkbox, meta, remove);
    elements.list.append(item);
  });
}

render();
