// DEPLOY IN A NEW, SEPARATE APPS SCRIPT PROJECT. Do not replace the truck doGet.
// Execute as Me; access Anyone. The deploying account needs access to both sheets.
// Only aggregate gross/counts leave this script. Source rows and identities stay private.
var EARNINGS_SOURCES = [
  { id: '1nlxT-2iqMC6O2nTbsWaea1dflT90xXmg7GDZq6bn64Y', gid: 415594944, order: 'MD', year: 2026 },
  { id: '1i_AcLyWdVOzYZcteyvJ_sq4WNJfbKVtF0qKOEqKRjgs', gid: 0, order: 'DM', year: 2026 }
];

function doGet() {
  try {
    return earningsJson_(buildCarrierEarnings());
  } catch (error) {
    console.error(error.stack || error.message);
    return earningsJson_({ error: 'Earnings report is temporarily unavailable.' });
  }
}

// Run once in the editor to authorize access and check the source data.
function validateCarrierEarnings() {
  var result = buildCarrierEarnings();
  console.log(JSON.stringify({ weeks: result.weekly.length, months: result.monthly.length, loads: result.monthly.reduce(function (sum, report) { return sum + report.rows.reduce(function (n, row) { return n + row.loads; }, 0); }, 0) }));
}

function earningsJson_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function earningsDate_(value, order, year, zone) {
  var y, m, d;
  if (value instanceof Date && !isNaN(value.getTime())) {
    var parts = Utilities.formatDate(value, zone, 'yyyy-MM-dd').split('-');
    y = Number(parts[0]); m = Number(parts[1]); d = Number(parts[2]);
  } else {
    var text = String(value).trim();
    var iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(text);
    var short = /^(\d{1,2})[-/](\d{1,2})(?:[-/](\d{4}))?$/.exec(text);
    if (iso) { y = +iso[1]; m = +iso[2]; d = +iso[3]; }
    else if (short) {
      y = short[3] ? +short[3] : year;
      m = +(order === 'MD' ? short[1] : short[2]);
      d = +(order === 'MD' ? short[2] : short[1]);
    } else throw new Error('Use a real date or an unambiguous date with a four-digit year.');
  }
  var date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) throw new Error('Invalid date.');
  return date.toISOString().slice(0, 10);
}

function earningsCents_(value) {
  if (typeof value === 'number') {
    if (!isFinite(value) || value < 0) throw new Error('Invalid booking rate.');
    return Math.round(value * 100);
  }
  var text = String(value).trim().replace(/^\$\s*/, '').replace(/,/g, '');
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) throw new Error('Invalid booking rate.');
  return Math.round(Number(text) * 100);
}

function buildCarrierEarnings() {
  var entries = [];
  EARNINGS_SOURCES.forEach(function (source, sourceIndex) {
    var book = SpreadsheetApp.openById(source.id);
    var sheet = book.getSheets().filter(function (tab) { return tab.getSheetId() === source.gid; })[0];
    if (!sheet) throw new Error('Source ' + (sourceIndex + 1) + ': tab not found.');
    var header = sheet.getRange(3, 1, 1, 14).getDisplayValues()[0];
    if (String(header[0]).trim().toLowerCase() !== 'date' || String(header[1]).trim().toLowerCase() !== 'booking rate' || String(header[13]).replace(/\s+/g, ' ').trim().toLowerCase() !== 'update status') throw new Error('Source headers changed; expected Date (A), Booking Rate (B), Update Status (N) in row 3.');
    if (sheet.getLastRow() < 4) return;
    var range = sheet.getRange(4, 1, sheet.getLastRow() - 3, 14);
    var rows = range.getValues();
    // Displayed dates are authoritative: imported native dates may have swapped month/day.
    // Qaswaa is MD; Dark Side is DM. Yearless displayed dates belong to source.year.
    var display = range.getDisplayValues();
    rows.forEach(function (row, index) {
      if (String(row[13]).trim().toUpperCase() !== 'DONE') return;
      // Ignore prefilled DONE dropdowns on rows without both a date and rate.
      if (String(row[0]).trim() === '' && String(row[1]).trim() === '') return;
      try {
        if (String(row[0]).trim() === '' || String(row[1]).trim() === '') throw new Error('DONE row is missing date or booking rate.');
        entries.push({ date: earningsDate_(display[index][0], source.order, source.year, book.getSpreadsheetTimeZone()), cents: earningsCents_(row[1]) });
      } catch (error) { throw new Error('Source ' + (sourceIndex + 1) + ', row ' + (index + 4) + ': ' + error.message); }
    });
  });
  return aggregateCarrierEarnings_(entries);
}

