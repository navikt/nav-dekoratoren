window.addEventListener("message", (e) => {
  if (e.data.source === "decoratorClient") {
    console.log("message:", e.data);
  }
});

const formElement = document.getElementById("breadcrumbs-form");

formElement.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(formElement);

  window.postMessage({
    source: "decoratorClient",
    event: "params",
    payload: { breadcrumbs: JSON.parse(data.get("breadcrumbs")) },
  });
});
