import Cookies from 'js-cookie';
import { env, param } from '../params';
import clsInputs from '../styles/inputs.module.css';
import { defineCustomElement } from './custom-elements';
import { isDialogDefined } from '../helpers/dialog-util';
import { analyticsEvent } from '../analytics/analytics';
import { logger } from '../helpers/logger';

let scriptLoaded: Promise<void> | undefined;

const isScreensharingEnabled = () => window.__DECORATOR_DATA__.features['dekoratoren.skjermdeling'];

export const loadPuzzelScript = (): Promise<void> => {
	logger.info('Loading Puzzel script');
	if (scriptLoaded) {
		return scriptLoaded;
	}

	const script = document.createElement('script');
	script.async = true;
	script.type = 'text/javascript';
	script.src = 'https://app-cdn.puzzel.com/public/js/pzl_loader.js';
	script.id = 'pzlModuleLoader';
	script.dataset.customerId = env('PUZZEL_CUSTOMER_ID');

	scriptLoaded = new Promise<void>((resolve) => {
		script.onload = () => resolve();
	});
	document.body.appendChild(script);

	return scriptLoaded;
};

function lazyLoadScreensharing(openModal: () => void) {
	logger.info('Lazy loading Puzzel screensharing');

	if (!isScreensharingEnabled() || !param('shareScreen')) {
		return;
	}

	// Check if it is already loaded to avoid layout shift
	if (window.pzl?.info?.status === 'started') {
		openModal();
		return;
	}

	logger.info('Screensharing enabled, loading Puzzel script');
	loadPuzzelScript().then(() => openModal());
}

function startCall(code: string) {
	if (!isScreensharingEnabled() || !param('shareScreen')) {
		return;
	}

	window.pzl?.api.showInteraction({
		interactionId: '7d05c34f-0db4-4fc3-b370-9eb1812a40ca',
		queueKey: 'q_cobrowsing_demo',
		formValues: {
			pzlStartChatCode: code,
		},
	});
	analyticsEvent({
		eventName: 'skjermdeling',
		kategori: 'dekorator-footer',
		komponent: 'ScreensharingModal',
	});
}

export class ScreensharingModal extends HTMLElement {
	dialog!: HTMLDialogElement;
	input!: HTMLInputElement;
	errorList!: HTMLElement;

	showModal() {
		if (!isScreensharingEnabled() || !param('shareScreen')) {
			return;
		}

		this.dialog.showModal();
		analyticsEvent({
			eventName: 'modal åpnet',
			kategori: 'dekorator-footer',
			tekst: 'Start skjermdeling',
			komponent: 'ScreensharingModal',
		});
	}
	closeModal() {
		this.dialog.close();
		analyticsEvent({
			eventName: 'modal lukket',
			kategori: 'dekorator-footer',
			tekst: 'Start skjermdeling',
			komponent: 'ScreensharingModal',
		});
	}

	validateInput(code: string) {
		if (!/^\d{6}$/.exec(code)) {
			this.input.classList.add(clsInputs.invalid);
			this.errorList.classList.add(clsInputs.showErrors);
			return false;
		}
		return true;
	}

	clearErrors() {
		this.errorList.classList.remove(clsInputs.showErrors);
	}

	async connectedCallback() {
		if (!isScreensharingEnabled() || !param('shareScreen')) {
			return;
		}

		this.dialog = this.querySelector('dialog')!;
		this.errorList = this.querySelector('ul')!;
		this.input = this.querySelector('input')!;
		if (!isDialogDefined(this.dialog)) {
			return;
		}

		this.input.addEventListener('input', () => this.clearErrors());

		const form = this.querySelector('form')!;
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const code = new FormData(form).get('screensharing_code');
			if (typeof code === 'string' && this.validateInput(code)) {
				startCall(code);
				this.closeModal();
			}
		});

		this.querySelector('button[data-type=cancel]')?.addEventListener('click', () => this.closeModal());
	}
}

export class ScreenshareButton extends HTMLElement {
	loadScriptIfActiveSession = () => {
		logger.info('Checking for active Puzzel chat session');
		if (isScreensharingEnabled() && Cookies.get('pzl.rid')) {
			loadPuzzelScript();
		}
	};

	connectedCallback() {
		if (document.readyState == 'complete') {
			this.loadScriptIfActiveSession();
		} else {
			window.addEventListener('load', () => {
				this.loadScriptIfActiveSession();
			});
		}

		this.addEventListener('click', () =>
			lazyLoadScreensharing(() => {
				const dialog = document.querySelector('screensharing-modal') as HTMLDialogElement;
				logger.info('Opening Puzzel screensharing modal');
				dialog.showModal();
			})
		);
	}
}

defineCustomElement('screensharing-modal', ScreensharingModal);
defineCustomElement('screenshare-button', ScreenshareButton);
