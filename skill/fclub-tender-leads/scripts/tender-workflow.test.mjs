import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import { isoDate, shiftDate, taipeiDate, expandWeekend, readSources, emptyState, makePlan, normalizeCase, deadlineInfo, validateSource, buildReport, renderReport, acknowledge } from './tender-workflow.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const rules = await fs.readFile(path.resolve(dir, '../../../AGENTS.MD'), 'utf8');
const sources = readSources(rules);
const now = '2026-09-29T00:00:00Z';
const synthetic = (extra = {}) => ({ title: 'Synthetic fixture only', number: 'TEST-001', url: 'https://bid.iii.org.tw/test?id=1', publishedDate: '2026-09-29', round: '1', noticeType: 'tender', lifecycle: 'procurement', detailVerified: true, deadline: '2026-10-02T08:00:00+08:00', ...extra });
const known = (date = '2026-09-28') => {
  const state = emptyState();
  for (const s of sources) state.sources[s.id] = { reportedThrough: date, range: { start: shiftDate(date, -3), end: date }, checkedAt: `${date}T08:30:00Z` };
  return state;
};
const complete = (source, cases = []) => ({ id: source.id, status: 'complete', range: source.range, checkedAt: now, cases,
  verification: { officialListRead: true, structureValid: true, paginationComplete: true, dateCoverageComplete: true, parsedCount: 20, explicitEmpty: false, evidenceUrls: [source.url] } });
const inputFor = (plan, items = []) => ({ runId: plan.runId, sources: plan.sources.map(s => complete(s, s.id === 'iii' ? items : [])) });

