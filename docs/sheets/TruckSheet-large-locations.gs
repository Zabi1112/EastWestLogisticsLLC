// Replace the previous truckSheetEdited function with this version.
// Keep setupTruckSheet and its installed edit trigger.
function truckSheetEdited(event) {
  if (!event || !event.range) return;
  const sheet = event.range.getSheet();
  if (sheet.getName() !== 'Available Trucks' || event.range.getColumn() > 13) return;
  const first = Math.max(2, event.range.getRow());
  const last = event.range.getLastRow();
  if (last < first) return;
  const locationChanged = event.range.getColumn() <= 6 && event.range.getLastColumn() >= 5;
  const reference = event.source.getSheetByName('Locations');
  let locations = [];
  if (locationChanged) {
    if (!reference) throw new Error('The Locations tab is missing.');
    if (reference.getLastRow() > 1) {
      locations = reference.getRange(2, 1, reference.getLastRow() - 1, 3).getDisplayValues();
    }
  }
  const now = new Date();
  for (let row = first; row <= last; row++) {
    if (locationChanged) {
      const state = sheet.getRange(row, 5).getDisplayValue().trim();
      const cityCell = sheet.getRange(row, 6);
      const zoneCell = sheet.getRange(row, 9);
      const start = state ? locations.findIndex(item => item[0].trim().toUpperCase() === state) : -1;
      cityCell.clearDataValidations();
      let match;
      if (start >= 0) {
        let end = start;
        while (end < locations.length && locations[end][0].trim().toUpperCase() === state) end++;
        // The supplied Locations file is sorted by state, then city.
        cityCell.setDataValidation(SpreadsheetApp.newDataValidation()
          .requireValueInRange(reference.getRange(start + 2, 2, end - start, 1), true)
          .setAllowInvalid(false).build());
        const city = cityCell.getDisplayValue().trim();
        match = locations.slice(start, end).find(item => item[1] === city);
      }
      if (match) zoneCell.setValue(match[2]);
      else {
        cityCell.clearContent();
        zoneCell.clearContent();
      }
    }
    const hasData = sheet.getRange(row, 1, 1, 13).getDisplayValues()[0].some(value => value.trim());
    if (hasData) sheet.getRange(row, 14).setValue(now);
    else sheet.getRange(row, 14).clearContent();
  }
}

// Optional: run once to apply date formatting and validation to column G.
function configureTruckDateColumn() {
  const sheet = SpreadsheetApp.getActive().getSheetByName('Available Trucks');
  if (!sheet) throw new Error('The Available Trucks tab is missing.');
  sheet.getRange('G2:G').setNumberFormat('yyyy-mm-dd').setDataValidation(
    SpreadsheetApp.newDataValidation().requireDate().setAllowInvalid(false).build()
  );
}

// Run this once from the editor to restore existing city dropdowns and the edit trigger.
function repairTruckDropdowns() {
  const book = SpreadsheetApp.getActive();
  const trucks = book.getSheetByName('Available Trucks');
  const reference = book.getSheetByName('Locations');
  if (!trucks || !reference) throw new Error('Tabs must be named Available Trucks and Locations.');
  if (reference.getLastRow() < 2) throw new Error('Locations has no data below its header.');
  const rows = reference.getRange(2, 1, reference.getLastRow() - 1, 3).getDisplayValues();
  const groups = new Map();
  let previous = '';
  rows.forEach((item, index) => {
    const state = item[0].trim().toUpperCase();
    if (!state || !item[1].trim() || !item[2].trim()) {
      throw new Error('Locations row ' + (index + 2) + ' has a missing state, city, or time zone.');
    }
    if (state !== previous) {
      if (groups.has(state)) throw new Error('Sort Locations A2:C by State, then City, with all three columns selected.');
      groups.set(state, { start: index + 2, count: 0, zones: new Map() });
    }
    const group = groups.get(state);
    group.count++;
    group.zones.set(item[1].trim(), item[2].trim());
    previous = state;
  });
  const rules = new Map();
  groups.forEach((group, state) => rules.set(state,
    SpreadsheetApp.newDataValidation()
      .requireValueInRange(reference.getRange(group.start, 2, group.count, 1), true)
      .setAllowInvalid(false).build()
  ));
  const count = trucks.getLastRow() - 1;
  let repaired = 0;
  const missing = new Set();
  if (count > 0) {
    const values = trucks.getRange(2, 5, count, 2).getDisplayValues();
    const validations = trucks.getRange(2, 6, count, 1).getDataValidations();
    const zones = trucks.getRange(2, 9, count, 1).getValues();
    values.forEach(([rawState, city], index) => {
      const state = rawState.trim().toUpperCase();
      if (!state) return;
      const group = groups.get(state);
      if (!group) { missing.add(state); return; }
      validations[index][0] = rules.get(state);
      const zone = group.zones.get(city.trim());
      if (zone) zones[index][0] = zone;
      repaired++;
    });
    trucks.getRange(2, 6, count, 1).setDataValidations(validations);
    trucks.getRange(2, 9, count, 1).setValues(zones);
  }
  configureTruckDateColumn();
  const installed = ScriptApp.getProjectTriggers().some(trigger =>
    trigger.getHandlerFunction() === 'truckSheetEdited' &&
    trigger.getEventType() === ScriptApp.EventType.ON_EDIT &&
    trigger.getTriggerSourceId() === book.getId()
  );
  if (!installed) ScriptApp.newTrigger('truckSheetEdited').forSpreadsheet(book).onEdit().create();
  const message = 'Restored city dropdowns on ' + repaired + ' row(s). Date column G is configured.' +
    (missing.size ? ' No location match for: ' + [...missing].join(', ') + '. Use two-letter state codes such as TX.' : '');
  console.log(message);
  book.toast(message, 'Truck sheet repair', 15);
}

