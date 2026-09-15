/**
 * "Benefits" — was Mitgliedschaft konkret gibt. Aus dem Figma-Entwurf
 * "Let's build together the shared rail." und den bestehenden Inhalten.
 */
export type Benefit = { label: string; detail: string };

export const benefits: Benefit[] = [
  {
    label: "Governance seat",
    detail:
      "Vote on protocol changes and elect the supervisory board.",
  },
  {
    label: "Direct network access",
    detail:
      "Europe's leading banks, custodians, and market infrastructure operators on a single regulated rail.",
  },
  {
    label: "Priority onboarding",
    detail:
      "Priority access, priority onboarding and dedicated technical support.",
  },
  {
    label: "Proportional economic rights",
    detail:
      "Your stake earns a proportional share of the network's economics as transaction volume scales across Europe.",
  },
];
