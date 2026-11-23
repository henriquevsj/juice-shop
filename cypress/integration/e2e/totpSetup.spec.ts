describe("/#/basket", () => {
  describe("as wurstbrot", () => {
    beforeEach(() => {
      cy.login({
        email: "wurstbrot",
        password: Cypress.env("WURSTBROT_PASSWORD"),
        totpSecret: Cypress.env("WURSTBROT_TOTP_SECRET"),
      });
    });

    it("should show an success message for 2fa enabled accounts", () => {
      cy.visit("/#/privacy-security/two-factor-authentication");
    });
  });

  describe("as amy", () => {
    beforeEach(() => {
      cy.login({
        email: "amy",
        password: Cypress.env("AMY_PASSWORD"),
      });
    });

    it("should be possible to setup 2fa for a account without 2fa enabled", async () => {
      cy.visit("/#/privacy-security/two-factor-authentication");

      cy.get("#initalToken")
        .should("have.attr", "data-test-totp-secret")
        .then(($val) => {
          // console.log($val);
          cy.get("#currentPasswordSetup").type(Cypress.env("AMY_PASSWORD"));

          cy.task("GenerateAuthenticator", $val).then((secret: string) => {
            cy.get("#initalToken").type(secret);
            cy.get("#setupTwoFactorAuth").click();

            cy.get("#currentPasswordDisable").type(Cypress.env("AMY_PASSWORD"));
            cy.get("#disableTwoFactorAuth").click();
          });
        });
      cy.get(".mat-snack-bar-container").should(
        "contain",
        "Two-Factor Authentication has been removed."
      );
    });
  });
});