const API = process.env.API_URL ?? 'http://localhost:3000';
const SOURCE = 'https://flagcdn.com/fr/codes.json';

type Codes = Record<string, string>;

async function main() {
  const codes: Codes = await fetch(SOURCE).then((r) => r.json());

  const existing: Array<{ countryCode: string }> = await fetch(
    `${API}/flags`,
  ).then((r) => r.json());
  const known = new Set(existing.map((f) => f.countryCode.toLowerCase()));

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const [countryCode, country] of Object.entries(codes)) {
    if (known.has(countryCode.toLowerCase())) {
      skipped++;
      continue;
    }
    const res = await fetch(`${API}/flags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country, countryCode }),
    });
    if (res.ok) {
      inserted++;
    } else {
      failed++;
      console.error(countryCode, res.status, await res.text());
    }
  }

  console.log({ total: Object.keys(codes).length, inserted, skipped, failed });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
