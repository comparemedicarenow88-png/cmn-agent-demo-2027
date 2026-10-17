# 2027 CMS Drug Integration Status

Branch: feature/cms-drug-pricing (NOT deployed)

## Implemented and statically checked
- 245 CMS negotiated maximum fair price records indexed by exact 11-digit NDC.
- Page 2 exact NDC, quantity per fill, and annual fills fields.
- Browser-local preservation of these three values.
- Reference lookup renders CMS reference cost per fill and annual reference total.
- Missing NDC and invalid input are flagged as unavailable, not interpreted as uncovered.
- The existing medical rankings are unchanged.

## Verified reference test
Eliquis NDC 00003089321: $4.257193 per unit; 60 units = $255.43 per fill; 12 fills = $3,065.16 (rounded fill totals). This is NOT patient out-of-pocket cost.

## Still required before deploying or using in plan comparisons
- Real browser smoke test on a development deployment.
- Confirmed plan-specific 2027 formulary/contract mapping, coverage restrictions, CVS network pharmacy rates, deductibles, tier copays/coinsurance, and Part D coverage stage rules.
- Verified plan-specific member-cost engine and all-52-plan drug-inclusive rankings.
- Test cases across Devoted, HealthSpring and AARP Patriot, including noncovered/unavailable drugs.
- Agent-visible labels must keep CMS reference amounts separate from plan member estimates.

Do not merge or deploy until the above validations are completed.

## Three-plan illustrative scenarios (2026-10-17)
The input page now shows Devoted Giveback 091, HealthSpring Preferred, and AARP Patriot No Rx. An agent can enter a hypothetical annual deductible and coinsurance rate. The result is labeled illustrative and is not connected to rankings. AARP Patriot No Rx is flagged as no Part D benefit. These are not verified plan calculations. Exact 2027 EOC cost-sharing and formulary tier, pharmacy price, and coverage-stage data remain outstanding. No live deployment or browser validation performed.
