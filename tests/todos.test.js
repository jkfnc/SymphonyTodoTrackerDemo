import assert from "node:assert/strict";

import { addTodo, createTodo, deleteTodo, filterTodos, getCounts, getSummary, toggleTodo } from "../src/todos.js";

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

test("getSummary returns 'All tasks complete' when no active todos", () => {
  assert.equal(getSummary([]), "All tasks complete");
  const allDone = [{ ...createTodo("A"), completed: true }];
  assert.equal(getSummary(allDone), "All tasks complete");
});

test("getSummary returns '1 task left' when one active todo", () => {
  const todos = [createTodo("A")];
  assert.equal(getSummary(todos), "1 task left");
});

test("getSummary returns 'N tasks left' when multiple active todos", () => {
  const todos = [createTodo("A"), createTodo("B"), createTodo("C")];
  assert.equal(getSummary(todos), "3 tasks left");
});

test("getSummary ignores completed todos in count", () => {
  const todos = [createTodo("A"), { ...createTodo("B"), completed: true }, createTodo("C")];
  assert.equal(getSummary(todos), "2 tasks left");
});

console.log("All tests passed.");
