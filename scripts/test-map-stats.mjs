import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../lib/map-stats.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
const { aggregateRows, emptyRegionData } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const total = data => Object.values(data).reduce((sum, row) => sum + row.participants, 0);
assert.equal(total(emptyRegionData()), 0, 'Loading must not display invented responses');
assert.equal(total(aggregateRows([])), 0, 'Empty RPC results must remain empty');
const result = aggregateRows([
  { region: '서울', result: '진보', cnt: 2 },
  { region: '서울', result: '보수', cnt: '1' },
  { region: '부산', result: '중도', cnt: 4 },
]);
assert.equal(total(result), 7);
assert.equal(result.seoul.participants, 3);
assert.equal(result.seoul.scores.left, 67);
assert.equal(Object.values(result.seoul.scores).reduce((a, b) => a + b), 100);
assert.equal(result.jeju.dominant, '데이터 없음');
assert.equal(total(aggregateRows([{region: '__proto__', result: 'constructor', cnt: 9}])), 0);
for (const cnt of [null, undefined, -1, 1.5, NaN, Infinity, 'oops', '', Number.MAX_SAFE_INTEGER + 1]) {
  assert.throws(() => aggregateRows([{region: '서울', result: '중도', cnt}]));
}
for (const rows of [null, {}, [null]]) assert.throws(() => aggregateRows(rows));
assert.throws(() => aggregateRows([
  {region: '서울', result: '중도', cnt: Number.MAX_SAFE_INTEGER},
  {region: '부산', result: '진보', cnt: 1},
]));
console.log('PASS: empty/loading, counts, rounding, invalid payloads, prototype keys, overflow');
