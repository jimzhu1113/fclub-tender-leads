---
name: fclub-tender-leads
description: Run Jim's Taiwan tender monitoring, morning and afternoon reports, source-specific catch-up, and approved workflow-only GitHub sync. Use for tender searches or maintaining this workflow, not unrelated procurement or mailbox work.
---

# 發包標案每日搜尋

## Canonical Rules

Read workspace `AGENTS.MD` (or `AGENTS.md`) first. It owns the source list,
field mappings, date rules, schedule, reporting format and sync permissions.
Do not duplicate those rules in an installed Skill or automation prompt.
If missing, ask Jim before establishing new rules.

The saved workspace is
`C:/Users/jim/Documents/Codex/2026-07-08/https-www-fclub-tw-case-new`.
When invoked from an installed copy, open that workspace's AGENTS and Skill,
and execute its scripts from that workspace. Do not create local state under
the global Skill installation. Do not run historical `tmp_*.mjs` scripts.

## Run the Workflow

1. Read `.tender-local/state.json` if present. For pending reports, read this
   task's previous final messages and match the report run id. Only after
   verifying actual delivery, acknowledge with:
   `node skill/fclub-tender-leads/scripts/tender-workflow.mjs ack --root . --run-id <id> --evidence <thread-and-final-message-reference>`.
   Never acknowledge the current report before it has appeared in a final
   message. File creation or a successful fetch is not delivery evidence.
2. Run `node skill/fclub-tender-leads/scripts/tender-workflow.mjs plan --root .`.
   The printed plan gives each source's inclusive date range and creates a
   local input template. Optional `--start YYYY-MM-DD --end YYYY-MM-DD` supports
   user requests; `--as-of <ISO timestamp with offset>` is for reproducible tests.
3. Visit every source using its AGENTS parsing instructions and a permitted
   official HTTP/API or normal browser tool. Follow pagination until the
   range is covered, check details for required fields and tender relevance,
   and populate the printed local input file. Use a JSON parser/serializer or
   apply_patch; never substitute an empty list for an error.
4. For each source supply `status`, `reason`, `checkedAt`, `range`,
   `verification`, and `cases`. The template defaults to failed. Set complete
   only after observing an official list, recognizable structure, all required
   pages, and full date coverage. Set `explicitEmpty` only for a visible empty
   list; otherwise give `parsedCount` for all parsed list rows, including
   out-of-range rows. Record actual official evidence URLs. A single readable
   detail or search snippet does not prove a source has no other cases.
5. Cases use `title`, `number`, `url`, `publishedDate` (ISO date or null),
   `round`, `noticeType`, `region`, `unit`, `projectType`, `attribute`, `budget`,
   `deadline`, `openingTime`, `performanceLocation`, `bidLocation`,
   `lifecycle` (`procurement`, `decision`, `intelligence`, `unknown`) and
   `detailVerified`. Missing facts stay null/未列示. Deadline accepts a date
   or an ISO timestamp; a time without offset is interpreted as Taipei.
   Never fill deadline from openingTime. For undated cases record no date;
   firstSeen is stored separately. Preserve rounds and announcement types.
6. Run `node skill/fclub-tender-leads/scripts/tender-workflow.mjs prepare --root . --input <local-input-path>`.
   This validates coverage, labels cases against delivered history, calculates
   deadlines and creates `report.md` and a pending record locally. Inspect the
   report; if corrections are needed after preparing, create a fresh plan and
   corrected input (old undelivered coverage remains pending). It does not fetch
   websites itself: source collection still uses the agent's available tools.
7. Return the full report in this task, or a concise overview with a clickable
   link to the complete local report when long. Include the exact run id in
   the final message. Do not claim all 14 sources succeeded unless validated.
   Leave acknowledgment to the next run after checking actual delivery.

Both daily runs retain every in-range case. Afternoon highlights new/updated
cases and <=3-day cutoffs; previously reported cases remain in the complete
report. Always show partial/failed sources and their pending ranges. A repeat
case can still become urgent. Old out-of-range cases require a separately
labelled, freshly verified reminder before inclusion; do not silently expand
the report with stale cached opportunities.

## Maintenance and Verification

- Run `node --test skill/fclub-tender-leads/scripts/tender-workflow.test.mjs`.
- Review synthetic tests for month/year transitions, weekends, per-source
  failures, missing/invalid list structure, undelivered reports, changed
  deadlines, repeated rounds, and date-only cutoff handling.
- Keep all reports, downloaded data and state in `.tender-local/`.
- Stage only exact approved files. Run `node skill/fclub-tender-leads/scripts/check-sync.mjs --staged` before commit and `--outgoing` before push.
- Sync only approved rules, Skill helpers and synthetic tests. Never publish
  actual cases, state, cache, credentials or historical scrape output.
- Preserve GitHub main/public and existing credentials; report auth failures
  without circumventing them. Install the entrypoint from the workspace copy
  after approved changes so the installed Skill cannot drift.
