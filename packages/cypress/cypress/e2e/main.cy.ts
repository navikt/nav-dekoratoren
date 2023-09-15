describe('Setting parameters', () => {
  it('Breadcrumbs is set', () => {
    const breadcrumbs = [
      {
        url: 'https://www.nav.no/person/dittnav',
        title: 'Ditt NAV',
      },
      {
        url: 'https://www.nav.no/person/kontakt-oss',
        title: 'Kontakt NAV',
      },
    ];

    cy.visit('/?breadcrumbs=' + JSON.stringify(breadcrumbs));

    cy.findByText('Ditt NAV').should('exist');
    cy.findByText('Kontakt NAV').should('exist');
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

    cy.findByText('Til toppen').should('not.exist');
  });

  it('Should show feedback box in footer', () => {
    cy.visit('/?feedback=true');

    cy.findByText('Fant du det du lette etter?').should('exist');
  });
});
