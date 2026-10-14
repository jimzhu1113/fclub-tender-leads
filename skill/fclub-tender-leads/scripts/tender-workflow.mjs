import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

const DAY = 86400000;
const TZ = 'Asia/Taipei';
const MISSING = '未列示';
const SOURCE_META = {
  'fclub.tw': ['fclub', 'FABAO CLUB 今日案件'],
  'ebulletin.tcb-bank.com.tw': ['tcb', '合作金庫採購公告今日案件'],
  'hncb.com.tw': ['hncb', '華南銀行採購情報今日案件'],
  'tbb.com.tw': ['tbb', '臺灣企銀招標公告今日案件'],
  'bankchb.com': ['chb', '彰化銀行招標公告今日案件'],
  'bid.iii.org.tw': ['iii', '資策會採購公告今日案件'],
  'megabank.com.tw': ['mega', '兆豐銀行業務公告今日案件'],
  'taicca.tw': ['taicca', '文策院招標公告今日案件'],
  'kjswf.org.tw': ['kuangjen', '光仁社福招標公告今日案件'],
  'tamco.com.tw': ['tamco', '台灣金聯招標公告今日案件'],
  'firstbank.com.tw': ['firstbank', '第一銀行招標公告今日案件'],
  'yuantabank.com.tw': ['yuantabank', '元大銀行公告資訊今日案件'],
  'yuanta.com': ['yuantafhc', '元大金控重大訊息今日案件'],
  'yuantalife.com.tw': ['yuantalife', '元大人壽公告資訊今日案件'],
};

