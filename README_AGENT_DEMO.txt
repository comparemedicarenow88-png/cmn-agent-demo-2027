CompareMedicareNow — private 2027 agent demo staging package

Upload these site files to GitHub only after reviewing. The package has not been deployed.

IMPORTANT: This is a restricted research preview, not a production-grade comparison engine.
- ZIP 85254 only, 52 general-enrollment records.
- Partial annual estimates exclude drugs, dental, hearing (on Page 3), and other unpriced categories.
- Giveback values are provisional and some source fields require review.
- Outpatient amounts are category maximum estimates, not verified procedure-specific charges.
- Hearing Page 4 uses published copay maxima or agent-entered net quotes, retains all 52 records, and leaves unpriced plans unranked.
- Input and quotes are stored in the agent browser localStorage; do not enter client identifiers.
- No automatic expiration. Individual access should be revoked through hosting/authentication controls when appropriate.
- Feedback uses mailto:support@comparemedicarenow.com; verify that mailbox exists.
- This static ZIP is NOT password-protected; configure password/authentication at hosting before inviting agents.
- The screenshots previously shown were visual mockups, not exact browser captures.

Files: index.html, compare.html, plans.html, hearing.html, demo.css, demo.js, demo-data.js, hearing-data.js.

SECOND-SITE DEPLOYMENT
1. Create a new GitHub repository (e.g. cmn-agent-demo-2027). Do not replace the existing website repository.
2. Upload the files from this ZIP to the root of that new repository.
3. In DigitalOcean Apps, create a NEW app from that repository; choose Static Site and root/index.html. Do not alter the original app.
4. Configure authentication/access restriction BEFORE sharing the URL. Static site alone has no true password protection.
5. Verify feedback mailto opens and that support@comparemedicarenow.com receives mail.
6. Test 4 pages, 52 plan records, hearing quote entry, and original ranking preservation.
7. Do not claim full annual-cost accuracy: drug and dental cost categories are excluded, and some values are estimates.
