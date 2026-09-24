# U.S. locations for the Available Trucks spreadsheet

Files:
- Locations.csv: import into Google Sheets as a new tab, then name it Locations.
- Locations.tsv: alternatively open as text, copy all, and paste into Locations!A1.
- coverage.json: counts by state and total rows.
- TruckSheet-large-locations.gs: replacement for the previous truckSheetEdited function, using range-based city dropdowns. Keep the original setupTruckSheet function and its installed edit trigger. Do not add a second truckSheetEdited function. Also includes an optional configureTruckDateColumn function.

Source: GeoNames US country extract, https://download.geonames.org/export/dump/US.zip
Documentation: https://download.geonames.org/export/dump/readme.txt
Attribution: GeoNames, https://www.geonames.org/
License: Creative Commons Attribution 4.0, https://creativecommons.org/licenses/by/4.0/
Prepared: 2026-09-24. The source is a rolling download; this is the retrieval date, not a guaranteed source release date.

Coverage: all 50 U.S. states plus Washington, DC; territories excluded. Current populated-place feature codes PPL, PPLA, PPLA2, PPLA3, PPLA4, PPLA5, PPLC, PPLL, PPLG, PPLR with a source-provided time zone. No minimum population threshold. Excludes historical/abandoned/destroyed places, sections of cities, and non-populated geographic features such as mountains. This is a nationwide gazetteer list, not a guarantee of every U.S. city, town, postal locality, or delivery address.

Same state/city/time-zone combinations are collapsed. If a city name occurs within the same state in different time zones, the time zone is appended to its dropdown label to avoid silently choosing one. Places with identical names and time zones in different counties are not distinguished; use an address or ZIP separately when necessary for dispatch.

Keep Locations sorted by State and then City. When adding rows, sort all three columns together (excluding the header). The range-based dropdown script requires each state's rows to be contiguous. After changing the reference data, reselect the state/city on affected truck rows to refresh validation and time zones.

Date column: select G2:G in Available Trucks, Format > Number > Date; Data > Data validation > Add rule > Is valid date > Reject input > Done. The header is excluded. Double-click a date cell for the calendar; @date also opens the date picker. The optional configureTruckDateColumn applies formatting and validation to the currently allocated rows; reapply if new appended rows do not inherit it.

No changes have been made to the live Google Sheet. Apps Script code has not been executed against Google Sheets.
