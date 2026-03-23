import assert from "node:assert/strict";

import { syncFilterButtons } from "../src/filter-buttons.js";
import { addTodo, createTodo, deleteTodo, filterTodos, getCounts, toggleTodo } from "../src/todos.js";

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

test("createTodo trims the title", () => {
  const todo = createTodo("  Write tests  ");
  assert.equal(todo.title, "Write tests");
  assert.equal(todo.completed, false);
});

test("addTodo prepends a new todo", () => {
  const todos = addTodo([], "Ship feature");
  assert.equal(todos.length, 1);
  assert.equal(todos[0].title, "Ship feature");
});

test("toggleTodo flips completion state", () => {
  const todo = createTodo("Check toggle");
  const toggled = toggleTodo([todo], todo.id);
  assert.equal(toggled[0].completed, true);
});

test("deleteTodo removes the matching todo", () => {
  const first = createTodo("First");
  const second = createTodo("Second");
  const next = deleteTodo([first, second], first.id);
  assert.deepEqual(next.map((todo) => todo.title), ["Second"]);
});

test("filterTodos supports active and completed", () => {
  const first = createTodo("One");
  const second = { ...createTodo("Two"), completed: true };
  assert.equal(filterTodos([first, second], "active").length, 1);
  assert.equal(filterTodos([first, second], "completed").length, 1);
});

test("getCounts returns summary totals", () => {
  const todos = [createTodo("A"), { ...createTodo("B"), completed: true }];
  assert.deepEqual(getCounts(todos), { all: 2, active: 1, completed: 1 });
});

test("syncFilterButtons updates badges and active state from counts", () => {
  const buttons = ["all", "active", "completed"].map(createFilterButton);
  const todos = [createTodo("A"), { ...createTodo("B"), completed: true }];

  syncFilterButtons(buttons, "active", getCounts(todos));

  assert.deepEqual(
    buttons.map((button) => button.badge.textContent),
    ["2", "1", "1"]
  );
  assert.equal(buttons[0].classList.contains("is-active"), false);
  assert.equal(buttons[1].classList.contains("is-active"), true);
  assert.equal(buttons[2].classList.contains("is-active"), false);
});

test("syncFilterButtons stays in sync after add, toggle, and delete", () => {
  const buttons = ["all", "active", "completed"].map(createFilterButton);
  let todos = [];

  todos = addTodo(todos, "Draft release notes");
  syncFilterButtons(buttons, "all", getCounts(todos));
  assert.deepEqual(
    buttons.map((button) => button.badge.textContent),
    ["1", "1", "0"]
  );

  todos = toggleTodo(todos, todos[0].id);
  syncFilterButtons(buttons, "completed", getCounts(todos));
  assert.deepEqual(
    buttons.map((button) => button.badge.textContent),
    ["1", "0", "1"]
  );
  assert.equal(buttons[2].classList.contains("is-active"), true);

  todos = deleteTodo(todos, todos[0].id);
  syncFilterButtons(buttons, "all", getCounts(todos));
  assert.deepEqual(
    buttons.map((button) => button.badge.textContent),
    ["0", "0", "0"]
  );
});

function createFilterButton(filter) {
  const badge = { textContent: "" };
  const classNames = new Set(["filter"]);

  return {
    badge,
    dataset: { filter },
    classList: {
      contains(name) {
        return classNames.has(name);
      },
      toggle(name, enabled) {
        if (enabled) {
          classNames.add(name);
          return true;
        }

        classNames.delete(name);
        return false;
      }
    },
    querySelector(selector) {
      return selector === "[data-filter-count]" ? badge : null;
    }
  };
}

console.log("All tests passed.");
