const swapHeaderAndFooter = (lang) => {
  const params = new URL(
    document.getElementById("decorator-env").getAttribute("data-src")
  ).searchParams;

  fetch(`http://localhost:3000?${params.toString()}`)
    .then((res) => res.text())
    .then((html) => {
      const doc = document.createElement("html");
      doc.innerHTML = html;
      const header = doc.querySelector("header");
      const footer = doc.querySelector("footer");
      document.getElementById("decorator-footer").append(footer);
      document.getElementById("decorator-header").append(header);
    });
};

swapHeaderAndFooter("nb");

window.addEventListener("message", (e) => {
  if (e.data.source === "decoratorClient" && e.data.event === "ready") {
    window.postMessage({ source: "decorator", event: "ready" });
  }
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
