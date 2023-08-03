import { Params } from '@/params';

describe('Setting parameters', () => {
  it('Breadcrumbs is set and handled in app', () => {
    cy.visit('/');

    cy.findByText('Ditt NAV').should('not.exist');

    const obj = {
      callback: (payload: any) => {},
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
            expect(spy).to.have.been.called;
          });
      });
  });

  it('Available languages is set and handled in app', () => {
    cy.visit('/');

    cy.findByText('nb').should('not.exist');

    const obj = {
      callback: (payload: any) => {},
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
            { locale: 'nb', handleInApp: true },
            { locale: 'en' },
          ],
        }),
      )
      .then(() => {
        cy.findByText('nb').should('exist');

        cy.findByText('nb')
          .click()
          .then(() => {
            expect(spy).to.have.been.called;
          });
      });
  });

  it('Context', () => {
    cy.visit('/');

    cy.findByText('Privatperson', {
      selector: '.context-link',
    }).should('have.class', 'active');
    cy.findByText('Arbeidsgiver', {
      selector: '.context-link',
    }).should('not.have.class', 'active');

    setParams({ context: 'arbeidsgiver' }).then(() => {
      cy.findByText('Privatperson', {
        selector: '.context-link',
      }).should('not.have.class', 'active');
      cy.findByText('Arbeidsgiver', {
        selector: '.context-link',
      }).should('have.class', 'active');
    });
  });
});

const setParams = (params: Partial<Params>): Cypress.Chainable =>
  cy.window().then((window) => {
    window.postMessage({
      source: 'decoratorClient',
      event: 'params',
      payload: params,
    });
  });
