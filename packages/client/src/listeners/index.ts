import { WithTexts } from 'decorator-shared/types';
import { addBreadcrumbEventListeners } from './breadcrumbs-listener';
import { addFeedbackListener } from './feedback-listener';
export { addBreadcrumbEventListeners } from './breadcrumbs-listener';

export function onLoadListeners(params: WithTexts) {
  addBreadcrumbEventListeners();
  addFeedbackListener(params);
}
