# 發包標案每日搜尋

## Project Purpose

Project display name: 發包標案每日搜尋.

This workspace supports daily tender search for outsourced engineering and bid opportunities.

Primary daily goal:

- From Monday to Friday at 08:00 Asia/Taipei, check confirmed tender sources:
  - FABAO CLUB latest cases: `https://www.fclub.tw/case_new.php`
  - Taiwan Cooperative Bank procurement bulletin: `https://ebulletin.tcb-bank.com.tw/bulletin-web/`
  - Hua Nan Bank procurement information: `https://www.hncb.com.tw/wps/portal/HNCB/per_finance/service/public_item/latest_news`
  - Taiwan Business Bank tender announcements: `https://www.tbb.com.tw/zh-tw/about/information/announcement/tender`
  - Chang Hwa Bank announcements: `https://www.bankchb.com/frontend/newsInfo.jsp`
  - Institute for Information Industry procurement announcements: `https://bid.iii.org.tw/bid/`
  - Mega International Commercial Bank business announcements: `https://www.megabank.com.tw/about/announcement/info/public`
  - Taiwan Creative Content Agency tender announcements: `https://taicca.tw/public_information/purchase_placard/list?type_id=1&input_search=&year=2026`
  - Kuang Jen Social Welfare Foundation activity/tender announcements: `https://www.kjswf.org.tw/Download.aspx?tid=123`
  - Taiwan Asset Management Co. tender announcements: `https://www.tamco.com.tw/webtamco/announce/?announce_cate_name=important-announce`
  - First Bank fixed/tender announcements: `https://www.firstbank.com.tw/sites/fcb/FixedAnnouncement#atab1-tab`
  - Yuanta Bank announcement information: `https://www.yuantabank.com.tw/bank/bulletin/bulletin/list.do`
  - Yuanta Financial Holding major announcements: `https://www.yuanta.com/TW/News-and-Media/Announcements`
  - Yuanta Life latest/important news: `https://www.yuantalife.com.tw/about/recent/news/?filterBy=member`
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
  - Hua Nan Bank procurement information: `https://www.hncb.com.tw/wps/portal/HNCB/per_finance/service/public_item/latest_news`
  - Taiwan Business Bank tender announcements: `https://www.tbb.com.tw/zh-tw/about/information/announcement/tender`
  - Chang Hwa Bank announcements: `https://www.bankchb.com/frontend/newsInfo.jsp`
  - Institute for Information Industry procurement announcements: `https://bid.iii.org.tw/bid/`
  - Mega International Commercial Bank business announcements: `https://www.megabank.com.tw/about/announcement/info/public`
  - Taiwan Creative Content Agency tender announcements: `https://taicca.tw/public_information/purchase_placard/list?type_id=1&input_search=&year=2026`
  - Kuang Jen Social Welfare Foundation activity/tender announcements: `https://www.kjswf.org.tw/Download.aspx?tid=123`
  - Taiwan Asset Management Co. tender announcements: `https://www.tamco.com.tw/webtamco/announce/?announce_cate_name=important-announce`
  - First Bank fixed/tender announcements: `https://www.firstbank.com.tw/sites/fcb/FixedAnnouncement#atab1-tab`
  - Yuanta Bank announcement information: `https://www.yuantabank.com.tw/bank/bulletin/bulletin/list.do`
  - Yuanta Financial Holding major announcements: `https://www.yuanta.com/TW/News-and-Media/Announcements`
  - Yuanta Life latest/important news: `https://www.yuantalife.com.tw/about/recent/news/?filterBy=member`
