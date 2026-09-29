# Combined carrier earnings

The aggregator reads only the specified tabs in the two private Google Sheets. Column A supplies load date, B supplies Booking Rate, and N must equal DONE (case-insensitive). Booking Status in Q is intentionally ignored. Source headers are expected on row 3. Every eligible row counts once; no load ID was provided for cross-sheet deduplication, so the same load must not be entered in both sheets.

Qaswaa: tab gid 415594944, text dates month-day, default year 2026. Dark Side: gid 0, text dates day-month, default year 2026. Displayed column-A values are authoritative even when Sheets stores a native Date: an audit confirmed that imported native dates can have month/day reversed. The parser applies each source's confirmed date order to the displayed text. Text dates with explicit years retain that year; yearless text dates use the configured 2026. Use full dates for future years.

The weekly reports run Monday-Sunday, including weeks spanning months or years. Monthly reports use calendar months; chart buckets cover dates 1-7, 8-14, 15-21, 22-28, and the remaining dates. The newest recorded period is selected initially; older periods can be selected. Periods without recorded DONE loads are not synthesized. Blank prefilled DONE rows are ignored. Missing/invalid dates or rates on other DONE rows fail the report rather than publish misleading partial totals. Negative/ambiguous rates must be resolved in the source before publishing. Zero rates are valid.

## Installation

1. Create a separate project at https://script.google.com/ while signed into an account that can read both sheets. Do not change the existing truck availability project.
2. Paste all of google-apps-script/carrier-earnings.gs into Code.gs.
3. Run validateCarrierEarnings and authorize access. The execution log shows aggregate counts or identifies source and row requiring correction.
4. Deploy > New deployment > Web app. Execute as Me; access Anyone.
5. Share the /exec URL for website configuration. It exposes combined period totals/counts only; keep source sheets private.
6. Set VITE_SHEETS_EARNINGS_API_URL locally and for the GitHub Pages build, then rebuild/deploy.

The site checks the summary once a minute while visible and on returning to the tab. A configured feed error hides the report rather than showing demo or stale data. Without a configured URL, the existing clearly labeled illustrative report remains. No production activation has occurred merely by preparing these files.

Validation: node --test google-apps-script/carrier-earnings.test.mjs; npm run build; npm run lint. Actual sheet access and totals must be verified after the owner authorizes and deploys the endpoint.

When updating: replace Code.gs with the complete carrier-earnings.gs. It includes auditCarrierEarningsDates, so remove any separate duplicate of that function. Run validation and the audit, then update the existing web app deployment to a New version. The /exec URL stays the same.
