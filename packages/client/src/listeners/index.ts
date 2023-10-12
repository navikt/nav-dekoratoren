import { WithTexts } from 'decorator-shared/types';
import { addBreadcrumbEventListeners } from './breadcrumbs-listener';
import { addSearchInputListener } from './search-listener';
import { addFeedbackListener } from './feedback-listener';
export { addBreadcrumbEventListeners } from './breadcrumbs-listener';

export function onLoadListeners(params: WithTexts) {
  addSearchInputListener();
  addBreadcrumbEventListeners();
  addFeedbackListener(params);
}

export function afterAuthListeners() {
  addSearchInputListener();
}
