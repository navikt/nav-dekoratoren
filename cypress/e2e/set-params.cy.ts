describe("Setting parameters", () => {
  it("Breadcrumbs is set and handled in app", () => {
    const breadcrumbs = [
      {
        url: "/a",
        title: "Ditt NAV",
        handleInApp: true,
      },
      {
        url: "/b",
        title: "Kontakt oss",
      },
      {
        url: "/c",
        title: "NAV Oslo",
      },
    ];

    cy.visit("/");

    cy.findByText("Ditt NAV", { timeout: 7000 }).should("not.exist");

    const obj = {
      callback: (payload: any) => {},
    };

    const spy = cy.spy(obj, "callback");

    cy.window()
      .then((window) => {
        window.addEventListener("message", (message) => {
          const { source, event, payload } = message.data;
          if (source === "decorator" && event === "breadcrumbClick") {
            obj.callback(payload);
          }
        });
        window.postMessage({
          source: "decoratorClient",
          event: "params",
          payload: { breadcrumbs },
        });
      })
      .then(() => {
        cy.findByText("Ditt NAV").should("exist");

        cy.findByText("Ditt NAV")
          .click()
          .then(() => {
            expect(spy).to.have.been.called;
          });
      });
  });
});
