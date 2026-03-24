const EDITABLE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

export function shouldFocusTodoInput(event) {
  if (!event || event.defaultPrevented) {
    return false;
  }

  if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
    return false;
  }

  const target = event.target;
  if (!target) {
    return true;
  }

  if (target.isContentEditable) {
    return false;
  }

  const tagName = typeof target.tagName === "string" ? target.tagName.toUpperCase() : "";
  return !EDITABLE_TAGS.has(tagName);
}
