import { Params } from '../../params';

describe('Setting parameters', () => {
  it('Breadcrumbs is set', () => {
    const breadcrumbs = [
      {
        url: 'https://www.nav.no/person/dittnav',
        title: 'Ditt NAV',
      },
      {
        url: 'https://www.nav.no/person/kontakt-oss',
        title: 'Kontakt oss',
      },
    ];

    cy.visit(
      '/?breadcrumbs=' + encodeURIComponent(JSON.stringify(breadcrumbs)),
    );

    cy.get('#breadcrumbs-list').should('exist');
    // Verify that the breadcrumbs are rendered
    cy.get('#breadcrumbs-list').should('contain', 'Ditt NAV');
    cy.get('#breadcrumbs-list').should('contain', 'Kontakt oss');
  });

  it('Language is set', () => {
    cy.visit('/?language=en');

    cy.get('html').should('have.attr', 'lang', 'en');

    // Other languages
    cy.get('footer').should('contain', 'Norwegian');
    cy.get('footer').should('contain', 'Sámegiella');
  });

  it('Simple', () => {
    cy.visit('/?simple=true');

    cy.get('#footer-withmenu').children().should('have.class', 'simple-footer');
  });

  it('Should show feedback box in footer', () => {
    cy.visit('/?feedback=true');

    cy.get('#footer-withmenu').children().should('have.id', 'feedback');
  });
});