- Taiwan Cooperative Bank list data is loaded from `https://ebulletin.tcb-bank.com.tw/bulletin-web/result.json`.
- Taiwan Business Bank list data is loaded from `https://www.tbb.com.tw/api/client/announcement/getannouncementlist/tbb`.
- Chang Hwa Bank list data is loaded from `https://www.bankchb.com/frontend/jsp/getNewsInfo.jsp`.
- Institute for Information Industry list data is loaded from `https://bid.iii.org.tw/bid/list/bid_new_list.aspx`.
- Mega International Commercial Bank tender-related items are found from `https://www.megabank.com.tw/about/announcement/info/public`; Jim-provided URL `https://www.megabank.com.tw/about/announcement/public/tender` redirects to this business announcement page.
- Taiwan Creative Content Agency tender announcements are loaded from `https://taicca.tw/public_information/purchase_placard/list?type_id=1&input_search=&year=<西元年>`; Jim-provided 2026 URL is `https://taicca.tw/public_information/purchase_placard/list?type_id=1&input_search=&year=2026`.
- Kuang Jen Social Welfare Foundation tender-related items are found from `https://www.kjswf.org.tw/Download.aspx?tid=123` and paginated pages such as `https://www.kjswf.org.tw/Download.aspx?nowPage=<page>&tid=123`.
- Taiwan Asset Management Co. tender announcements are checked from `https://www.tamco.com.tw/webtamco/announce/?announce_cate_name=important-announce`; if that category page is empty, scan `https://www.tamco.com.tw/webtamco/announce/` and paginated pages such as `https://www.tamco.com.tw/webtamco/announce/page/<page>/`, then filter items whose visible category is `招標公告`.
- Scheduled reporting runs Monday to Friday at 08:00 Asia/Taipei.
- First Bank fixed/tender announcements are checked from `https://www.firstbank.com.tw/sites/fcb/FixedAnnouncement#atab1-tab`; the page title is `公告資訊` and it contains announcement sections including `招標公告` and `採購公告`.
- Yuanta Bank announcement information is checked from `https://www.yuantabank.com.tw/bank/bulletin/bulletin/list.do`; include only dated items whose title or detail clearly indicates tender/procurement work.
- Yuanta Financial Holding major announcements are checked from `https://www.yuanta.com/TW/News-and-Media/Announcements`; include only dated items whose title or detail clearly indicates tender/procurement, engineering, renovation, construction, contract amount, or public bidding information. Treat these as tender intelligence unless the notice is clearly an active procurement opportunity.
- Yuanta Life latest/important news is checked from `https://www.yuantalife.com.tw/about/recent/news/?filterBy=member`; no separate official tender page is confirmed, so include only dated news/service items whose title or detail clearly indicates tender/procurement work.
- Yuanta Financial Holding supplier management page `https://www.yuanta.com/TW/ESG/Environmental-Sustainability/Supplier-Management` is reference-only for Yuanta procurement categories such as information technology, renovation/construction, office equipment, and professional services; do not list it as a daily case source.
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
- Hua Nan Bank: parse latest-news cards whose tag is `採購情報` or whose link path contains `/pb-latest-news/c4/`. Engineering tender items are confirmed to appear in this same procurement information source. Use each card detail URL as the case link. If the card has a visible `page-link-date`, include it when the date is inside the report range. If the procurement card date is blank, mark 發布時間 as `未列示` and include it under the Hua Nan Bank section as `日期未列示，請人工確認`; do not invent a date.
- Taiwan Business Bank: parse the `招標/出租` tab on `https://www.tbb.com.tw/zh-tw/about/information/announcement/tender`. Use API `https://www.tbb.com.tw/api/client/announcement/getannouncementlist/tbb` with `dataItemId` `{0EEC155C-013A-44A3-86F0-4F85AE6A5382}` and `subCategoryOption` `All`. Include items whose visible publication date is inside the report range. Use detail links under `/zh-tw/about/information/announcement/news/tender-announcements/`. Engineering tenders are confirmed to appear in this `招標公告 / 招標/出租` source. Do not treat separate real-estate pages such as `公開標售` or `出租房地` as engineering tender sources unless Jim explicitly asks.
- Chang Hwa Bank: parse `https://www.bankchb.com/frontend/newsInfo.jsp` and its JSON endpoint `https://www.bankchb.com/frontend/jsp/getNewsInfo.jsp`. Query the endpoint with `POST` fields `page`, `type`, and `pageSize`; start with blank `type`, and when needed enumerate visible category ids from `newsInfo.jsp` and query them as `type=<id>`. Deduplicate by `id`. Include items whose `date` is inside the report range and whose title indicates tender/procurement opportunity, such as `招標`, `採購`, `購置財物`, `工程招標`, `詢商`, `標售`, or `出租`. Use `https://www.bankchb.com/frontend/newsDetail.jsp?id=<id>` as the case link when the item `url` is blank; if `url` is provided, use that URL. Jim-provided historical example `https://www.bankchb.com/frontend/newsDetail.jsp?id=3941` confirms the detail URL pattern, but the page may later show `此筆資料已下架`; when that happens, mark 是否過期 as `已下架/可能過期` instead of inventing details.
- Institute for Information Industry: `https://bid.iii.org.tw/bid/` is a frame page whose list source is `https://bid.iii.org.tw/bid/list/bid_new_list.aspx`. Parse the `GridView1` table. Include rows whose `領標起始日` is inside the report date range. Detail links use `https://bid.iii.org.tw/bid/list/bid_new_list.aspx?bid_no=<案號>&ord=<次數>`. Dates are in ROC format such as `115/07/31`; convert them to Gregorian dates such as `2026/07/31` for comparison and reporting, while preserving the original text when useful. If catch-up needs older rows beyond the first page, follow the ASP.NET pagination postback links for `GridView1` such as `Page$2`, carrying `__VIEWSTATE`, `__EVENTVALIDATION`, and related hidden fields.
- Mega International Commercial Bank: parse `https://www.megabank.com.tw/about/announcement/info/public`. Include items whose visible publication date is inside the report range and whose title or detail text indicates an engineering tender/procurement opportunity, such as `工程`, `裝修`, `監造`, `招標`, `決標`, `徵求廠商`, or `採購`. Use detail links under `https://www.megabank.com.tw/about/announcement/info/public/public-detail?sno=<sno>`. Do not treat every business announcement as a tender case.
- Taiwan Creative Content Agency: parse the `招標公告` list at `https://taicca.tw/public_information/purchase_placard/list?type_id=1&input_search=&year=<西元年>`. Include list items whose visible announcement date is inside the report range. Detail links use `https://taicca.tw/public_information/purchase_placard/detail/<id>`. Follow pagination when catch-up needs older items. Parse detail fields such as `公告類別`, `標案案號`, `標案名稱`, `公告日期`, `招標區間`, `截標時間`, and `開標時間` when available. Do not include `決標公告` from the same section unless Jim later asks for awarded/decision cases.
- Taiwan Creative Content Agency fallback: this source often returns 403 or times out. When the primary list URL fails, retry once with browser-like request headers, a warm-up request to `https://www.taicca.tw/`, and a 60-90 second timeout. If it still fails, try `https://www.taicca.tw/public_information/purchase_placard/list`, then official detail probing around the newest known numeric detail ids under `https://www.taicca.tw/public_information/purchase_placard/detail/<id>` and `https://taicca.tw/public_information/purchase_placard/detail/<id>?type_id=1`. If the homepage warm-up itself returns 403, skip repeated direct detail probing for that run and move directly to the web-search fallback. Include only official detail pages whose `公告類別` is `招標公告` and whose `公告日期` is inside the report range. If both list and detail probing fail, use web search queries limited to official TAICCA purchase placard URLs, such as `site:taicca.tw/public_information/purchase_placard/detail 文策院 招標公告 <year>` and date-specific queries, then mark the item as `搜尋引擎快照，需人工確認`. Do not mark the TAICCA source as fully successful unless at least one official list or official detail page was read directly.
- Kuang Jen Social Welfare Foundation: parse the `活動訊息` list at `https://www.kjswf.org.tw/Download.aspx?tid=123` and follow pagination with `nowPage=<page>`. Include items whose title contains `公開招標`, `採購公告`, or `決標公告`, and prioritize engineering/procurement terms such as `工程`, `裝修`, `統包`, `設計`, or `採購`. Use `https://www.kjswf.org.tw/OnePage.aspx?tid=123&id=<id>` as the case link. Some tender links redirect to Google Drive folders; when that happens, keep the Kuang Jen page URL as the case link and include the Google Drive folder URL as an attachment/source note when visible. If a detail page contains structured fields such as `[標案案號]`, `[標案名稱]`, `[採購金額]`, `[預算金額]`, `[履約地點]`, or `[決標金額]`, parse them. If the list item redirects directly and no date is visible, mark 發布時間 as `未列示` and include it as `日期未列示，請人工確認`.
- Taiwan Asset Management Co.: parse `https://www.tamco.com.tw/webtamco/announce/?announce_cate_name=important-announce`. If the category page shows `查無相關訊息`, scan `https://www.tamco.com.tw/webtamco/announce/` and pagination under `/announce/page/<page>/`; include items whose visible category is `招標公告` and whose publication date is inside the report range. Detail links use `https://www.tamco.com.tw/webtamco/<post-id>/`. Include engineering/procurement items such as `裝修工程`, `採購案`, `公開標售`, `工程`, or `招標`; do not include ordinary `最新消息` unless the title or detail clearly indicates a tender/procurement opportunity.

