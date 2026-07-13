---
name: fclub-tender-leads
description: Manage Jim's FABAO CLUB tender lead development workflow. Use when Codex needs to check https://www.fclub.tw/case_new.php for same-day outsourced engineering/bid cases, prepare daily tender case reports, update AGENTS.MD by asking Jim for missing rules, create or maintain the public GitHub repo jimzhu1113/fclub-tender-leads, or sync confirmed tender整理技巧 and workflow rules.
---

# FABAO CLUB Tender Leads

## Overview

Use this skill for Jim's 發包工程 / 標案開發 workflow around FABAO CLUB case discovery, `AGENTS.MD` maintenance, and GitHub sync.

## Daily Case Workflow

1. Determine the current date in Asia/Taipei.
2. Open `https://www.fclub.tw/case_new.php`.
3. Include only cases published on the current Asia/Taipei date.
4. List every same-day case. Do not filter or rank opportunities unless Jim later defines screening rules.
5. If no same-day cases exist, report that clearly.
6. If the site cannot be read, report the failure reason and do not invent case data.

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

- `FABAO CLUB 今日案件`
- `AGENTS.MD / GitHub 同步狀態`
- `流程優化建議`

Include Gmail-related sections only when Jim explicitly combines this workflow with mailbox work.

When reporting cases in a table, make each case name clickable and keep a separate `案件連結` column when space allows.

## Forbidden Actions

- Do not upload daily case整理結果 to GitHub by default.
- Do not upload search results or historical case records to GitHub by default.
- Do not guess tender screening rules before Jim defines them.
- Do not send emails automatically.
- Do not permanently delete emails.
- Do not enter personal information into external sites unless Jim explicitly asks.
- Do not create unrelated GitHub repositories.
