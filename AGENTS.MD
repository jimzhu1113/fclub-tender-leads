# 發包標案每日搜尋

## Project Purpose

Project display name: 發包標案每日搜尋.

This workspace supports daily tender search for outsourced engineering and bid opportunities.

Primary daily goal:

- From Monday to Friday at 08:00 Asia/Taipei, check confirmed tender sources:
  - FABAO CLUB latest cases: `https://www.fclub.tw/case_new.php`
  - Taiwan Cooperative Bank procurement bulletin: `https://ebulletin.tcb-bank.com.tw/bulletin-web/`
- Report cases published on the current day, unless catch-up reporting is required.
- If a scheduled report does not complete successfully, carry that date forward and include it in the next successful report.
- List all current-day and catch-up cases without filtering.
- Maintain this `AGENTS.MD` and related workflow/tender整理技巧.
- Sync only workflow rules, skill configuration files, and整理技巧 to GitHub when local GitHub tooling is available.

Planned GitHub repository:

- Owner: `jimzhu1113`
- Repository name: `fclub-tender-leads`
- URL: `https://github.com/jimzhu1113/fclub-tender-leads`
- Branch: `main`
- Push policy: automatic commit/push is allowed only for `AGENTS.MD`, skill configuration files, workflow rules, and tender整理技巧.
- Repository visibility: public.

## Daily Case Report Rules

For daily case checks:

- Source URLs:
  - FABAO CLUB latest cases: `https://www.fclub.tw/case_new.php`
  - Taiwan Cooperative Bank procurement bulletin: `https://ebulletin.tcb-bank.com.tw/bulletin-web/`
- Taiwan Cooperative Bank list data is loaded from `https://ebulletin.tcb-bank.com.tw/bulletin-web/result.json`.
- Scheduled reporting runs Monday to Friday at 08:00 Asia/Taipei.
- Include cases from the current date in Asia/Taipei by default.
- If the previous scheduled report did not complete successfully, include all unreported dates from the day after the last successful report through the current run date.
- If the last successful report date cannot be confirmed, catch up at least the most recent 5 calendar days through the current run date.
- Do not apply opportunity screening yet; list every current-day and catch-up case.
- If no cases exist for a date or catch-up range, report that clearly.
- If the site cannot be read, report the failure reason clearly and keep that date in the catch-up range for the next report.

Source-specific rules:

- FABAO CLUB: parse case cards from `case_new.php`; use the case detail URL under `case_page.php?uuid=...`.
- Taiwan Cooperative Bank: parse `caseInfo` items from `result.json`; include items whose `publicDate` is inside the report date range. Use `TCB_WEBQ011.html?PROJECT_ID=<caseNo>` for `PROCURE` items and `TCB_WEBQ012.html?PROJECT_ID=<caseNo>` for `DECIDE` items. Label `PROCURE` as 採購公告 and `DECIDE` as 決標公告.
- Do not exclude Taiwan Cooperative Bank `DECIDE` records unless Jim later confirms that daily reports should only include procurement opportunities.

Each case report must include:

- 案件名稱
- 編號
- 發布時間
- 地區
- 單位屬性
- 項目類型
- 案件屬性
- 預算範圍
- 是否過期
- 案件連結：提供完整可點擊網址；在支援 Markdown 的回報中，案件名稱也要做成 `[案件名稱](案件連結)`。

Taiwan Cooperative Bank field mapping:

- 案件名稱: `title`
- 編號: `caseNo`
- 發布時間: `publicDate`
- 地區: use the city/address shown in opening, delivery, or bulletin location fields when available; otherwise mark `未列示`
- 單位屬性: `合作金庫商業銀行 / <dept>`
- 項目類型: `caseText5` when available
- 案件屬性: announcement type plus `caseText6` when available
- 預算範圍: mark `未列示` when the bulletin does not provide budget
- 是否過期: for procurement notices, compare bid/opening deadline with the current Asia/Taipei date; for decision notices, mark `已決標/不適用`

Daily search results, case整理結果, and historical case records must not be committed or pushed to GitHub unless Jim explicitly asks.

## AGENTS.MD Update Rules

Update this file only when Jim confirms a new rule, workflow, label, output format, or tender development technique.

If information is missing, ask Jim in question mode instead of inventing rules. Important questions include:

- 專案用途
- 每日固定工作
- 案件篩選條件
- 回報欄位
- GitHub repository and branch
- Whether automatic commit/push is allowed
- Forbidden actions

When updating this file:

- Keep rules concise and operational.
- Preserve confirmed decisions.
- Do not overwrite Jim's preferences with assumptions.
- Commit and push only meaningful changes.

## GitHub Sync Rules

Automatic GitHub sync is allowed for:

- `AGENTS.MD`
- Skill configuration files under `skill/`
- Workflow rules
- Tender lead development整理技巧

Do not sync by default:

- Search results
- Daily case report outputs
- Historical case records
- Temporary files
- Raw scrape/cache data
- Email contents or private data

Before pushing:

- Confirm `git` is available.
- Confirm a GitHub remote exists or create/use `https://github.com/jimzhu1113/fclub-tender-leads`.
- Create the GitHub repository as public if it does not exist and GitHub tooling is available.
- Confirm credentials are available.
- Use branch `main`.
- Do not work around missing authentication.
- Do not create unrelated repositories.

If GitHub sync fails, report:

- Missing tool, remote, repository, branch, or credential.
- The exact next action Jim needs to take.

## Forbidden Actions

- Do not send emails automatically.
- Do not permanently delete emails.
- Do not log in to invoice or external government services unless Jim explicitly asks.
- Do not enter personal information into external sites unless Jim explicitly asks.
- Do not upload daily case整理結果 to GitHub by default.
- Do not guess tender screening rules before Jim defines them.
- Do not bypass missing GitHub authentication or repository permissions.

## Preferred Final Report Format

Use these sections for daily reports:

- `今日標案總覽`
- `FABAO CLUB 今日案件`
- `合作金庫採購公告今日案件`
- `今日需要你處理`
- `AGENTS.MD / GitHub 同步狀態`
- `流程優化建議`

Include Gmail-related sections only when that daily run also performs mailbox work.

If a report includes catch-up dates, state the catch-up range at the start of `FABAO CLUB 今日案件`.

When reporting cases in a table, make the case name clickable and keep a separate `案件連結` column if space allows.
