// The complete carrier-earnings.gs already includes this function. Keep only one copy.
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
