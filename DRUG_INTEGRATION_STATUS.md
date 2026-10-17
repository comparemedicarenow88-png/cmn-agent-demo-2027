# CMS 2027 drug pricing integration status

Development branch only: feature/cms-drug-pricing. Not deployed.

## Added
- cms-mfp-2027.js: 245 exact-NDC CMS maximum fair price records from previously prepared 2027 selected-drug file. Leading zeroes restored to 11-digit NDCs.
- cms-drug-reference.js: exact-NDC reference price lookup and separate illustrative deductible/coinsurance helper.

## NOT completed
- The current Page 2 drug checkboxes are still only saved; no 11-digit NDC entry and quantity UI is connected.
- No per-plan 2027 formulary-to-contract mapping, pharmacy network prices, negotiated dispensing fees, deductible, tier copay/coinsurance and coverage-stage data are linked.
- No verified plan-specific member cost calculation or 52-plan drug-inclusive ranking exists.
- These two new scripts are NOT yet loaded in compare.html or deployed.

## Safety
Do not use MFP as member copay. Do not label MFP-based illustrations as plan-specific quotes.
Preserve existing medical ranking until plan-specific drug costs are validated.
Next: obtain validated 2027 plan/formulary/benefit mappings and CVS pricing assumptions, build plan-specific drug engine and test Eliquis across Devoted, HealthSpring, AARP Patriot.
