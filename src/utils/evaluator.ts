import { OndiceChoice, HandType } from '../types/ondice';

/**
 * Evaluates 4 dice to find ALL valid Ondice choices that can be formed.
 * Each choice adheres strictly to the exact Ondice ranking rules (1 to 36).
 */
export function evaluateRoll(dice: [number, number, number, number]): OndiceChoice[] {
  const choices: OndiceChoice[] = [];
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const valToIndices: Record<number, number[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

  dice.forEach((val, idx) => {
    if (val >= 1 && val <= 6) {
      counts[val] = (counts[val] || 0) + 1;
      valToIndices[val].push(idx);
    }
  });

  const uniqueVals = Object.keys(counts)
    .map(Number)
    .filter((v) => counts[v] > 0);

  // 1. Đơn (Singles)
  uniqueVals.forEach((val) => {
    let rank: number;
    if (val === 6) {
      rank = 11; // 6 đơn is placed after 5 đôi!
    } else {
      rank = val; // 1 -> rank 1, 2 -> rank 2, ..., 5 -> rank 5
    }

    choices.push({
      id: `single_${val}`,
      name: `${val} đơn`,
      rank,
      type: 'single',
      value: val,
      diceIndices: [valToIndices[val][0]],
      description: `Lấy 1 viên số ${val}`,
    });
  });

  // 2. Đôi (Pairs)
  uniqueVals.forEach((val) => {
    if (counts[val] >= 2) {
      let rank: number;
      if (val === 6) {
        rank = 21; // 6 đôi is placed after 5 tam!
      } else {
        rank = 5 + val; // 1 đôi -> rank 6, ..., 5 đôi -> rank 10
      }

      choices.push({
        id: `pair_${val}`,
        name: `${val} đôi`,
        rank,
        type: 'pair',
        value: val,
        diceIndices: valToIndices[val].slice(0, 2),
        description: `Cặp 2 viên số ${val}`,
      });
    }
  });

  // 3. 3 số liên tiếp (Straight 3)
  const straight3Defs = [
    { seq: [1, 2, 3], name: '1 ~ 3', rank: 12 },
    { seq: [2, 3, 4], name: '2 ~ 4', rank: 13 },
    { seq: [3, 4, 5], name: '3 ~ 5', rank: 14 },
    { seq: [4, 5, 6], name: '4 ~ 6', rank: 15 },
  ];

  straight3Defs.forEach(({ seq, name, rank }) => {
    if (seq.every((num) => counts[num] >= 1)) {
      const usedIndices = seq.map((num) => valToIndices[num][0]);
      choices.push({
        id: `straight3_${name}`,
        name,
        rank,
        type: 'straight3',
        value: seq[2],
        diceIndices: usedIndices,
        description: `Chuỗi liên tiếp 3 số ${name}`,
      });
    }
  });

  // 4. Tam (Triples)
  uniqueVals.forEach((val) => {
    if (counts[val] >= 3) {
      let rank: number;
      if (val === 6) {
        rank = 25; // 6 tam is placed after 3 ~ 6!
      } else {
        rank = 15 + val; // 1 tam -> 16, 2 tam -> 17, 3 tam -> 18, 4 tam -> 19, 5 tam -> 20
      }

      choices.push({
        id: `triple_${val}`,
        name: `${val} tam`,
        rank,
        type: 'triple',
        value: val,
        diceIndices: valToIndices[val].slice(0, 3),
        description: `Bộ 3 viên số ${val}`,
      });
    }
  });

  // 5. 4 số liên tiếp (Straight 4)
  const straight4Defs = [
    { seq: [1, 2, 3, 4], name: '1 ~ 4', rank: 22 },
    { seq: [2, 3, 4, 5], name: '2 ~ 5', rank: 23 },
    { seq: [3, 4, 5, 6], name: '3 ~ 6', rank: 24 },
  ];

  straight4Defs.forEach(({ seq, name, rank }) => {
    if (seq.every((num) => counts[num] >= 1)) {
      const usedIndices = seq.map((num) => valToIndices[num][0]);
      choices.push({
        id: `straight4_${name}`,
        name,
        rank,
        type: 'straight4',
        value: seq[3],
        diceIndices: usedIndices,
        description: `Chuỗi liên tiếp 4 số ${name}`,
      });
    }
  });

  // 6. Đôi hai (Two Pairs)
  // E.g. 1-1-2-2 => max is 2 (Rank 26)
  // Check pairs
  const pairValues = uniqueVals.filter((val) => counts[val] >= 2);
  if (pairValues.length >= 2) {
    // 2 distinct pairs e.g. [1, 1, 2, 2]
    const p1 = pairValues[0];
    const p2 = pairValues[1];
    const maxVal = Math.max(p1, p2);
    const rank = 24 + maxVal; // maxVal 2 -> rank 26, maxVal 3 -> 27, ..., maxVal 6 -> 30

    choices.push({
      id: `two_pairs_${p1}_${p2}`,
      name: `đôi hai tối đại ${maxVal}`,
      rank,
      type: 'two_pairs',
      value: maxVal,
      diceIndices: [...valToIndices[p1].slice(0, 2), ...valToIndices[p2].slice(0, 2)],
      description: `Hai đôi (${p1}-${p1} & ${p2}-${p2}) tối đại ${maxVal}`,
    });
  } else if (pairValues.length === 1 && counts[pairValues[0]] === 4) {
    // 4 of a kind can also optionally be played as two pairs of same number
    const maxVal = pairValues[0];
    if (maxVal >= 2) {
      const rank = 24 + maxVal;
      choices.push({
        id: `two_pairs_quad_${maxVal}`,
        name: `đôi hai tối đại ${maxVal}`,
        rank,
        type: 'two_pairs',
        value: maxVal,
        diceIndices: [0, 1, 2, 3],
        description: `Hai đôi cùng số tối đại ${maxVal}`,
      });
    }
  }

  // 7. Tứ (Quads)
  uniqueVals.forEach((val) => {
    if (counts[val] === 4) {
      const rank = 30 + val; // 1 tứ -> 31, ..., 6 tứ -> 36
      choices.push({
        id: `quad_${val}`,
        name: `${val} tứ`,
        rank,
        type: 'quad',
        value: val,
        diceIndices: [0, 1, 2, 3],
        description: `Bộ 4 viên tứ quý ${val}`,
      });
    }
  });

  // Sort choices by rank ascending
  return choices.sort((a, b) => a.rank - b.rank);
}

/**
 * Filter valid playable choices against the current table choice.
 * In Ondice:
 * - A choice with rank > tableChoice.rank can BEAT it.
 * - A choice with rank === tableChoice.rank triggers PHẢN CÔNG (Counter-Attack)!
 */
export function getPlayableChoices(
  allChoices: OndiceChoice[],
  tableChoice: OndiceChoice | null
): {
  playable: OndiceChoice[];
  counterAttackChoices: OndiceChoice[];
  higherChoices: OndiceChoice[];
} {
  if (!tableChoice) {
    return {
      playable: allChoices,
      counterAttackChoices: [],
      higherChoices: allChoices,
    };
  }

  const counterAttackChoices = allChoices.filter((c) => c.rank === tableChoice.rank);
  const higherChoices = allChoices.filter((c) => c.rank > tableChoice.rank);
  const playable = [...higherChoices, ...counterAttackChoices];

  return {
    playable,
    counterAttackChoices,
    higherChoices,
  };
}
