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

function purgeActive(el) {
  el.classList.remove("active");
}

menuButton.addEventListener("click", () => {
  const menu = document.getElementById("menu");

  [menuButton, menuBackground, menu].forEach(toggleActive);
});

menuBackground.addEventListener("click", () => {
    console.log("click")
    const menu = document.getElementById("menu");

    [menuButton, menuBackground, menu].forEach(purgeActive);
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


const contextLinks = document.querySelectorAll(".context-link");

function removeClassFromElements(elements, className) {
    for (const element of elements) {
        element.classList.remove(className);
    }
}

for (const contextLink of contextLinks) {
    contextLink.addEventListener("click", (e) => {
        const targetContext = contextLink.getAttribute("data-context");

        fetch(`/header?context=${targetContext}`).then((res) => res.text()).then((html) => {
            console.log(html)


        removeClassFromElements(contextLinks, "active");
        contextLink.classList.add("active");

        document.getElementById("header-menu-links").innerHTML = html;
        })
    });
}



// @TODO:  Create a wrapper function around fetch that handles passing search params
