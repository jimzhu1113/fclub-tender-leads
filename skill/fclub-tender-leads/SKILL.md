---
name: fclub-tender-leads
description: Manage Jim's 發包標案每日搜尋 workflow for FABAO CLUB, Taiwan Cooperative Bank, and Hua Nan Bank tender cases. Use when Codex needs to check confirmed tender sources for same-day outsourced engineering/bid cases, prepare daily tender case reports, update AGENTS.MD by asking Jim for missing rules, create or maintain the public GitHub repo jimzhu1113/fclub-tender-leads, or sync confirmed tender整理技巧 and workflow rules.
---

# 發包標案每日搜尋

## Overview

Use this skill for Jim's 發包標案每日搜尋 workflow around confirmed tender source discovery, `AGENTS.MD` maintenance, and GitHub sync.

## Daily Case Workflow

1. Determine the current date in Asia/Taipei.
2. Check confirmed tender sources:
   - FABAO CLUB latest cases: `https://www.fclub.tw/case_new.php`
   - Taiwan Cooperative Bank procurement bulletin: `https://ebulletin.tcb-bank.com.tw/bulletin-web/`
   - Hua Nan Bank procurement information: `https://www.hncb.com.tw/wps/portal/HNCB/per_finance/service/public_item/latest_news`
3. Scheduled reporting runs Monday to Friday at 08:00 Asia/Taipei.
4. Include cases published on the current Asia/Taipei date by default.
5. If the previous scheduled report did not complete successfully, catch up every unreported date from the day after the last successful report through the current run date.
6. If the last successful report date cannot be confirmed, catch up at least the most recent 5 calendar days through the current run date.
7. List every current-day and catch-up case. Do not filter or rank opportunities unless Jim later defines screening rules.
8. If no cases exist for a date or catch-up range, report that clearly.
9. If the site cannot be read, report the failure reason, do not invent case data, and keep the failed date in the next catch-up range.

Source-specific rules:

- FABAO CLUB: parse case cards from `case_new.php`; use the case detail URL under `case_page.php?uuid=...`.
- Taiwan Cooperative Bank: parse `caseInfo` items from `https://ebulletin.tcb-bank.com.tw/bulletin-web/result.json`; include items whose `publicDate` is inside the report date range. Use `TCB_WEBQ011.html?PROJECT_ID=<caseNo>` for `PROCURE` items and `TCB_WEBQ012.html?PROJECT_ID=<caseNo>` for `DECIDE` items. Label `PROCURE` as 採購公告 and `DECIDE` as 決標公告.
- Do not exclude Taiwan Cooperative Bank `DECIDE` records unless Jim later confirms that daily reports should only include procurement opportunities.
- Hua Nan Bank: parse latest-news cards whose tag is `採購情報` or whose link path contains `/pb-latest-news/c4/`. Use each card detail URL as the case link. If the card has a visible `page-link-date`, include it when the date is inside the report range. If the procurement card date is blank, mark 發布時間 as `未列示` and include it under the Hua Nan Bank section as `日期未列示，請人工確認`; do not invent a date.

For each case, report:

- 案件名稱
- 編號
- 發布時間
- 地區
- 單位屬性
- 項目類型
- 案件屬性
- 預算範圍
- 是否過期
- 案件連結: provide the full clickable URL; when Markdown is supported, make 案件名稱 a `[案件名稱](案件連結)` link.

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

Hua Nan Bank field mapping:

- 案件名稱: visible `page-link-title`; if the title contains a case number such as `HNB-115196`, preserve it
- 編號: parse an `HNB-...` case number from the title or URL when available; otherwise mark `未列示`
- 發布時間: visible `page-link-date`; if blank, mark `未列示`
- 地區: parse from the detail page when an address is visible; otherwise mark `未列示`
- 單位屬性: `華南銀行 / 採購情報`
- 項目類型: infer from detail text when clear, otherwise mark `未列示`
- 案件屬性: `採購情報`
- 預算範圍: mark `未列示` unless the detail page clearly states a budget
- 是否過期: infer from bidding, document pickup, or deadline text when clear; otherwise mark `未標示`

Do not commit or push search results, daily case整理結果, or historical case records to GitHub unless Jim explicitly asks.

## AGENTS.MD Workflow

Read `AGENTS.MD` before acting when it exists. If it does not exist or lacks important rules, ask Jim in question mode instead of guessing.

Ask for missing details such as:

- 專案用途
- 每日固定工作
- 案件篩選條件
- 回報欄位
- GitHub repository and branch
- Whether automatic commit/push is allowed
- Forbidden actions

Update `AGENTS.MD` only when Jim confirms a new rule, workflow, output format, or tender整理技巧. Keep updates concise and operational.

## GitHub Sync Workflow

Confirmed GitHub settings:

- Owner: `jimzhu1113`
- Repository: `fclub-tender-leads`
- URL: `https://github.com/jimzhu1113/fclub-tender-leads`
- Branch: `main`
- Visibility: public
- Automatic commit/push: allowed only for `AGENTS.MD`, skill configuration files under `skill/`, workflow rules, and confirmed tender整理技巧

Before syncing:

- Confirm `git` is available.
- Confirm GitHub tooling or credentials are available.
- Create the repo as public if it does not exist and authenticated tooling is available.
- Push only meaningful workflow changes.
- Do not bypass missing authentication, missing remote, or missing permissions.

Never sync by default:

- Search results
- Daily case整理結果
- Historical case records
- Raw scrape/cache data
- Gmail or private message contents
- Temporary files

## Report Format

Use these sections for daily reports:

- `今日標案總覽`
- `FABAO CLUB 今日案件`
- `合作金庫採購公告今日案件`
- `華南銀行採購情報今日案件`
- `今日需要你處理`
- `AGENTS.MD / GitHub 同步狀態`
- `流程優化建議`

Include Gmail-related sections only when Jim explicitly combines this workflow with mailbox work.

If a report includes catch-up dates, state the catch-up range at the start of `今日標案總覽`.

When reporting cases in a table, make each case name clickable and keep a separate `案件連結` column when space allows.

## Forbidden Actions

- Do not upload daily case整理結果 to GitHub by default.
- Do not upload search results or historical case records to GitHub by default.
- Do not guess tender screening rules before Jim defines them.
- Do not send emails automatically.
- Do not permanently delete emails.
- Do not enter personal information into external sites unless Jim explicitly asks.
- Do not create unrelated GitHub repositories.
