# Bedford Retirement Benefits Navigator v2

A mobile-friendly Next.js application that creates a personalized retirement, GIC, Medicare, spouse, and dependent timeline for Bedford employees and retirees.

## Deployment

This project intentionally uses **Yarn**, not npm, to avoid the npm installation failure encountered in the original Vercel deployment.

1. Upload every file in this folder to the root of the GitHub repository.
2. Confirm that `yarn.lock`, `.yarnrc`, `.nvmrc`, and `package.json` are visible.
3. In Vercel, import the repository or redeploy the latest commit.
4. Vercel should show `yarn install`, not `npm install`.

No environment variables are required.

## Included features

- Automatic date-of-birth to age-65 calculation
- Planned retirement date and personalized timeline
- Middlesex Retirement and MTRS paths
- 10-year GIC eligibility screening
- Medicare status and separate spouse timeline
- Critical Part D, Medicare timing, and qualifying-event warnings
- Mobile-first responsive design
- Persistent desktop navigation
- Searchable FAQ
- Clickable decision trees
- Print and Save-as-PDF summary
- Bedford, GIC, retirement system, Medicare, and SHINE resources
- Accessibility-focused focus states, touch targets, semantic controls, and print layout

## Administrator mode

The current version keeps editable content in arrays near the top of `app/page.tsx`. A future protected administrator page can move those settings into a database without changing the employee-facing design.
