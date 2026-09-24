# Broker truck availability page

Direct link: `/available-trucks/` (also `/available-trucks/index.html`). A separate HTML entry is built for GitHub Pages, so opening or refreshing this link works without a server rewrite. The homepage remains unchanged; share this direct link with brokers.

The Available Trucks tab is read through its published CSV link. The carrier signup endpoint and carrier directory keep their separate configuration. Locations is a reference tab used by Apps Script; the website does not need to fetch it.

## Configuration

`VITE_SHEETS_TRUCKS_CSV_URL` is configured in the local `.env`. The GitHub Pages workflow has the supplied public feed URL as a fallback; an optional repository Actions secret with this name can override it. The CSV endpoint is public configuration, not a credential. Changing this URL requires a rebuild; editing sheet rows does not.

Publish only the broker-facing Available Trucks tab as CSV. Keep the private signup tab unpublished. The CSV itself includes all published rows; website status filtering is not access control.

## Sheet behavior

Keep these exact headers: Truck ID, Company Name, Company MC, Equipment Type, Empty State, Empty City, Available Date, Available Time, Time Zone, Availability, Preferred Destination, Dispatcher Name, Dispatcher Phone, Last Updated.

Only Available rows with a truck ID, company, empty state and city are shown. Booked, Unavailable, empty statuses and incomplete rows are omitted. Future dates remain visible for advance booking. Dates and times are displayed as entered with the truck's IANA time zone; the browser never converts them into the broker's time zone. Last Updated is displayed as dispatch office time because its sheet value has no UTC offset. Set the spreadsheet time zone appropriately.

The board fetches on opening, every minute while visible, when the tab becomes visible, and on Refresh listings. Google publishing/cache delays may still delay new edits. A failed refresh hides earlier results to avoid presenting unconfirmed listings. Missing/invalid dispatcher phone values use the existing company dispatch number as a clearly labeled fallback.

No online reservation is created. Brokers call dispatch to confirm timing, carrier eligibility and book a load.

## Verification

Run `node --test src/lib/trucks.test.js`, `npm run build`, and `npm run lint`.

Manual check: open `/available-trucks/`; check location, MC and dispatcher phone; filter by CA and Dry Van; search for a nonexistent city and clear filters. Change the dummy row from Available to Booked in the sheet and refresh after Google publishes the change. Test direct opening of the deployed URL on mobile and desktop.