- First Bank: parse `https://www.firstbank.com.tw/sites/fcb/FixedAnnouncement#atab1-tab`. Include items from the `招標公告` and `採購公告` sections whose visible publication date is inside the report range. Detail links use `https://www.firstbank.com.tw/sites/fcb/zh_TW/<id>` when the announcement item has a detail page. Include engineering/procurement items such as `工程`, `裝修`, `採購`, `招標`, `決標`, `公開甄選`, `標售`, or `徵求廠商`; do not include ordinary customer notices unless the title or detail clearly indicates a tender/procurement opportunity.
- Yuanta Bank: parse `https://www.yuantabank.com.tw/bank/bulletin/bulletin/list.do`. Include items whose visible publication date is inside the report range and whose title/detail contains tender/procurement keywords such as `招標`, `採購`, `工程`, `裝修`, `營繕`, `修繕`, `委託`, `徵求廠商`, `公開招標`, `比價`, `議價`, `清潔`, `保全`, `機電`, or `設備`. Use the announcement detail URL from the item link. Do not include ordinary rate, service, card, fund, or customer notices unless the text clearly indicates a tender/procurement opportunity.
- Yuanta Financial Holding: parse `https://www.yuanta.com/TW/News-and-Media/Announcements`. Include items whose visible publication date is inside the report range and whose title/detail contains tender/procurement or engineering keywords such as `招標`, `採購`, `工程`, `裝修`, `營繕`, `修繕`, `委託`, `徵求廠商`, `公開招標`, `施工`, `契約總價`, `發包`, or `追加工程款`. Detail links use `https://www.yuanta.com/TW/News-and-Media/Announcements/Detail?id=<id>`. Treat board or material announcements as `重大訊息 / 採購情報`; do not treat every financial disclosure as a tender case.
- Yuanta Life: parse `https://www.yuantalife.com.tw/about/recent/news/?filterBy=member`. Include items whose visible publication date is inside the report range and whose title/detail contains tender/procurement keywords such as `招標`, `採購`, `工程`, `裝修`, `營繕`, `修繕`, `委託`, `徵求廠商`, `公開招標`, `清潔`, `保全`, `機電`, or `設備`. Use the official news/detail URL from the item link. Because no separate official tender page is confirmed, do not include ordinary insurance product, rate, service, or customer notices unless the text clearly indicates a tender/procurement opportunity.

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

