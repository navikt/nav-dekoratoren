import * as api from '../api';

export const fetchVarsler = () =>
  fetch(`${import.meta.env.VITE_DECORATOR_BASE_URL}/api/varsler`, {
    credentials: 'include',
  }).then((response) => response.text());

export function attachArkiverListener() {
  const arkiverButtons = document.querySelectorAll('.arkiver-varsel');

  arkiverButtons.forEach((button) => {
    const eventId = button.getAttribute('data-event-id');

    button.addEventListener('click', async () => {
      const resp = await api.inaktiver({
        eventId: eventId as string,
      });

      // Remove the varsel from the dom
      if (resp) {
        const listItem = document.getElementById(eventId as string);
        listItem?.remove();
      }
    });
  });
}
