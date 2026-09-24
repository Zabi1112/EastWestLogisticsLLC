import csv, io, json, sys, zipfile
from collections import defaultdict
from pathlib import Path
STATES = set('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC'.split())
CODES = {'PPL', 'PPLA', 'PPLA2', 'PPLA3', 'PPLA4', 'PPLA5', 'PPLC', 'PPLL', 'PPLG', 'PPLR'}
places = defaultdict(set)
with zipfile.ZipFile(sys.argv[1]) as archive:
    with archive.open('US.txt') as source:
        for row in csv.reader(io.TextIOWrapper(source, encoding='utf-8'), delimiter='\t'):
            if len(row) >= 19 and row[8] == 'US' and row[10] in STATES and row[6] == 'P' and row[7] in CODES and row[17]:
                places[(row[10], row[1])].add(row[17])
rows = []
ambiguous = 0
for (state, city), zones in places.items():
    if len(zones) > 1:
        ambiguous += 1
    for zone in sorted(zones):
        label = city if len(zones) == 1 else f'{city} ({zone})'
        rows.append((state, label, zone))
rows.sort(key=lambda row: (row[0], row[1].casefold(), row[2]))
assert set(row[0] for row in rows) == STATES
assert len(rows) == len(set((row[0], row[1]) for row in rows))
assert all(not any(char in value for char in '\t\r\n') for row in rows for value in row)
output = Path(__file__).resolve().parent
for filename, delimiter in [('Locations.csv', ','), ('Locations.tsv', '\t')]:
    with (output / filename).open('w', newline='', encoding='utf-8-sig') as target:
        writer = csv.writer(target, delimiter=delimiter)
        writer.writerow(['State', 'City', 'Time Zone'])
        writer.writerows(rows)
counts = {state: sum(row[0] == state for row in rows) for state in sorted(STATES)}
summary = {'rows': len(rows), 'states_plus_dc': len(counts), 'ambiguous_names_disambiguated_by_zone': ambiguous, 'counts': counts}
(output / 'coverage.json').write_text(json.dumps(summary, indent=2) + '\n', encoding='utf-8')
print(json.dumps(summary, indent=2))
