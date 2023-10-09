export function addBreadcrumbEventListeners() {
  document
    .getElementById('breadcrumbs-wrapper')
    ?.querySelectorAll('a[data-handle-in-app]')
    .forEach((el) =>
      el.addEventListener('click', (e) => {
        e.preventDefault();

        console.log(el.getAttribute('data-handle-in-app'));

        window.postMessage({
          source: 'decorator',
          event: 'breadcrumbClick',
          payload: {
            url: el.getAttribute('href'),
            title: el.innerHTML,
            handleInApp:
              el.getAttribute('data-handle-in-app') === 'true' ? true : false,
          },
        });
      }),
    );
}
