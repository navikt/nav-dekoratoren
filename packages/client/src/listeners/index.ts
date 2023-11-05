import { ClientTexts } from 'decorator-shared/types';
import { addFeedbackListener } from './feedback-listener';

export function onLoadListeners(params: { texts: ClientTexts }) {
  addFeedbackListener(params);
}
