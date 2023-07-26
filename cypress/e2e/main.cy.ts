describe("template spec", () => {
  it("Breadcrumbs is set", () => {
    const breadcrumbs = [
      {
        url: "https://www.nav.no/person/dittnav",
        title: "Ditt NAV",
      },
      {
        url: "https://www.nav.no/person/kontakt-oss",
        title: "Kontakt oss",
      },
    ];
    cy.visit(
      "/?breadcrumbs=" + encodeURIComponent(JSON.stringify(breadcrumbs))
    );

    cy.get("#breadcrumbs-list").should("exist");
    // Verify that the breadcrumbs are rendered
    cy.get("#breadcrumbs-list").should("contain", "Ditt NAV");
    cy.get("#breadcrumbs-list").should("contain", "Kontakt oss");
  });
});
