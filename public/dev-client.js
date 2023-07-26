const init = (opts) => {
  const ws = new WebSocket(`ws://${document.location.host}`);
  ws.onopen = () => {
    if (opts === "reconnect") {
      location.reload();
    }
  };
  ws.onclose = () => {
    setTimeout(() => init("reconnect"), 200);
  };
};

init();
