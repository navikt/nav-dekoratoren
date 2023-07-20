const swapFooter = (lang) =>
  fetch(`/footer${location.search ? location.search + "&" : "?"}lang=${lang}`)
    .then((res) => res.text())
    .then(
      (html) => (document.getElementById("decorator-footer").innerHTML = html)
    );

document.getElementById("language-select").addEventListener("change", (e) => {
  swapFooter(e.target.value);
  history.replaceState({}, "", `/${e.target.value}${location.search}`);
});

if (!document.getElementById("decorator-footer").hasChildNodes()) {
  swapFooter("nb");
}

const menuButton = document.getElementById("menu-button");
const menuBackground = document.getElementById("menu-background");

function toggleActive(el) {
  el.classList.toggle("active");
}

menuButton.addEventListener("click", () => {
  const menu = document.getElementById("menu");

  [menuButton, menuBackground, menu].forEach(toggleActive);
});