function aggregateCarrierEarnings_(entries) {
  var weekly = {}, monthly = {};
  var weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  entries.forEach(function (entry) {
    var date = new Date(entry.date + 'T00:00:00Z');
    var dayIndex = (date.getUTCDay() + 6) % 7;
    var monday = new Date(date.getTime() - dayIndex * 86400000).toISOString().slice(0, 10);
    var month = entry.date.slice(0, 7);
    if (!weekly[monday]) weekly[monday] = { id: monday, title: 'Weekly gross', period: monday + ' to ' + new Date(new Date(monday + 'T00:00:00Z').getTime() + 6 * 86400000).toISOString().slice(0, 10), unit: 'Day', rows: weekdays.map(function (label) { return { label: label, cents: 0, loads: 0 }; }) };
    weekly[monday].rows[dayIndex].cents += entry.cents;
    weekly[monday].rows[dayIndex].loads++;
    if (!monthly[month]) {
      var days = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
      monthly[month] = { id: month, title: 'Monthly gross', period: month, unit: 'Dates', rows: [] };
      // Calendar-month segments; each load is counted once, even across week boundaries.
      for (var start = 1; start <= days; start += 7) monthly[month].rows.push({ label: start + '-' + Math.min(start + 6, days), cents: 0, loads: 0 });
    }
    var bucket = Math.floor((date.getUTCDate() - 1) / 7);
    monthly[month].rows[bucket].cents += entry.cents;
    monthly[month].rows[bucket].loads++;
  });
  function output(groups) {
    return Object.keys(groups).sort().reverse().map(function (key) {
      var report = groups[key];
      report.rows = report.rows.map(function (row) { return { label: row.label, gross: row.cents / 100, loads: row.loads }; });
      return report;
    });
  }
  return { version: 1, currency: 'USD', generatedAt: new Date().toISOString(), weekly: output(weekly), monthly: output(monthly) };
}

// Run in the editor only. Logs source row numbers for future DONE dates.
// This diagnostic is not returned by the public endpoint.
function auditCarrierEarningsDates() {
  EARNINGS_SOURCES.forEach(function (source, sourceIndex) {
    var book = SpreadsheetApp.openById(source.id);
    var sheet = book.getSheets().filter(function (tab) { return tab.getSheetId() === source.gid; })[0];
    if (!sheet || sheet.getLastRow() < 4) return;
    var zone = book.getSpreadsheetTimeZone();
    var today = Utilities.formatDate(new Date(), zone, 'yyyy-MM-dd');
    var range = sheet.getRange(4, 1, sheet.getLastRow() - 3, 14);
    var values = range.getValues();
    var display = range.getDisplayValues();
    values.forEach(function (row, index) {
      if (String(row[13]).trim().toUpperCase() !== 'DONE' || !String(row[0]).trim()) return;
      try {
        var interpreted = earningsDate_(display[index][0], source.order, source.year, zone);
        if (interpreted > today) console.log(JSON.stringify({
          source: sourceIndex + 1, row: index + 4,
          displayedDate: display[index][0], interpretedDate: interpreted,
          dateCellIsNativeDate: row[0] instanceof Date,
          bookingRate: display[index][1]
        }));
      } catch (error) {
        console.log('Source ' + (sourceIndex + 1) + ', row ' + (index + 4) + ': ' + error.message);
      }
    });
  });
}
