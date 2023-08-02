describe('Setting parameters', () => {
  it('Breadcrumbs is set and handled in app', () => {
    const breadcrumbs = [
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
    ];

    cy.visit('/');

    cy.findByText('Ditt NAV', { timeout: 7000 }).should('not.exist');

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
        window.postMessage({
          source: 'decoratorClient',
          event: 'params',
          payload: { breadcrumbs },
        });
      })
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
    const availableLanguages = [
      {
        locale: 'nb',
        url: 'https://www.nav.no/no/person',
        handleInApp: true,
      },
      {
        locale: 'en',
        url: 'https://www.nav.no/en/person',
        handleInApp: true,
      },
    ];

    cy.visit('/');

    cy.findByText('nb', { timeout: 7000 }).should('not.exist');

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
        window.postMessage({
          source: 'decoratorClient',
          event: 'params',
          payload: { availableLanguages },
        });
      })
      .then(() => {
        cy.findByText('nb').should('exist');

        cy.findByText('nb')
          .click()
          .then(() => {
            expect(spy).to.have.been.called;
          });
      });
  });
});
