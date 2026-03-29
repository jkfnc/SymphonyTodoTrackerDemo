import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { addTodo, createTodo, deleteTodo, filterTodos, getCounts, toggleTodo } from "../src/todos.js";

const indexHtml = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const stylesCss = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

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

test("composer renders a keyboard shortcut hint for adding todos", () => {
  assert.match(indexHtml, /aria-describedby="todo-shortcut-hint"/);
  assert.match(indexHtml, /<p id="todo-shortcut-hint" class="composer-hint">Press <kbd>Enter<\/kbd> to add<\/p>/);
});

test("keyboard shortcut hint uses dedicated subtle styling", () => {
  assert.match(stylesCss, /\.composer-hint\s*\{/);
  assert.match(stylesCss, /justify-self:\s*end;/);
  assert.match(stylesCss, /font-size:\s*0\.78rem;/);
  assert.match(stylesCss, /\.composer-hint kbd\s*\{/);
});

console.log("All tests passed.");
