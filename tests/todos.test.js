import assert from "node:assert/strict";

import {
  addTodo,
  clearCompletedTodos,
  createTodo,
  deleteTodo,
  filterTodos,
  getCounts,
  getListStatus,
  toggleTodo
} from "../src/todos.js";

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

test("clearCompletedTodos removes only completed todos", () => {
  const first = createTodo("First");
  const second = { ...createTodo("Second"), completed: true };
  const third = { ...createTodo("Third"), completed: true };
  const next = clearCompletedTodos([first, second, third]);
  assert.deepEqual(next.map((todo) => todo.title), ["First"]);
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

test("getListStatus returns Empty for no todos", () => {
  assert.equal(getListStatus([]), "Empty");
});

test("getListStatus returns In progress when any todo is active", () => {
  const todos = [createTodo("A"), { ...createTodo("B"), completed: true }];
  assert.equal(getListStatus(todos), "In progress");
});

test("getListStatus returns Completed when all todos are complete", () => {
  const todos = [{ ...createTodo("A"), completed: true }];
  assert.equal(getListStatus(todos), "Completed");
});

console.log("All tests passed.");
