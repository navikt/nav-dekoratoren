import { Texts } from 'decorator-shared/texts';
import { fetchSession, AuthData, fethRenew } from '../helpers/auth';

export function logoutWarningController(
  hasLogoutWarning: boolean,
  texts: Texts,
) {
  if (!hasLogoutWarning) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let timeoutHandler: number;
  let auth: AuthData;
  let silenceWarning: boolean = false;
  const logoutWarningDialog = document.getElementById(
    'logout-warning',
  ) as HTMLDialogElement | null;
  const title = logoutWarningDialog?.querySelector('#logout-warning-title');
  const body = logoutWarningDialog?.querySelector('#logout-warning-body');
  const confirmButton = logoutWarningDialog?.querySelector(
    '#logout-warning-confirm',
  );
  const cancelButton = logoutWarningDialog?.querySelector(
    '#logout-warning-cancel',
  );

  const TOKEN_WARNING_THRESHOLD = 5 * 60; // 5 minutes
  const SESSION_WARNING_THRESHOLD = 5 * 60; // 5 minutes

  async function getUpdatedSessionRemote() {
    const result = await fetchSession();
    if (result.session && result.tokens) {
      auth = { ...result }; // Spread to avoid referencing.
    }
  }

  async function renewToken() {
    const result = await fethRenew();
    if (result.session && result.tokens) {
      auth = { ...result }; // Spread to avoid referencing.
    }
  }

  function silenceSessionWarning() {
    if (logoutWarningDialog) {
      logoutWarningDialog.close();
    }
    silenceWarning = true;
  }

  function fakeTokenExpiration(seconds: number) {
    const fakeTokenEndsAt = new Date(Date.now() + seconds * 1000).toISOString();
    auth.tokens.expire_at = fakeTokenEndsAt;
  }

  function fakeSessionExpiration(seconds: number) {
    const fakeSessionEndsAt = new Date(
      Date.now() + seconds * 1000,
    ).toISOString();
    auth.session.ends_at = fakeSessionEndsAt;
  }

  function getSecondsToExpiration(expiration: string) {
    const now = new Date().getTime();
    const expires = new Date(expiration).getTime();
    return Math.ceil((expires - now) / 1000);
  }

  function confirmHandler(e: Event) {
    const target = e.target as HTMLButtonElement;
    const type = target.getAttribute('data-type');
    if (type === 'token') {
      renewToken();
    } else {
      silenceSessionWarning();
    }
  }

  function cancelHandler() {
    window.location.href = `${import.meta.env.VITE_LOGOUT_URL}`;
  }

  function updateDialogUI(type: 'token' | 'session', minutes?: number) {
    if (
      !title ||
      !body ||
      !confirmButton ||
      !cancelButton ||
      !logoutWarningDialog
    ) {
      return;
    }

    if (type === 'token') {
      title.innerHTML = texts.token_warning_title;
      body.innerHTML = texts.token_warning_body;
      confirmButton.innerHTML = texts.yes;
      cancelButton.innerHTML = texts.logout;
    } else {
      title.innerHTML = texts.session_warning_title(minutes?.toString() || '');
      body.innerHTML = texts.session_warning_body;
      confirmButton.innerHTML = texts.ok;
      cancelButton.innerHTML = texts.logout;
    }

    confirmButton.setAttribute('data-type', type);
    cancelButton.setAttribute('data-type', type);

    if (!logoutWarningDialog.open && !silenceWarning) {
      console.log('showing modal');
      logoutWarningDialog.showModal();
    }
  }

  function checkSessionLocally() {
    console.log('checking session locally');
    timeoutHandler = setTimeout(() => {
      checkSessionLocally();
    }, 1000);

    // User is not logged in
    if (!auth?.tokens || !auth?.session || !logoutWarningDialog) {
      return;
    }

    const { tokens, session } = auth;
    const secondsToTokenExpiration = getSecondsToExpiration(tokens.expire_at);
    const secondsToSessionExpiration = getSecondsToExpiration(session.ends_at);

    if (secondsToTokenExpiration < 0 || secondsToSessionExpiration < 0) {
      window.location.href = `${import.meta.env.VITE_LOGOUT_URL}`;
    }

    if (secondsToTokenExpiration < TOKEN_WARNING_THRESHOLD) {
      updateDialogUI('token');
      return;
    }

    if (secondsToSessionExpiration < SESSION_WARNING_THRESHOLD) {
      const minutesToSessionExpiration = Math.ceil(
        secondsToSessionExpiration / 60,
      );
      updateDialogUI('session', minutesToSessionExpiration);
      return;
    }

    if (logoutWarningDialog.open) {
      logoutWarningDialog.close();
    }
  }

  function onVisibilityChange() {
    if (document.visibilityState === 'visible') {
      getUpdatedSessionRemote();
    }
  }

  function setupDebugFunctionality() {
    window.loginDebug = {
      expireToken: fakeTokenExpiration,
      expireSession: fakeSessionExpiration,
    };
  }

  function startEventListeners() {
    window.addEventListener('visibilitychange', onVisibilityChange);
    confirmButton?.addEventListener('click', confirmHandler);
    cancelButton?.addEventListener('click', cancelHandler);
  }

  startEventListeners();
  setupDebugFunctionality();
  checkSessionLocally();
  getUpdatedSessionRemote();
}
