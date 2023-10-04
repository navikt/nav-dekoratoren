import { WithTexts } from 'decorator-shared/types';
import { addBreadcrumbEventListeners } from './breadcrumbs-listener';
import {
  addSearchInputListener,
  handleSearchButtonClick,
} from './search-listener';
import { addSnarveierListener } from './sub-menu-listener';
import { addFeedbackListener } from './feedback-listener';
export { addBreadcrumbEventListeners } from './breadcrumbs-listener';

export function onLoadListeners(params: WithTexts) {
  addBreadcrumbEventListeners();
  addSnarveierListener();
  addSearchInputListener();
  addFeedbackListener(params);
}

export function afterAuthListeners() {
  handleSearchButtonClick();
  addSearchInputListener();
}
