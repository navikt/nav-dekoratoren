import { describe, expect, it } from "vitest";
import { paramsSchema } from "../params";

describe("teamName validation", () => {
    it("accepts lowercase team names with a dot", () => {
        const params = paramsSchema.parse({
            teamName: "nav-dekoratoren.navno",
        });

        expect(params.teamName).toBe("nav-dekoratoren.navno");
    });

    it("rejects team names with whitespace, uppercase letters, or norwegian characters", () => {
        const invalidValues = [
            "Nav-dekoratoren.navno",
            "nav-dekøratoren.navno",
            "nav-dekoratoren .no",
            "navdekoratorennavno",
        ];

        for (const teamName of invalidValues) {
            expect(() => paramsSchema.parse({ teamName })).toThrow();
        }
    });
});
