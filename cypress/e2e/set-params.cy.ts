import { Params } from '@/params';

describe('Setting parameters', () => {
  let ready = false;

  const isReady = (window: Window) => {
    return new Promise((resolve) => {
      if (ready) {
        resolve(true);
      }

      // Send ready message until decorator responds
      (function wait() {
        if (!ready) {
          setTimeout(wait, 50);
          window.postMessage(
            { source: 'decoratorClient', event: 'ready' },
            window.location.origin,
          );
        }
      })();

      const receiveMessage = (msg: MessageEvent) => {
        const { data } = msg;
        const { source, event } = data;
        if (source === 'decorator' && event === 'ready') {
          ready = true;
          window.removeEventListener('message', receiveMessage);
          resolve(true);
        }
      };
      window.addEventListener('message', receiveMessage);
    });
  };

  const setParams = (params: Partial<Params>): Cypress.Chainable =>
    cy
      .window()
      .then(async (window: Window) => {
        await isReady(window);
        return window;
      })
      .then((window) => {
        window.postMessage({
          source: 'decoratorClient',
          event: 'params',
          payload: params,
        });
      });

  afterEach(() => {
    ready = false;
  });

  it('Breadcrumbs is set and handled in app', () => {
    cy.visit('/');

    cy.findByText('Ditt NAV').should('not.exist');

    const obj = {
      callback: console.log,
    };

    const spy = cy.spy(obj, 'callback');

    cy.window()
      .then((window) => {
        window.addEventListener('message', (message) => {
          const { source, event, payload } = message.data;
          if (source === 'decorator' && event === 'breadcrumbClick') {
            obj.callback(payload);
          }
        });
      })
      .then(() =>
        setParams({
          breadcrumbs: [
            {
              url: '/a',
              title: 'Ditt NAV',
              handleInApp: true,
            },
            {
              url: '/b',
              title: 'Kontakt oss',
            },
            {
              url: '/c',
              title: 'NAV Oslo',
            },
          ],
        }),
      )
      .then(() => {
        cy.findByText('Ditt NAV').should('exist');

        cy.findByText('Ditt NAV')
          .click()
          .then(() => {
            expect(spy).to.be.calledWith({
              url: '/a',
              title: 'Ditt NAV',
              handleInApp: true,
            });
          });
      });
  });

  it('Breadcrumbs handled in app works when set on server', () => {
    cy.visit(
      `/?breadcrumbs=${JSON.stringify([
        { url: '/wat', title: 'Ditt NAV', handleInApp: true },
        { url: '/b', title: 'Kontakt oss' },
      ])}`,
    );

    const obj = {
      callback: console.log,
    };

    const spy = cy.spy(obj, 'callback');

    cy.window()
      .then(async (window) => {
        await isReady(window);
        return window;
      })
      .then((window) => {
        window.addEventListener('message', (message) => {
          const { source, event, payload } = message.data;
          if (source === 'decorator' && event === 'breadcrumbClick') {
            obj.callback(payload);
          }
        });
      })
      .then(() => {
        cy.findByText('Ditt NAV').should('exist');

        cy.findByText('Ditt NAV')
          .click()
          .then(() => {
            expect(spy).to.be.calledWith({
              url: '/wat',
              title: 'Ditt NAV',
              handleInApp: true,
            });
          });
      });
  });

  it('Available languages is set and handled in app', () => {
    cy.visit('/');

    cy.findByText('Norsk (bokmål)').should('not.exist');

    const obj = {
      callback: console.log,
    };

    const spy = cy.spy(obj, 'callback');

    cy.window()
      .then((window) => {
        window.addEventListener('message', (message) => {
          const { source, event, payload } = message.data;
          if (source === 'decorator' && event === 'languageSelect') {
            obj.callback(payload);
          }
        });
      })
      .then(() =>
        setParams({
          availableLanguages: [
            { locale: 'nb', url: '/', handleInApp: true },
            { locale: 'en', url: '/hmm' },
          ],
        }),
      )
      .then(() => {
        cy.findByText('Norsk (bokmål)').should('exist');

        cy.findByText('Språk')
          .click()
          .then(() =>
            cy
              .get('[class*="sprakvelger"]')
              .findByText('English')
              .click()
              .then(() => {
                expect(spy).to.not.be.called;
              }),
          );
      });
  });

  it('Available languages is set and handled in app (nb)', () => {
    cy.visit('/');

    cy.findByText('Norsk (bokmål)').should('not.exist');

    const obj = {
      callback: console.log,
    };

    const spy = cy.spy(obj, 'callback');

    cy.window()
      .then((window) => {
        window.addEventListener('message', (message) => {
          const { source, event, payload } = message.data;
          if (source === 'decorator' && event === 'languageSelect') {
            obj.callback(payload);
          }
        });
      })
      .then(() =>
        setParams({
          availableLanguages: [
            { locale: 'nb', url: '/', handleInApp: true },
            { locale: 'en', url: '/hmm' },
          ],
        }),
      )
      .then(() => {
        cy.findByText('Norsk (bokmål)').should('exist');

        cy.findByText('Språk')
          .click()
          .then(() =>
            cy
              .findByText('Norsk (bokmål)')
              .click()
              .then(() => {
                expect(spy).to.be.calledWith({
                  locale: 'nb',
                  url: '/',
                  handleInApp: true,
                });
              }),
          );
      });
  });

  it('Available languages handled correctly when set on server', () => {
    cy.visit(
      `/?availableLanguages=${JSON.stringify([
        { locale: 'nb', url: '/', handleInApp: true },
        { locale: 'en', url: '/' },
      ])}`,
    );

    const obj = {
      callback: console.log,
    };

    const spy = cy.spy(obj, 'callback');

    cy.window()
      .then(async (window) => {
        await isReady(window);
        return window;
      })
      .then((window) => {
        window.addEventListener('message', (message) => {
          const { source, event, payload } = message.data;
          if (source === 'decorator' && event === 'languageSelect') {
            obj.callback(payload);
          }
        });
      })
      .then(() => {
        cy.findByText('Norsk (bokmål)').should('exist');

        cy.findByText('Språk')
          .click()
          .then(() => {
            cy.get('[class*="sprakvelger"]')
              .findByText('English')
              .click()
              .then(() => {
                expect(spy).to.not.be.called;
              });
          });
      });
  });

  it('Available languages handled correctly when set on server (nb)', () => {
    cy.visit(
      `/?availableLanguages=${JSON.stringify([
        { locale: 'nb', url: '/', handleInApp: true },
        { locale: 'en', url: '/' },
      ])}`,
    );

    const obj = {
      callback: console.log,
    };

    const spy = cy.spy(obj, 'callback');

    cy.window()
      .then(async (window) => {
        await isReady(window);
        return window;
      })
      .then((window) => {
        window.addEventListener('message', (message) => {
          const { source, event, payload } = message.data;
          if (source === 'decorator' && event === 'languageSelect') {
            obj.callback(payload);
          }
        });
      })
      .then(() => {
        cy.findByText('Norsk (bokmål)').should('exist');

        cy.findByText('Språk')
          .click()
          .then(() => {
            cy.findByText('Norsk (bokmål)')
              .click()
              .then(() => {
                expect(spy).to.be.calledWith({
                  locale: 'nb',
                  url: '/',
                  handleInApp: true,
                });
              });
          });
      });
  });

  it('utilsBackground', () => {
    cy.visit(
      `/?breadcrumbs=${JSON.stringify([
        { url: '/wat', title: 'Ditt NAV', handleInApp: true },
        { url: '/b', title: 'Kontakt oss' },
      ])}`,
    );

    cy.get('.decorator-utils-container').should(
      'have.css',
      'background-color',
      'rgba(0, 0, 0, 0)',
    );

    setParams({ utilsBackground: 'gray' }).then(() => {
      cy.get('.decorator-utils-container').should(
        'have.css',
        'background-color',
        'rgb(241, 241, 241)',
      );
    });

    setParams({ utilsBackground: 'white' }).then(() => {
      cy.get('.decorator-utils-container').should(
        'have.css',
        'background-color',
        'rgb(255, 255, 255)',
      );
    });
  });

  it('Context', () => {
    cy.viewport(1201, 1337).visit('/');

    cy.get('[class*="lenkeActive"]').should('contain', 'Privat');

    setParams({ context: 'arbeidsgiver' }).then(() => {
      cy.get('[class*="lenkeActive"]').should('contain', 'Arbeidsgiver');
    });
  });
});
