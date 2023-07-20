const swapFooter = (lang) =>
  fetch(
    `/footer${location.search ? location.search + "&" : "?"}language=${lang}`
  )
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

window.addEventListener("message", (e) => {
  if (e.data.source === "decoratorClient" && e.data.event == "params") {
    if (e.data.payload.breadcrumbs) {
      const breadcrumbsListEl = document.getElementById("breadcrumbs-list");
      const firstChild = breadcrumbsListEl.querySelector("a:first-child");
      const list = e.data.payload.breadcrumbs.map(
        ({ url, title }, i, array) =>
          `<li class="flex items-center before:content-chevronRightIcon">${
            array.length - 1 === i
              ? title
              : `<a href=${url} class="text-blue-500 underline">${title}</a>`
          }</li>
`
      );
      breadcrumbsListEl.innerHTML = [firstChild.outerHTML, ...list].join("");
    }
  }
});
