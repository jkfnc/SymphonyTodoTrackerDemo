import assert from "node:assert/strict";

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
  assert.match(todo.dueOn, /^\d{4}-\d{2}-\d{2}$/);
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

test("getCounts returns summary totals including dueToday", () => {
  const todos = [
    { id: "a", title: "A", completed: false, createdAt: "2026-03-23T08:00:00.000Z", dueOn: "2026-03-23" },
    { id: "b", title: "B", completed: true, createdAt: "2026-03-23T09:00:00.000Z", dueOn: "2026-03-23" },
    { id: "c", title: "C", completed: false, createdAt: "2026-03-24T09:00:00.000Z", dueOn: "2026-03-24" }
  ];

  assert.deepEqual(getCounts(todos, new Date("2026-03-23T12:00:00.000Z")), {
    all: 3,
    active: 2,
    completed: 1,
    dueToday: 1
  });
});

test("getCounts falls back to createdAt for legacy todos without dueOn", () => {
  const todos = [
    { id: "legacy", title: "Legacy", completed: false, createdAt: "2026-03-23T08:00:00.000Z" }
  ];

  assert.equal(getCounts(todos, new Date("2026-03-23T12:00:00.000Z")).dueToday, 1);
});

console.log("All tests passed.");
