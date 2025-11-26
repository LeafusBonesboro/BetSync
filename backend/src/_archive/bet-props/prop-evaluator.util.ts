import { distance as levenshtein } from 'fastest-levenshtein';


export function parseProp(description: string) {
  const lower = description.toLowerCase();
  let type: string | null = null;
  if (lower.includes('over')) type = 'over';
  else if (lower.includes('under')) type = 'under';
  else if (lower.includes('td')) type = 'td';

  const valueMatch = description.match(/([\d.]+)/);
  const value = valueMatch ? parseFloat(valueMatch[1]) : null;

  let category: string | null = null;
  if (lower.includes('rushing')) category = 'Rushing';
  else if (lower.includes('passing')) category = 'Passing';
  else if (lower.includes('receiving')) category = 'Receiving';
  else if (lower.includes('receptions')) category = 'Receptions';

  return { type, value, category };
}

export function findPlayer(boxscore: any, playerName: string, category?: string) {
  if (!boxscore || !Array.isArray(boxscore.players)) {
    console.warn('⚠️ Invalid boxscore.players data:', boxscore?.players);
    return null;
  }

  const normalize = (name: string) =>
    name
      .toLowerCase()
      .replace(/\./g, '')
      .replace(/ jr| sr| iii| ii/g, '')
      .trim();

  const target = normalize(playerName);
  const targetLast = target.split(' ').slice(-1)[0];

  let bestMatch: { athlete: any; group: any } | null = null;
  let bestScore = Infinity;

  for (const team of boxscore.players) {
    if (!Array.isArray(team.statistics)) continue;

    for (const group of team.statistics) {
      if (!group?.displayName || !Array.isArray(group.athletes)) continue;
      if (category && !group.displayName.toLowerCase().includes(category.toLowerCase()))
        continue;

      for (const athlete of group.athletes) {
        const rawName = athlete?.athlete?.displayName;
        if (!rawName) continue;

        const norm = normalize(rawName);
        const last = norm.split(' ').slice(-1)[0];
        const score = levenshtein(norm, target);

        // strong match or same last name fallback
        if (score < bestScore || last === targetLast) {
          bestScore = score;
          bestMatch = { athlete, group };
        }
      }
    }
  }

  if (bestMatch) {
    const found = bestMatch.athlete.athlete.displayName;
    console.log(`✅ Matched "${playerName}" ≈ "${found}" (score ${bestScore})`);
    return bestMatch;
  }

  console.warn(`❌ Player not found: ${playerName} (category: ${category || 'any'})`);
  return null;
}


export function evaluateStat(statValue: number, type: string | null, target: number | null) {
  if (statValue == null || target == null) return null;
  if (type === 'over') return statValue > target ? 'Win' : 'Lose';
  if (type === 'under') return statValue < target ? 'Win' : 'Lose';
  if (type === 'td') return statValue > 0 ? 'Win' : 'Lose';
  return null;
}