Taiwan Business Bank field mapping:

- 案件名稱: visible tender announcement link text
- 編號: parse the `tender-announcements/<slug>` slug from the detail URL when no official case number appears; otherwise preserve the official number from title or detail text
- 發布時間: visible publication date
- 地區: parse from detail text when an address or branch location is visible; otherwise mark `未列示`
- 單位屬性: `臺灣企銀 / 招標公告 / 招標/出租`
- 項目類型: infer from title/detail text such as `工程`, `資訊採購`, `設備採購`, or `出租`; otherwise mark `未列示`
- 案件屬性: `招標/出租`; append `採購`, `招商`, `比價`, or `出租` when clear from the title/detail
- 預算範圍: mark `未列示` unless the detail page clearly states a budget
- 是否過期: infer from bidding, document pickup, opening, or deadline text when clear; otherwise mark `未標示`

Chang Hwa Bank field mapping:

- 案件名稱: `title`
- 編號: `id` from `getNewsInfo.jsp` or the `newsDetail.jsp?id=<id>` detail URL
- 發布時間: `date`
- 地區: parse from title/detail text when an address, branch, building, or city is visible; otherwise mark `未列示`
- 單位屬性: `彰化銀行 / 本行公告`
- 項目類型: infer from title/detail text such as `工程`, `財物採購`, `資訊採購`, `詢商`, `標售`, or `出租`; otherwise mark `未列示`
- 案件屬性: use the tender/procurement keyword found in the title, such as `工程招標公告`, `購置財物招標公告`, `詢商公告`, `標售`, or `出租`
- 預算範圍: mark `未列示` unless the detail page clearly states a budget
- 是否過期: infer from bidding, document pickup, opening, or deadline text when clear; if the detail page says `此筆資料已下架`, mark `已下架/可能過期`

