import { WithTexts } from 'decorator-shared/types';
import * as api from '../api';
import { addBreadcrumbEventListeners } from './breadcrumbs-listener';
import { addSearchInputListener } from './search-listener';
import { addSnarveierListener } from './sub-menu-listener';
import { addFeedbackListener } from './feedback-listener';

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

export { addBreadcrumbEventListeners } from './breadcrumbs-listener';

export function onLoadListeners(params: WithTexts) {
  addBreadcrumbEventListeners();
  addSnarveierListener();
  addSearchInputListener();
  addFeedbackListener(params);
}
