import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { shouldFocusTodoInput } from "../src/shortcut.js";
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

test("shouldFocusTodoInput accepts slash from non-editable targets", () => {
  assert.equal(shouldFocusTodoInput({ key: "/", target: { tagName: "button" } }), true);
});

test("shouldFocusTodoInput ignores slash inside editable targets", () => {
  assert.equal(shouldFocusTodoInput({ key: "/", target: { tagName: "input" } }), false);
  assert.equal(shouldFocusTodoInput({ key: "/", target: { isContentEditable: true } }), false);
});

test("shouldFocusTodoInput ignores non-shortcut key presses", () => {
  assert.equal(shouldFocusTodoInput({ key: "a", target: { tagName: "button" } }), false);
  assert.equal(shouldFocusTodoInput({ key: "/", ctrlKey: true, target: { tagName: "button" } }), false);
});

test("empty state mentions the shortcut helper text", () => {
  const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
  assert.match(html, /Press <kbd>\/<\/kbd> to focus the task field\./);
});

console.log("All tests passed.");
