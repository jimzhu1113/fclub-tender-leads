# FABAO CLUB Tender Lead Development

## Project Purpose

This workspace supports FABAO CLUB tender lead development for outsourced engineering and bid opportunities.

Primary daily goal:

- At 08:00 Asia/Taipei, check `https://www.fclub.tw/case_new.php`.
- Report only cases published on the current day.
- List all same-day cases without filtering.
- Maintain this `AGENTS.MD` and related workflow/tender整理技巧.
- Sync workflow rules and整理技巧 to GitHub when local GitHub tooling is available.

Planned GitHub repository:

- Owner: `jimzhu1113`
- Repository name: `fclub-tender-leads`
- URL: `https://github.com/jimzhu1113/fclub-tender-leads`
- Branch: `main`
- Push policy: automatic commit/push is allowed for `AGENTS.MD` and workflow/tender整理技巧.
- Repository visibility: public.

## Daily Case Report Rules

For FABAO CLUB case checks:

- Source URL: `https://www.fclub.tw/case_new.php`
- Include only cases from the current date in Asia/Taipei.
- Do not apply opportunity screening yet; list every same-day case.
- If no same-day cases exist, report that clearly.
- If the site cannot be read, report the failure reason clearly.

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

Daily case整理結果 should not be committed or pushed to GitHub unless Jim explicitly asks.

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
- Workflow rules
- Tender lead development整理技巧

Do not sync by default:

- Daily case report outputs
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

- `FABAO CLUB 今日案件`
- `今日需要你處理`
- `AGENTS.MD / GitHub 同步狀態`
- `流程優化建議`

Include Gmail-related sections only when that daily run also performs mailbox work.

When reporting cases in a table, make the case name clickable and keep a separate `案件連結` column if space allows.
