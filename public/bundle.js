const swapFooter = (lang) =>
  fetch(`/footer?lang=${lang}`)
    .then((res) => res.text())
    .then(
      (html) => (document.getElementById("decorator-footer").innerHTML = html)
    );

document.getElementById("language-select").addEventListener("change", (e) => {
  history.replaceState({}, "", e.target.value);
  swapFooter(e.target.value);
});

if (!document.getElementById("decorator-footer").hasChildNodes()) {
  swapFooter("no");
}