Institute for Information Industry field mapping:

- 案件名稱: `採購標的` link text
- 編號: `案號`; append `第<次數>次` from `招標狀態` when useful
- 發布時間: `領標起始日`; convert ROC date to Gregorian date for daily comparison
- 地區: parse from detail fields such as `招標機關地址`, `收受投標文件地點`, `開標地點`, or `履約地點`; otherwise mark `未列示`
- 單位屬性: `資策會 / 採購公告`
- 項目類型: `採購類別`, such as `勞務`, `財物`, or `工程`
- 案件屬性: `招標狀態`; append `招標方式` from the detail page when clear
- 預算範圍: parse `預算金額` from the detail page when shown; otherwise mark `未列示`
- 是否過期: compare `截標終止日` with the current Asia/Taipei date/time; if past, mark `已過期`, otherwise mark `未過期`

Mega International Commercial Bank field mapping:

- 案件名稱: visible business announcement title
- 編號: parse `sno` from the `public-detail?sno=<sno>` detail URL when no official case number appears
- 發布時間: visible `發布時間`
- 地區: parse from title or detail text, such as branch name, city, or `工程監造地點`; otherwise mark `未列示`
- 單位屬性: `兆豐銀行 / 業務公告`
- 項目類型: infer from title/detail text such as `室內裝修`, `監造`, `工程`, `採購`, or `招標`; otherwise mark `未列示`
- 案件屬性: `業務公告`; append the clearest tender keyword such as `工程招標`, `徵求廠商`, or `監造` when clear
- 預算範圍: mark `未列示` unless the detail page clearly states a budget
- 是否過期: compare stated submission, bidding, opening, or deadline text with the current Asia/Taipei date; otherwise mark `未標示`

Taiwan Creative Content Agency field mapping:

- 案件名稱: visible list title or detail `標案名稱`
- 編號: `標案案號` from the detail page; if unavailable, parse the `<id>` from the detail URL
- 發布時間: visible list date or detail `公告日期`
- 地區: parse from detail text when a venue, address, city, or service location is visible; otherwise mark `未列示`
- 單位屬性: `文策院 / 採購公告 / 招標公告`
- 項目類型: infer from title/detail text such as `勞務採購`, `財物`, `工程`, `租賃`, or `設計裝潢`; otherwise mark `未列示`
- 案件屬性: `招標公告`; append `公開評選`, `公開徵求`, `更正公告`, or other clear tender method/status from the title or detail when available
- 預算範圍: mark `未列示` unless the detail page clearly states a budget or amount
- 是否過期: compare `截標時間` or the end date/time of `招標區間` with the current Asia/Taipei date/time; if past, mark `已過期`, otherwise mark `未過期`; if no deadline is visible, mark `未標示`