export function isoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) throw new Error(`Invalid date: ${value}`);
  const date = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(+date) || date.toISOString().slice(0, 10) !== value) throw new Error(`Invalid date: ${value}`);
  return value;
}
export const shiftDate = (value, days) => new Date(Date.parse(`${isoDate(value)}T00:00:00Z`) + days * DAY).toISOString().slice(0, 10);
export function taipeiDate(value = new Date().toISOString()) {
  const date = new Date(value);
  if (!Number.isFinite(+date)) throw new Error('Invalid timestamp');
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date).map(p => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
export function expandWeekend(start, end) {
  isoDate(start); isoDate(end);
  if (start > end) throw new Error('Range start is after end');
  // Only a weekend at the leading boundary can extend an inclusive range.
  const day = new Date(`${start}T00:00:00Z`).getUTCDay();
  return { start: day === 6 ? shiftDate(start, -1) : day === 0 ? shiftDate(start, -2) : start, end };
}
export function readSources(rules) {
  const block = rules.split('Primary daily goal:')[1]?.split('- Report cases')[0];
  if (!block) throw new Error('Canonical source list missing in AGENTS');
  const sources = [...block.matchAll(/^  - (.+?): `([^`]+)`/gm)].map(([, name, url]) => {
    const meta = SOURCE_META[new URL(url).hostname.replace(/^www\./, '')];
    if (!meta) throw new Error(`Unmapped source ${name}; update labels explicitly`);
    return { id: meta[0], heading: meta[1], name, url };
  });
  if (sources.length !== 14 || new Set(sources.map(s => s.id)).size !== 14) throw new Error('Expected 14 distinct sources from AGENTS');
  return sources;
}
export const emptyState = () => ({ version: 1, revision: 0, sources: {}, cases: {}, pending: {}, delivered: {} });

export function makePlan(sources, state, { asOf = new Date().toISOString(), start, end } = {}) {
  const today = taipeiDate(asOf);
  if ((start && !end) || (!start && end)) throw new Error('Provide both --start and --end');
  const requested = expandWeekend(start ?? shiftDate(today, -1), end ?? today);
  if (requested.end > today) throw new Error('Cannot check future publication dates');
  const plans = sources.map(source => {
    const previous = state.sources[source.id];
    let first = requested.start;
    let last = requested.end;
    if (!start) {
      const catchUp = previous?.reportedThrough ? shiftDate(previous.reportedThrough, 1) : shiftDate(today, -4);
      first = first < catchUp ? first : catchUp;
    }
    for (const pending of Object.values(state.pending)) {
      const check = pending.sources.find(s => s.id === source.id);
      if (!check) continue;
      const superseded = previous && previous.checkedAt >= check.checkedAt &&
        previous.range.start <= check.range.start && previous.range.end >= check.range.end;
      if (!superseded && check.range.start < first) first = check.range.start;
      if (!superseded && check.range.end > last) last = check.range.end;
    }
    if (previous?.pendingFrom && previous.pendingFrom < first) first = previous.pendingFrom;
    if (previous?.pendingThrough && previous.pendingThrough > last) last = previous.pendingThrough;
    const range = expandWeekend(first, last);
    const url = new URL(source.url);
    if (source.id === 'taicca') url.searchParams.set('year', range.end.slice(0, 4));
    const years = Array.from({ length: Number(range.end.slice(0, 4)) - Number(range.start.slice(0, 4)) + 1 }, (_, i) => Number(range.start.slice(0, 4)) + i);
    return { ...source, url: url.href, range, years, catchUp: range.start < requested.start };
  });
  return { runId: randomUUID(), asOf: new Date(asOf).toISOString(), today, timezone: TZ,
    mode: new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hourCycle: 'h23' }).format(new Date(asOf)) >= '12' ? 'afternoon' : 'morning',
    baseRevision: state.revision, requested, sources: plans };
}

function webUrl(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only public HTTP(S) links are permitted');
  if (url.username || url.password) throw new Error('Do not store credentials in case links');
  url.hash = '';
  url.searchParams.sort();
  return url.href;
}
const CASE_FIELDS = ['title', 'number', 'url', 'publishedDate', 'round', 'noticeType', 'region', 'unit', 'projectType', 'attribute', 'budget', 'deadline', 'openingTime', 'performanceLocation', 'bidLocation', 'lifecycle', 'detailVerified'];
export function normalizeCase(raw, sourceId) {
  if (typeof raw.title !== 'string' || !raw.title.trim() || !raw.url) throw new Error('Case requires a title and link');
  if (raw.publishedDate) isoDate(raw.publishedDate);
  if (!raw.publishedDate && !['hncb', 'kuangjen'].includes(sourceId)) throw new Error('Undated case is not authorized for this source');
  const entry = Object.fromEntries(CASE_FIELDS.map(key => [key, raw[key] ?? null]));
  if (!['procurement', 'decision', 'intelligence', 'unknown'].includes(entry.lifecycle)) entry.lifecycle = 'unknown';
  entry.detailVerified = raw.detailVerified === true;
  entry.sourceId = sourceId;
  entry.title = entry.title.trim();
  entry.url = webUrl(entry.url);
  entry.key = JSON.stringify([sourceId, String(entry.number || entry.url), String(entry.round ?? ''), entry.noticeType || 'unknown']);
  entry.fingerprint = createHash('sha256').update(JSON.stringify(CASE_FIELDS.map(key => entry[key]))).digest('hex');
  return entry;
}
export function deadlineInfo(entry, asOf) {
  if (entry.lifecycle === 'decision') return { expired: '已決標/不適用', opportunity: '已決標', days: null, urgent: false };
  if (entry.lifecycle === 'intelligence') return { expired: '重大訊息/不適用', opportunity: '採購情報', days: null, urgent: false };
  const unknown = { expired: '未標示', opportunity: '待確認', days: null, urgent: false };
  if (!entry.deadline) return unknown;
  let days, expired, urgent;
  if (/^\d{4}-\d{2}-\d{2}$/.test(entry.deadline)) {
    isoDate(entry.deadline);
    days = Math.round((Date.parse(entry.deadline) - Date.parse(taipeiDate(asOf))) / DAY);
    expired = days < 0 ? '已過期' : days === 0 ? '今日截止，時間未列示' : '未過期';
    urgent = days >= 0 && days <= 3;
  } else {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})?$/.test(entry.deadline)) throw new Error('Deadline must be an ISO date or timestamp');
    isoDate(entry.deadline.slice(0, 10));
    const withZone = /(?:Z|[+-]\d{2}:\d{2})$/.test(entry.deadline) ? entry.deadline : `${entry.deadline}+08:00`;
    const time = Date.parse(withZone);
    if (!Number.isFinite(time)) throw new Error('Invalid deadline time');
    const delta = time - Date.parse(asOf);
    days = Math.ceil(delta / DAY);
    expired = delta <= 0 ? '已過期' : '未過期';
    urgent = delta > 0 && delta <= 3 * DAY;
  }
  return { expired, days, urgent,
    opportunity: expired === '已過期' ? '已截止' : entry.detailVerified && entry.lifecycle === 'procurement' && expired === '未過期' ? '可投標' : '待確認' };
}

export function validateSource(planSource, result, asOf) {
  const problems = [];
  const v = result?.verification ?? {};
  const list = result?.cases ?? [];
  const status = result?.status ?? 'failed';
  if (!['complete', 'partial', 'failed'].includes(status)) throw new Error('Invalid source status');
  if (!Array.isArray(list)) throw new Error('Cases must be an array');
  if (!result) problems.push('未提供查核結果');
  if (result?.range?.start !== planSource.range.start || result?.range?.end !== planSource.range.end) problems.push('查核日期範圍未完整覆蓋');
  const checked = Date.parse(result?.checkedAt ?? '');
  if (!Number.isFinite(checked) || checked < Date.parse(asOf)) problems.push('缺少本次有效查核時間');
  if (status === 'complete') {
    for (const flag of ['officialListRead', 'structureValid', 'paginationComplete', 'dateCoverageComplete']) {
      if (v[flag] !== true) problems.push(`未驗證 ${flag}`);
    }
    if (!(Number.isInteger(v.parsedCount) && v.parsedCount > 0) && v.explicitEmpty !== true) problems.push('空清單缺乏官方證據');
    const officialHost = new URL(planSource.url).hostname.replace(/^www\./, '');
    if (!Array.isArray(v.evidenceUrls) || !v.evidenceUrls.some(url => {
      try { return new URL(webUrl(url)).hostname.replace(/^www\./, '') === officialHost; } catch { return false; }
    })) problems.push('缺少官方清單證據網址');
  }
  const entries = [];
  const byKey = new Map();
  for (const raw of list) {
    try {
      const entry = normalizeCase(raw, planSource.id);
      if (entry.publishedDate && (entry.publishedDate < planSource.range.start || entry.publishedDate > planSource.range.end)) throw new Error('Case is outside the requested publication range');
      deadlineInfo(entry, asOf);
      const duplicate = byKey.get(entry.key);
      if (duplicate && duplicate.fingerprint !== entry.fingerprint) throw new Error('Conflicting duplicate; preserve the correction/round/type identity');
      if (!duplicate) { byKey.set(entry.key, entry); entries.push(entry); }
    } catch (error) { problems.push(`${raw.title ?? '案件'}: ${error.message}`); }
  }
  if (entries.length < list.length && problems.length) problems.push('有未能列入報表的案件，保留補查');
  return { ...planSource, checkedAt: Number.isFinite(checked) ? new Date(checked).toISOString() : asOf,
    status: status === 'complete' && problems.length ? 'partial' : status,
    reason: [result?.reason, ...problems].filter(Boolean).join('；'), verification: v, cases: entries };
}

export function buildReport(plan, input, state) {
  if (input.runId !== plan.runId) throw new Error('Input and plan run ids differ');
  if (state.revision !== plan.baseRevision) throw new Error('State changed after planning; create a fresh plan');
  const inputIds = (input.sources ?? []).map(s => s.id);
  if (new Set(inputIds).size !== inputIds.length || inputIds.some(id => !plan.sources.some(s => s.id === id))) throw new Error('Duplicate or unknown source id');
  const checkedSources = plan.sources.map(source => validateSource(source, input.sources?.find(s => s.id === source.id), plan.asOf));
  const reportTime = checkedSources.map(s => s.checkedAt).concat(plan.asOf).sort().at(-1);
  const results = checkedSources.map(checked => {
    checked.cases = checked.cases.map(entry => {
      const previous = state.cases[entry.key];
      return { ...entry, change: !previous ? '新增' : previous.fingerprint === entry.fingerprint ? '已匯報' : '內容更新',
        firstSeen: previous?.firstSeen ?? plan.asOf, observedAt: checked.checkedAt, ...deadlineInfo(entry, reportTime) };
    });
    return checked;
  });
  const cases = results.flatMap(s => s.cases);
  return { runId: plan.runId, asOf: reportTime, mode: plan.mode, sources: results,
    range: { start: results.map(s => s.range.start).sort()[0], end: results.map(s => s.range.end).sort().at(-1) },
    counts: { complete: results.filter(s => s.status === 'complete').length, partial: results.filter(s => s.status === 'partial').length,
      failed: results.filter(s => s.status === 'failed').length, new: cases.filter(c => c.change === '新增').length,
      updated: cases.filter(c => c.change === '內容更新').length, repeated: cases.filter(c => c.change === '已匯報').length } };
}

export function summarizeReport(report) {
  const cases = report.sources.flatMap(source => source.cases);
  return {
    runId: report.runId, asOf: report.asOf, range: report.range,
    counts: report.counts, total: cases.length,
    sources: report.sources.map(source => ({ id: source.id, range: source.range,
      status: source.status, count: source.cases.length,
      reason: source.status === 'complete' ? undefined : source.reason })),
    urgent: cases.filter(entry => entry.urgent).sort((a, b) => a.deadline.localeCompare(b.deadline))
      .map(entry => ({ sourceId: entry.sourceId, title: entry.title, url: entry.url,
        deadline: entry.deadline, days: entry.days, opportunity: entry.opportunity })),
  };
}

const cell = value => String(value ?? MISSING).replaceAll('|', '\\|').replace(/[\r\n]+/g, ' ').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const label = value => cell(value).replace(/[\[\]]/g, '\\$&');
const link = entry => `[${label(entry.title)}](<${entry.url}>)`;
export function renderReport(report) {
  const c = report.counts;
  const time = new Intl.DateTimeFormat('zh-TW', { timeZone: TZ, dateStyle: 'short', timeStyle: 'medium', hour12: false }).format(new Date(report.asOf));
  const lines = ['# 今日標案總覽', `查詢範圍：${report.range.start} 至 ${report.range.end}（各來源補查範圍見下表）。`,
    `截至查詢時間：${time}（台北）；${report.mode === 'afternoon' ? '下午加查' : '早間查核'}。`,
    `完整 ${c.complete}/${report.sources.length}；部分 ${c.partial}；失敗 ${c.failed}。新增 ${c.new}、內容更新 ${c.updated}、已匯報 ${c.repeated}。`,
    `報告編號：${report.runId}`, '', '|來源|查詢範圍|查核狀態|待處理原因|', '|---|---|---|---|'];
  for (const source of report.sources) lines.push(`|${cell(source.heading.replace('今日案件', ''))}|${source.range.start} ~ ${source.range.end}|${{ complete: '完整', partial: '部分/待補查', failed: '失敗/待補查' }[source.status]}|${cell(source.reason || '無')}|`);
  const urgent = report.sources.flatMap(s => s.cases).filter(entry => entry.urgent);
  lines.push('', '## 即將截標', urgent.length ? urgent.map(entry => `- ${link(entry)}：${cell(entry.deadline)}；剩餘 ${entry.days} 天；${entry.opportunity}。`).join('\n') : '本次已取得資料中，未確認有 3 天內截止的案件。');
  for (const source of report.sources) {
    lines.push('', `## ${source.heading}`);
    if (!source.cases.length) {
      lines.push(source.status === 'complete' ? '截至查詢時間，查詢區間內無案件。' : `尚無可確認案件；${source.reason || '查核未完成，保留補查'}。`);
      continue;
    }
    const sorted = [...source.cases].sort((a, b) => Number(b.urgent) - Number(a.urgent) || ({ 新增: 0, 內容更新: 1, 已匯報: 2 }[a.change] - { 新增: 0, 內容更新: 1, 已匯報: 2 }[b.change]));
    lines.push('|案件名稱|編號/次數|發布時間|地區|單位屬性|項目類型|案件屬性|預算範圍|是否過期|截標時間/剩餘天數|開標時間|履約地點|投標/開標地點|匯報/機會狀態|案件連結|', '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
    for (const entry of sorted) lines.push(`|${link(entry)}|${cell(entry.number)}${entry.round ? ` / 第${cell(entry.round)}次` : ''}|${cell(entry.publishedDate || '日期未列示，請人工確認')}|${cell(entry.region)}|${cell(entry.unit)}|${cell(entry.projectType)}|${cell(entry.attribute ?? entry.noticeType)}|${cell(entry.budget)}|${entry.expired}|${cell(entry.deadline)} / ${entry.days === null ? MISSING : `${entry.days}天`}${entry.urgent ? ' 即將截標' : ''}|${cell(entry.openingTime)}|${cell(entry.performanceLocation)}|${cell(entry.bidLocation)}|${entry.change} / ${entry.opportunity}|[${cell(entry.url)}](<${entry.url}>)|`);
  }
  lines.push('', '## 今日需要你處理', report.sources.some(s => s.status !== 'complete') ? '部分來源待補查；請勿把未讀取到資料視為沒有案件。' : '請依截標時間安排評估；全部來源已完成本次區間查核。',
    '', '## AGENTS.MD / GitHub 同步狀態', '本報告與執行狀態僅儲存在本機，不納入 GitHub。規則是否同步請另依實際操作回報。',
    '', '## 流程優化建議', '本次不自動新增未確認規則；失敗來源保留補查。');
  return lines.join('\n') + '\n';
}

export function acknowledge(state, runId, evidence) {
  if (!evidence?.trim()) throw new Error('Verified final-message delivery reference is required');
  if (state.delivered[runId]) return state;
  const report = state.pending[runId];
  if (!report) throw new Error('Pending report not found');
  const next = structuredClone(state);
  for (const source of report.sources) {
    const previous = next.sources[source.id];
    if (source.status === 'complete') {
      if (!previous?.checkedAt || source.checkedAt >= previous.checkedAt) {
        const through = previous?.reportedThrough > source.range.end ? previous.reportedThrough : source.range.end;
        const coverage = previous?.range?.end > source.range.end ? previous.range : source.range;
        let pendingFrom = previous?.pendingFrom ?? null;
        let pendingThrough = previous?.pendingThrough ?? pendingFrom;
        if (pendingFrom && source.range.start <= pendingFrom && source.range.end >= pendingFrom) {
          pendingFrom = source.range.end >= pendingThrough ? null : shiftDate(source.range.end, 1);
          if (!pendingFrom) pendingThrough = null;
        }
        next.sources[source.id] = { reportedThrough: through, range: coverage, checkedAt: source.checkedAt, pendingFrom, pendingThrough };
      }
    } else if (!previous?.checkedAt || previous.checkedAt < source.checkedAt || previous.range.start > source.range.start || previous.range.end < source.range.end) {
      next.sources[source.id] = { ...previous, pendingFrom: [previous?.pendingFrom, source.range.start].filter(Boolean).sort()[0], pendingThrough: [previous?.pendingThrough, source.range.end].filter(Boolean).sort().at(-1) };
    }
    for (const entry of source.cases) {
      const old = next.cases[entry.key];
      if (!old || entry.observedAt >= old.observedAt) next.cases[entry.key] = entry;
    }
  }
  next.delivered[runId] = { evidence, asOf: report.asOf };
  delete next.pending[runId];
  next.revision++;
  return next;
}

async function loadState(file) {
  try {
    const data = JSON.parse(await fs.readFile(file, 'utf8'));
    if (data.version !== 1 || !Number.isInteger(data.revision) || !data.sources || !data.cases || !data.pending || !data.delivered) throw new Error('Invalid state schema');
    return data;
  } catch (error) { if (error.code === 'ENOENT') return emptyState(); throw error; }
}
async function atomicJson(file, data) {
  const temp = `${file}.${randomUUID()}.tmp`;
  await fs.writeFile(temp, JSON.stringify(data, null, 2) + '\n', 'utf8');
  await fs.rename(temp, file);
}
async function withLock(local, action) {
  await fs.mkdir(local, { recursive: true });
  const lockPath = path.join(local, 'workflow.lock');
  const lock = await fs.open(lockPath, 'wx').catch(error => { throw new Error(`Workflow is locked or unavailable (${error.code}); do not run overlapping writers`); });
  try { return await action(); } finally { await lock.close(); await fs.unlink(lockPath); }
}
async function main() {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: {
    ...Object.fromEntries(['root', 'as-of', 'start', 'end', 'input', 'run-id', 'evidence'].map(key => [key, { type: 'string' }])),
    compact: { type: 'boolean', default: false },
  } });
  const root = path.resolve(values.root ?? '.');
  const local = path.join(root, '.tender-local');
  const statePath = path.join(local, 'state.json');
  await withLock(local, async () => {
    const state = await loadState(statePath);
    const command = positionals[0];
    if (command === 'plan') {
      const rules = await fs.readFile(path.join(root, 'AGENTS.MD'), 'utf8');
      const plan = makePlan(readSources(rules), state, { asOf: values['as-of'], start: values.start, end: values.end });
      const dir = path.join(local, 'runs', plan.runId);
      await fs.mkdir(dir, { recursive: true });
      await atomicJson(path.join(dir, 'plan.json'), plan);
      const input = { runId: plan.runId, sources: plan.sources.map(source => ({ id: source.id, range: source.range, status: 'failed', checkedAt: null, reason: '尚未查核', verification: { officialListRead: false, structureValid: false, paginationComplete: false, dateCoverageComplete: false, parsedCount: 0, explicitEmpty: false, evidenceUrls: [] }, cases: [] })) };
      await atomicJson(path.join(dir, 'input.json'), input);
      const output = values.compact ? { runId: plan.runId, asOf: plan.asOf, requested: plan.requested,
        sources: plan.sources.map(({ id, range, catchUp }) => ({ id, range, catchUp })) } : plan;
      console.log(JSON.stringify({ ...output, inputFile: path.join(dir, 'input.json'), pendingDelivery: Object.keys(state.pending) }, null, values.compact ? 0 : 2));
    } else if (command === 'prepare') {
      if (!values.input) throw new Error('--input is required');
      const inputPath = path.resolve(values.input);
      const relative = path.relative(local, inputPath);
      if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Input must remain inside .tender-local');
      const input = JSON.parse(await fs.readFile(inputPath, 'utf8'));
      const plan = JSON.parse(await fs.readFile(path.join(path.dirname(inputPath), 'plan.json'), 'utf8'));
      const report = buildReport(plan, input, state);
      const reportFile = path.join(path.dirname(inputPath), 'report.md');
      await fs.writeFile(reportFile, renderReport(report), 'utf8');
      await atomicJson(path.join(path.dirname(inputPath), 'report.json'), report);
      state.pending[report.runId] = report;
      state.revision++;
      await atomicJson(statePath, state);
      console.log(JSON.stringify({ runId: report.runId, reportFile, counts: report.counts, delivered: false }, null, 2));
    } else if (command === 'summary') {
      const id = values['run-id'];
      if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id ?? '')) throw new Error('Valid --run-id is required');
      const reportFile = path.join(local, 'runs', id, 'report.md');
      const report = state.pending[id] ?? JSON.parse(await fs.readFile(path.join(path.dirname(reportFile), 'report.json'), 'utf8'));
      console.log(JSON.stringify({ ...summarizeReport(report), reportFile, delivered: Boolean(state.delivered[id]) }));
    } else if (command === 'ack') {
      await atomicJson(statePath, acknowledge(state, values['run-id'], values.evidence));
      console.log('Acknowledged verified delivery; only complete sources advance coverage.');
    } else throw new Error('Use plan, prepare, summary, or ack');
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
