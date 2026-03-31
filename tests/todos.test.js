import assert from "node:assert/strict";

import { addTodo, clearCompleted, createTodo, deleteTodo, filterTodos, getCounts, toggleTodo } from "../src/todos.js";

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

test("clearCompleted removes all completed todos", () => {
  const active = createTodo("Active");
  const done = { ...createTodo("Done"), completed: true };
  const result = clearCompleted([active, done]);
  assert.equal(result.length, 1);
  assert.equal(result[0].title, "Active");
});

test("clearCompleted returns same list when no todos are completed", () => {
  const todos = [createTodo("A"), createTodo("B")];
  const result = clearCompleted(todos);
  assert.equal(result.length, 2);
});

console.log("All tests passed.");