Kuang Jen Social Welfare Foundation field mapping:

- 案件名稱: visible list title or detail `[標案名稱]`
- 編號: parse `[標案案號]` from detail text; if unavailable, parse the `id` from `OnePage.aspx?tid=123&id=<id>`
- 發布時間: visible detail/list date when available; if the item redirects to Google Drive and no date is visible, mark `未列示`
- 地區: parse `[履約地點]`, unit address,投標地址, or detail address when visible; otherwise mark `未列示`
- 單位屬性: `光仁社福基金會 / 活動訊息 / 招標公告`
- 項目類型: infer from title/detail text such as `室內裝修`, `統包工程`, `設計裝修`, `採購`, or `標售`; otherwise mark `未列示`
- 案件屬性: use visible title label such as `公開招標`, `採購公告`, or `決標公告`
- 預算範圍: parse `[預算金額]`, `[採購金額]`, or visible `預算金額`; otherwise mark `未列示`
- 是否過期: compare投標期限,截止收件日期,開標日期, or similar deadline text with the current Asia/Taipei date; for `決標公告`, mark `已決標/不適用`; if no deadline is visible, mark `未標示`

Taiwan Asset Management Co. field mapping:

- 案件名稱: visible announcement title or detail heading
- 編號: parse the numeric `<post-id>` from `https://www.tamco.com.tw/webtamco/<post-id>/` when no official case number appears
- 發布時間: visible announcement category/date line such as `招標公告 YYYY/MM/DD`
- 地區: parse address,投標地址,開標地點, or標的地址 from detail text; otherwise mark `未列示`
- 單位屬性: `台灣金聯 / 訊息公告 / 招標公告`
- 項目類型: infer from title/detail text such as `裝修工程`, `採購案`, `公開標售`, `工程`, or `不動產標售`; otherwise mark `未列示`
- 案件屬性: `招標公告`; append `採購公告`, `公開標售`, or other clear tender status from the title/detail when available
- 預算範圍: parse budget,保證金,採購金額, or visible amount when clearly stated; otherwise mark `未列示`
- 是否過期: compare公告期間,截止收件日期,投標期限,開標時間, or deadline text with the current Asia/Taipei date; if past, mark `已過期`, otherwise mark `未過期`; if no deadline is visible, mark `未標示`

First Bank field mapping:

- 案件名稱: visible announcement title or detail heading
- 編號: parse the numeric `<id>` from `https://www.firstbank.com.tw/sites/fcb/zh_TW/<id>` when no official case number appears
- 發布時間: visible announcement date such as `YYYY年MM月DD日`
- 地區: parse branch name, building, city, address, bid location, or performance location from title/detail text; otherwise mark `未列示`
- 單位屬性: `第一銀行 / 公告資訊 / 招標公告或採購公告`
- 項目類型: infer from title/detail text such as `工程`, `裝修`, `採購`, `設備`, `資訊採購`, `公開甄選`, or `標售`; otherwise mark `未列示`
- 案件屬性: use the source section or clearest tender keyword, such as `招標公告`, `採購公告`, `公開甄選`, `決標公告`, or `標售`
- 預算範圍: parse budget, amount,底價,採購金額, or visible monetary range when clearly stated; otherwise mark `未列示`
- 是否過期: compare bidding, document pickup, submission, opening, closing, or deadline text with the current Asia/Taipei date; for decision notices, mark `已決標/不適用`; if no deadline is visible, mark `未標示`

Yuanta Bank field mapping:

