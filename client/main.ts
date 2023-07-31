import "vite/modulepreload-polyfill";
import "./main.css";

const swapHeaderAndFooter = (lang: string) => {
  const params = new URL(
    document.getElementById("decorator-env")?.getAttribute("data-src") ?? ""
  ).searchParams;

  fetch(`http://localhost:3000?${params.toString()}`)
    .then((res) => res.text())
    .then((html) => {
      const doc = document.createElement("html");
      doc.innerHTML = html;
      const header = doc.querySelector("header");
      const footer = doc.querySelector("footer");
      footer && document.getElementById("decorator-footer")?.append(footer);
      header && document.getElementById("decorator-header")?.append(header);
    });
};

if (document.getElementById("decorator-footer")?.innerHTML === "") {
  swapHeaderAndFooter("nb");
}

window.addEventListener("message", (e) => {
  if (e.data.source === "decoratorClient" && e.data.event === "ready") {
    window.postMessage({ source: "decorator", event: "ready" });
  }
  if (e.data.source === "decoratorClient" && e.data.event == "params") {
    if (e.data.payload.breadcrumbs) {
      const breadcrumbsListEl = document.getElementById("breadcrumbs-list");
      if (breadcrumbsListEl) {
        const firstChild = breadcrumbsListEl.querySelector("a:first-child");
        const list = (
          e.data.payload.breadcrumbs as { url: string; title: string }[]
        ).map(
          ({ url, title }, i, array) =>
            `<li class="flex items-center before:content-chevronRightIcon">${
              array.length - 1 === i
                ? title
                : `<a href=${url} class="text-blue-500 underline">${title}</a>`
            }</li>
  `
        );
        breadcrumbsListEl.innerHTML = [firstChild?.outerHTML, ...list].join("");
      }
    }
  }
});

window.addEventListener("message", (e) => {
  if (e.data.source === "decoratorClient") {
    console.log("message:", e.data);
  }
});

const formElement = document.getElementById(
  "breadcrumbs-form"
) as HTMLFormElement;

formElement.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(formElement);

  window.postMessage({
    source: "decoratorClient",
    event: "params",
    payload: { breadcrumbs: JSON.parse(data.get("breadcrumbs") as string) },
  });
});

const menuButton = document.getElementById("menu-button");
const menuBackground = document.getElementById("menu-background");

function toggleActive(el: HTMLElement) {
  el.classList.toggle("active");
}

function purgeActive(el: HTMLElement) {
  el.classList.remove("active");
}

menuButton?.addEventListener("click", () => {
  const menu = document.getElementById("menu");

  [menuButton, menuBackground, menu].forEach((el) => el && toggleActive(el));
});

menuBackground?.addEventListener("click", () => {
  console.log("click");
  const menu = document.getElementById("menu");

  [menuButton, menuBackground, menu].forEach((el) => el && purgeActive(el));
});

const contextLinks = document.querySelectorAll(".context-link");

function removeClassFromElements(
  elements: NodeListOf<Element>,
  className: string
) {
  for (const element of elements) {
    element.classList.remove(className);
  }
}

for (const contextLink of contextLinks) {
  contextLink.addEventListener("click", (e) => {
    const targetContext = contextLink.getAttribute("data-context");

    fetch(`/header?context=${targetContext}`)
      .then((res) => res.text())
      .then((html) => {
        console.log(html);

        removeClassFromElements(contextLinks, "active");
        contextLink.classList.add("active");

        const headerMenuLinksEl = document.getElementById("header-menu-links");
        if (headerMenuLinksEl) {
          headerMenuLinksEl.innerHTML = html;
        }
      });
  });
}


// @TODO:  Create a wrapper function around fetch that handles passing search params
