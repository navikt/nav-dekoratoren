import AxeBuilder from "@axe-core/playwright";
import { expect } from "@playwright/test";
import { test } from "./fixtures";

test("should not have any automatically detectable accessibility issues", async ({
    page,
}) => {
    const results = await new AxeBuilder({
        page: page as any,
    }).analyze();

    const violations = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map((n) => ({
            target: n.target,
            html: n.html,
            failureSummary: n.failureSummary,
        })),
    }));

    expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