- 案件名稱: visible announcement title or detail heading
- 編號: parse an official case number from the title/detail when visible; otherwise parse the detail URL id or mark `未列示`
- 發布時間: visible announcement date
- 地區: parse branch name, building, city, address, bid location, or performance location from title/detail text; otherwise mark `未列示`
- 單位屬性: `元大銀行 / 公告資訊`
- 項目類型: infer from title/detail text such as `工程`, `裝修`, `採購`, `設備`, `資訊採購`, `清潔`, `保全`, or `機電`; otherwise mark `未列示`
- 案件屬性: `公告資訊`; append the clearest tender keyword such as `招標公告`, `採購公告`, `徵求廠商`, `比價`, or `議價` when clear
- 預算範圍: parse budget, amount,契約總價,採購金額, or visible monetary range when clearly stated; otherwise mark `未列示`
- 是否過期: compare bidding, document pickup, submission, opening, closing, or deadline text with the current Asia/Taipei date; if no deadline is visible, mark `未標示`

Yuanta Financial Holding field mapping:

- 案件名稱: visible major announcement title or detail heading
- 編號: parse the `id` from `https://www.yuanta.com/TW/News-and-Media/Announcements/Detail?id=<id>` when no official case number appears
- 發布時間: visible announcement date
- 地區: parse subsidiary, branch name, building, city, address, project location, or performance location from title/detail text; otherwise mark `未列示`
- 單位屬性: `元大金控 / 重大訊息`
- 項目類型: infer from title/detail text such as `室內裝修`, `工程`, `施工`, `設計`, `採購`, `設備`, `資訊採購`, or `勞務`; otherwise mark `未列示`
- 案件屬性: `重大訊息 / 採購情報`; append `工程採購`, `公開招標`, `契約總價公告`, or other clear tender/procurement status when available
- 預算範圍: parse contract amount, budget,契約總價,追加工程款, or visible monetary range when clearly stated; otherwise mark `未列示`
- 是否過期: for material information about completed board approval or contract amount, mark `重大訊息/不適用`; if an active tender deadline is visible, compare it with the current Asia/Taipei date

Yuanta Life field mapping:

- 案件名稱: visible news title or detail heading
- 編號: parse an official case number from the title/detail when visible; otherwise parse the detail URL id or mark `未列示`
- 發布時間: visible publication date
- 地區: parse office, building, city, address, bid location, or performance location from title/detail text; otherwise mark `未列示`
- 單位屬性: `元大人壽 / 最新消息或重要服務訊息`
- 項目類型: infer from title/detail text such as `工程`, `裝修`, `採購`, `設備`, `資訊採購`, `清潔`, `保全`, or `機電`; otherwise mark `未列示`
- 案件屬性: use the clearest tender keyword, such as `招標公告`, `採購公告`, `徵求廠商`, `公開招標`, or `採購情報`
- 預算範圍: parse budget, amount,契約總價,採購金額, or visible monetary range when clearly stated; otherwise mark `未列示`
- 是否過期: compare bidding, document pickup, submission, opening, closing, or deadline text with the current Asia/Taipei date; if no deadline is visible, mark `未標示`

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
- `華南銀行採購情報今日案件`
- `臺灣企銀招標公告今日案件`
- `彰化銀行招標公告今日案件`
- `資策會採購公告今日案件`
- `兆豐銀行業務公告今日案件`
- `文策院招標公告今日案件`
- `光仁社福招標公告今日案件`
- `台灣金聯招標公告今日案件`
- `第一銀行招標公告今日案件`
- `元大銀行公告資訊今日案件`
- `元大金控重大訊息今日案件`
- `元大人壽公告資訊今日案件`
- `今日需要你處理`
- `AGENTS.MD / GitHub 同步狀態`
- `流程優化建議`

Include Gmail-related sections only when that daily run also performs mailbox work.

If a report includes catch-up dates, state the catch-up range at the start of `今日標案總覽`.

When reporting cases in a table, make the case name clickable and keep a separate `案件連結` column if space allows.
