export function syncFilterButtons(buttons, selectedFilter, counts) {
  buttons.forEach((button) => {
    const filter = button.dataset.filter || "all";
    const badge = button.querySelector("[data-filter-count]");

    button.classList.toggle("is-active", filter === selectedFilter);

    if (badge) {
      const count = Number.isFinite(counts?.[filter]) ? counts[filter] : 0;
      badge.textContent = String(count);
    }
  });
}