test('Taipei midnight, leap year and strict date validation', () => {
  assert.equal(taipeiDate('2026-09-28T16:01:00Z'), '2026-09-29');
  assert.equal(shiftDate('2028-03-01', -1), '2028-02-29');
  assert.throws(() => isoDate('2026-02-30'));
});
test('inclusive Monday, Saturday, Sunday and already-expanded range', () => {
  assert.deepEqual(expandWeekend('2026-09-27', '2026-09-28'), { start: '2026-09-25', end: '2026-09-28' });
  assert.equal(expandWeekend('2026-09-26', '2026-09-29').start, '2026-09-25');
  assert.equal(expandWeekend('2026-09-23', '2026-09-29').start, '2026-09-23');
  assert.throws(() => expandWeekend('2026-09-30', '2026-09-29'));
});
test('canonical source inventory has 14 sources including all Yuanta units', () => {
  assert.equal(sources.length, 14);
  assert.equal(sources.filter(s => s.id.startsWith('yuanta')).length, 3);
  assert.throws(() => readSources('missing'));
});
test('default previous day and five-day unknown history', () => {
  assert.equal(makePlan(sources, known(), { asOf: now }).sources[0].range.start, '2026-09-28');
  assert.equal(makePlan(sources, emptyState(), { asOf: now }).sources[0].range.start, '2026-09-25');
});
test('unknown Monday history includes five calendar days; known Monday includes Friday', () => {
  const monday = '2026-09-28T00:00:00Z';
  assert.equal(makePlan(sources, emptyState(), { asOf: monday }).sources[0].range.start, '2026-09-24');
  assert.equal(makePlan(sources, known('2026-09-25'), { asOf: monday }).sources[0].range.start, '2026-09-25');
});
test('month and year rollover and TAICCA cross-year coverage', () => {
  assert.equal(makePlan(sources, known('2026-09-30'), { asOf: '2026-10-01T00:00:00Z' }).sources[0].range.start, '2026-09-30');
  const source = makePlan(sources, known('2026-12-31'), { asOf: '2027-01-01T00:00:00Z' }).sources.find(s => s.id === 'taicca');
  assert.deepEqual(source.years, [2026, 2027]);
  assert.match(source.url, /year=2027/);
});
test('afternoon has same coverage and distinct mode', () => {
  const plan = makePlan(sources, known(), { asOf: '2026-09-29T08:30:00Z' });
  assert.equal(plan.mode, 'afternoon');
  assert.equal(plan.sources[0].range.start, '2026-09-28');
});
test('future or incomplete requested range is rejected', () => {
  assert.throws(() => makePlan(sources, known(), { asOf: now, start: '2026-09-28' }));
  assert.throws(() => makePlan(sources, known(), { asOf: now, start: '2026-09-28', end: '2026-09-30' }));
});
test('failed, unreadable and snapshot-only sources are never complete', () => {
  const s = makePlan(sources, known(), { asOf: now }).sources[0];
  assert.equal(validateSource(s, null, now).status, 'failed');
  const result = complete(s);
  result.verification.structureValid = false;
  assert.equal(validateSource(s, result, now).status, 'partial');
  result.verification.officialListRead = false;
  assert.equal(validateSource(s, result, now).status, 'partial');
});
test('zero cases require parsed list or explicit empty signal', () => {
  const s = makePlan(sources, known(), { asOf: now }).sources[0];
  const result = complete(s);
  result.verification.parsedCount = 0;
  assert.equal(validateSource(s, result, now).status, 'partial');
  result.verification.explicitEmpty = true;
  assert.equal(validateSource(s, result, now).status, 'complete');
});
test('missing pagination, stale timestamp and wrong ranges remain pending', () => {
  const s = makePlan(sources, known(), { asOf: now }).sources[0];
  for (const mutate of [r => { r.verification.paginationComplete = false; }, r => { r.checkedAt = '2026-09-28T00:00:00Z'; }, r => { r.range = { start: '2026-09-29', end: '2026-09-29' }; }]) {
    const result = complete(s); mutate(result);
    assert.equal(validateSource(s, result, now).status, 'partial');
  }
});
test('prepared but unreported coverage never advances; per-source ack clears only complete checks', () => {
  const state = known('2026-09-22');
  const plan = makePlan(sources, state, { asOf: now });
  const input = inputFor(plan);
  input.sources.find(s => s.id === 'taicca').status = 'failed';
  const report = buildReport(plan, input, state);
  state.pending[plan.runId] = report;
  assert.equal(state.sources.fclub.reportedThrough, '2026-09-22');
  assert.equal(makePlan(sources, state, { asOf: now }).sources[0].range.start, '2026-09-23');
  assert.throws(() => acknowledge(state, plan.runId, ''));
  const delivered = acknowledge(state, plan.runId, 'synthetic final message');
  assert.equal(delivered.sources.fclub.reportedThrough, '2026-09-29');
  assert.equal(delivered.sources.taicca.reportedThrough, '2026-09-22');
  const next = makePlan(sources, delivered, { asOf: '2026-09-30T00:00:00Z' });
  assert.equal(next.sources.find(s => s.id === 'taicca').range.start, '2026-09-23');
  assert.equal(next.sources.find(s => s.id === 'fclub').range.start, '2026-09-29');
});
test('source without successful history recovers after a verified later report', () => {
  let state = emptyState();
  const plan = makePlan(sources, state, { asOf: now });
  const input = inputFor(plan);
  input.sources.find(s => s.id === 'taicca').status = 'failed';
  state.pending[plan.runId] = buildReport(plan, input, state);
  state = acknowledge(state, plan.runId, 'first final');
  const retry = makePlan(sources, state, { asOf: now });
  state.pending[retry.runId] = buildReport(retry, inputFor(retry), state);
  state = acknowledge(state, retry.runId, 'second final');
  assert.equal(state.sources.taicca.reportedThrough, '2026-09-29');
  assert.equal(state.sources.taicca.pendingFrom, null);
});
test('new, unchanged and changed case labels with separate tender rounds', () => {
  let state = known();
  const plan = makePlan(sources, state, { asOf: now });
  const report = buildReport(plan, inputFor(plan, [synthetic()]), state);
  assert.equal(report.counts.new, 1);
  state.pending[plan.runId] = report;
  state = acknowledge(state, plan.runId, 'synthetic final');
  const next = makePlan(sources, state, { asOf: now });
  assert.equal(buildReport(next, inputFor(next, [synthetic()]), state).counts.repeated, 1);
  assert.equal(buildReport(next, inputFor(next, [synthetic({ budget: '100' })]), state).counts.updated, 1);
  const rounds = buildReport(next, inputFor(next, [synthetic(), synthetic({ round: '2' })]), state);
  assert.equal(rounds.counts.new, 1);
  assert.equal(rounds.counts.repeated, 1);
});
test('undated source cases remain explicit and do not invent a publication date', () => {
  const entry = normalizeCase(synthetic({ publishedDate: null }), 'hncb');
  assert.equal(entry.publishedDate, null);
  assert.throws(() => normalizeCase(synthetic({ publishedDate: null }), 'iii'));
});
test('opening time is not a cutoff; decision and intelligence are not active bids', () => {
  assert.equal(deadlineInfo(synthetic({ deadline: null, openingTime: '2026-10-01T08:00:00+08:00' }), now).expired, '未標示');
  assert.equal(deadlineInfo(synthetic({ lifecycle: 'decision' }), now).opportunity, '已決標');
  assert.equal(deadlineInfo(synthetic({ lifecycle: 'intelligence' }), now).urgent, false);
});
test('deadline exact time, date-only same day and urgency boundaries', () => {
  assert.equal(deadlineInfo(synthetic(), now).urgent, true);
  assert.equal(deadlineInfo(synthetic({ deadline: '2026-10-02T08:00:01+08:00' }), now).urgent, false);
  assert.equal(deadlineInfo(synthetic({ deadline: '2026-09-29T08:00:00' }), now).expired, '已過期');
  assert.equal(deadlineInfo(synthetic({ deadline: '2026-09-29' }), now).expired, '今日截止，時間未列示');
  assert.equal(deadlineInfo(synthetic({ deadline: '2026-09-28' }), now).opportunity, '已截止');
  assert.equal(deadlineInfo(synthetic({ detailVerified: false }), now).opportunity, '待確認');
});
test('out-of-range and conflicting duplicate cases invalidate completeness', () => {
  const source = makePlan(sources, known(), { asOf: now }).sources.find(s => s.id === 'iii');
  assert.equal(validateSource(source, complete(source, [synthetic({ publishedDate: '2026-09-20' })]), now).status, 'partial');
  assert.equal(validateSource(source, complete(source, [synthetic(), synthetic({ budget: 20 })]), now).status, 'partial');
});
test('stale plans and duplicate source results are rejected', () => {
  const state = known(); const plan = makePlan(sources, state, { asOf: now });
  const input = inputFor(plan); input.sources.push(input.sources[0]);
  assert.throws(() => buildReport(plan, input, state));
  state.revision++;
  assert.throws(() => buildReport(plan, inputFor(plan), state));
});
test('partial historical catch-up preserves the still-uncovered tail', () => {
  const state = known();
  state.sources.taicca.pendingFrom = '2026-09-20';
  state.sources.taicca.pendingThrough = '2026-09-24';
  const report = { asOf: now, sources: [{ id: 'taicca', status: 'complete', checkedAt: now, range: { start: '2026-09-18', end: '2026-09-22' }, cases: [] }] };
  state.pending.synthetic = report;
  const next = acknowledge(state, 'synthetic', 'synthetic final');
  assert.equal(next.sources.taicca.pendingFrom, '2026-09-23');
  assert.equal(next.sources.taicca.pendingThrough, '2026-09-24');
  assert.equal(next.sources.taicca.reportedThrough, '2026-09-28');
});
test('later confirmed coverage supersedes old undelivered ranges without losing case history', () => {
  let state = known();
  const p1 = makePlan(sources, state, { asOf: now });
  state.pending[p1.runId] = buildReport(p1, inputFor(p1), state);
  const p2 = makePlan(sources, state, { asOf: now });
  state.pending[p2.runId] = buildReport(p2, inputFor(p2), state);
  state = acknowledge(state, p2.runId, 'newer final');
  assert.equal(makePlan(sources, state, { asOf: '2026-09-30T00:00:00Z' }).sources[0].range.start, '2026-09-29');
  assert.ok(state.pending[p1.runId]);
});
test('report uses the last checked time when a deadline expires during collection', () => {
  const state = known(); const plan = makePlan(sources, state, { asOf: now });
  const input = inputFor(plan, [synthetic({ deadline: '2026-09-29T08:05:00+08:00' })]);
  input.sources.find(s => s.id === 'iii').checkedAt = '2026-09-29T00:06:00Z';
  const result = buildReport(plan, input, state);
  assert.equal(result.sources.find(s => s.id === 'iii').cases[0].expired, '已過期');
  assert.equal(result.asOf, '2026-09-29T00:06:00.000Z');
});
test('credential-bearing links are rejected', () => {
  assert.throws(() => normalizeCase(synthetic({ url: 'https://user:secret@example.test/case' }), 'iii'));
});
test('rendering keeps cases, links, provenance statuses and separate locations', () => {
  const state = known(); const plan = makePlan(sources, state, { asOf: now });
  const result = buildReport(plan, inputFor(plan, [synthetic({ performanceLocation: 'Synthetic work site', bidLocation: 'Synthetic opening room' })]), state);
  const text = renderReport(result);
  assert.match(text, /Synthetic work site/);
  assert.match(text, /Synthetic opening room/);
  assert.match(text, /TEST-001/);
  assert.match(text, /完整 14\/14/);
  assert.match(text, /https:\/\/bid.iii.org.tw\/test/);
});
test('CLI round trip does not advance coverage until ack; all files stay local', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'tender-synthetic-'));
  try {
    await fs.writeFile(path.join(root, 'AGENTS.MD'), rules);
    const cli = (...args) => execFileSync(process.execPath, [path.join(dir, 'tender-workflow.mjs'), ...args, '--root', root], { encoding: 'utf8' });
    const plan = JSON.parse(cli('plan', '--as-of', now));
    await fs.writeFile(plan.inputFile, JSON.stringify(inputFor(plan, [synthetic()])));
    const prepared = JSON.parse(cli('prepare', '--input', plan.inputFile));
    assert.equal(prepared.delivered, false);
    const stateFile = path.join(root, '.tender-local/state.json');
    assert.equal(Object.keys(JSON.parse(await fs.readFile(stateFile)).sources).length, 0);
    cli('ack', '--run-id', plan.runId, '--evidence', 'synthetic final');
    assert.equal(JSON.parse(await fs.readFile(stateFile)).sources.iii.reportedThrough, '2026-09-29');
    const invalid = spawnSync(process.execPath, [path.join(dir, 'tender-workflow.mjs'), 'prepare', '--root', root, '--input', path.join(root, 'outside.json')]);
    assert.notEqual(invalid.status, 0);
    await fs.writeFile(stateFile, '{broken');
    const corrupt = spawnSync(process.execPath, [path.join(dir, 'tender-workflow.mjs'), 'plan', '--root', root]);
    assert.notEqual(corrupt.status, 0);
  } finally {
    const resolved = await fs.realpath(root);
    const parent = await fs.realpath(os.tmpdir());
    assert.equal(path.dirname(resolved), parent);
    assert.ok(path.basename(resolved).startsWith('tender-synthetic-'));
    await fs.rm(resolved, { recursive: true });
  }
});
