# SVP presentation: account self-service

The app opens directly into the fictional **Morgan household (DEMO-1042)**. Alex is the owner; Jamie and Taylor have individual demo profiles. Customers can view all account sections immediately. There are no quizzes, XP, levels, or unlock requirements in the self-service interface.

## Launch and reset

Run `npm run dev` and open http://127.0.0.1:5173. For a built version, run `npm run build` followed by `npm start` and open http://127.0.0.1:4000.

Use the top-right settings button → **Reset demo account** → **Reset presentation account** to restore the starting $164 balance, 1,850 reward credits, saved preferences, and sample history. Avatar usage is separate and does not reset. MongoDB is optional; browser storage supports the entire demo. `npm run demo:seed` deliberately replaces the MongoDB demo snapshot when configured.

## Suggested presentation: 5–7 minutes

1. **Overview:** show the current statement, itemized service costs, account owner, members, AutoPay, and account lock. The $15 increase is explained alongside the statement. Select **Review charges** for detailed billing information.
2. **Security & privacy:** open Wireless Account Lock, choose **Locked**, review the proposed value against the current value, and save. Select **View change history** to show the previous value, updated value, actor, and time.
3. **Billing & payments:** review and confirm a simulated $164 payment. No money moves. The outstanding balance becomes $0 and 250 credits are awarded once. Change history records both balance and credit changes.
4. **Wireless plans:** select **Configure preferences**, choose the travel preference, review the $174/month configuration estimate against the $180 budget, and save. This records preferences and an estimate; it does not change the current statement or provision service lines.
5. **Household & location:** open **Manage household & sharing**, switch to Taylor, and enable or disable simulated sharing. Only the active member can change their own sharing. History identifies Taylor and the previous and new privacy states. Return to Alex for owner-only changes.
6. **Search and sections:** all 11 sections and 92 supplied tools are directly accessible. Search globally for “autopay”, “device”, or “location”. Tools open detailed account information or direct settings controls.
7. **Change history:** default view shows account changes. Enable **Include browsing and support activity** for the broader timeline. Export history as JSON. New setting updates include explicit before/after values; older synthetic sample events may only have a description. No-op saves and read-only views do not appear as new account changes in the default view.
8. **Rewards and assistance:** rewards remain an optional account benefit. The assistant and avatar guide are available for explanation, rather than required steps in managing an account.

## Personal household credits and rewards

Open **Your rewards** in the sidebar or **Explore rewards** on Overview. Each household profile now has its own credit balance, completed-activity list, earned/redeemed ledger, and personal reward entitlements. Switch profiles using the header or the rewards page’s household controls.

The pre-existing household credit balance is retained in Alex’s owner wallet on first migration. Jamie, Taylor, and newly added members start at zero. The account-level `credits` field remains the sum of personal balances; no extra starting credits are minted. Existing paid bills and previously redeemed rewards are respected during migration.

Eligible one-time activities:

| Activity | Credits | Eligibility |
| --- | ---: | --- |
| Review the current bill details and choose Done | 50 | Each member |
| Review household wireless usage and choose Done | 75 | Each member; alternate usage view does not pay twice |
| Confirm personal privacy preferences | 75 | Each member, equally for private or sharing-enabled profiles |
| Complete the demo bill payment | 250 | Owner; allocated from the existing payment reward, not awarded twice |
| Confirm the first Feature store configuration | 100 | Owner; subsequent edits do not award again |

Other existing first-time configuration awards are allocated to the acting profile’s wallet and recorded in its ledger. Viewing navigation sections does not earn credits. Privacy confirmation is available in the active member’s household dialog; changing sharing on/off repeatedly cannot generate more credits.

Reward catalog: Account-ready badge (100), Early access preview (200), Priority preorder access (1,000), and Enhanced account alerts (500). Each redemption has a confirmation showing the personal balance and remaining credits. Only that member’s wallet is charged; insufficient balances and repeated redemption are blocked. Demo entitlements do not activate carrier priority, change paid Feature store subscriptions, or reduce a bill. There is no cash value.

Suggested presentation: switch to Taylor → open Your rewards → review bill and usage → confirm privacy while keeping sharing off → show 200 credits → redeem Account-ready badge → show 100 remaining and a separate redemption history. Return to Alex to demonstrate owner-only payment rewards. Refresh to demonstrate persistence.

Tests cover wallet migration, separate balances, one-time rewards, no double-minting of legacy credits, private-profile eligibility, redemption/overspend protection, and new-member initialization. Chrome verified the end-to-end member and owner paths, confirmation, refresh persistence, and mobile widths. No LiveAvatar sessions were started. Profile switching remains a demo identity simulation; production authentication and server-enforced account permissions are not implemented.

## Feature store: live bill, discount, and payment preview

Open **Feature store** in the sidebar or **Explore feature store** on the overview. Select a plan and toggle add-ons, Fiber 500, and next-cycle AutoPay. The estimate updates immediately in the browser; no API or carrier request is required for each toggle.

The store models three existing wireless lines and uses these illustrative monthly rules:

- Essential Connect: $30/line before AutoPay; Everyday Unlimited: $38/line; Premium Unlimited: $50/line.
- AutoPay: $5 discount per line ($15 for three lines).
- Fiber 500: $50 per household. Premium + Fiber 500 earns a $10 household discount.
- Protection: $15; international travel: $10; extra hotspot: $15; enhanced alerts: $5; cloud storage: $5.
- Protection + cloud storage earns a $3 household discount.
- Eligible discounts stack once. Removing a required feature removes its discount instantly.
- Premium includes expanded hotspot, so selecting Premium removes/disables the redundant extra-hotspot add-on.

The default configuration totals **$164**: $114 gross wireless + $15 protection + $50 fiber − $15 AutoPay. Examples: Essential with the same features is $140; Premium with the same features is $190; adding cloud storage makes Premium $192 with $28 total discounts.

On mobile, a fixed compact total stays visible while toggles change; **View bill** jumps to the full breakdown. The preview shows line items, charges before discounts, each qualifying discount, total savings, the difference from the saved setup, and the estimated automatic/manual payment. The preferred demo bill date is the 12th. This is a full-cycle estimate; taxes, fees, prorations, device financing, payment processing, and real eligibility checks are not modeled.

Toggles only affect the preview until **Review changes → Confirm next-cycle setup**. Confirmation shows every changed feature, plan, discount total, payment mode, and monthly estimate. It saves a next-cycle demo configuration with before/after history. The current issued $164 statement, its paid status, current AutoPay setting, and rewards are not rewritten by a future configuration. The overview displays a separate saved next-cycle estimate.

**Reset preview** restores the saved selection. Members can explore the preview; only the owner can confirm. Saved setups persist with account state, and the server recomputes the quote when a MongoDB-backed state update is accepted. The production carrier connection remains simulated.

Tests cover pricing, stacked/removed discounts, payment mode, Premium hotspot handling, invalid configurations, persistence, and before/after history. Chrome checked live toggles, plan swaps, preview without saving, explicit confirmation, refresh, overview separation, reset, mobile layout, and member permissions. No LiveAvatar sessions were started.

## New-member signup: one question at a time

Choose **New member sign up** in the account header (**Sign up** on mobile), or open `/?signup=1`. Andi, Leo, and Maya guide the customer through:

1. **Your details:** a fictional name and email for a demo profile. No password or authenticated login is created.
2. **Number of lines:** choose 1–10 planned wireless lines.
3. **Phone numbers:** for each line, choose a number transfer or a new number. Transfers collect a 10-digit number and current carrier; new numbers collect a preferred area code. No transfer PIN is collected.
4. **Devices:** independently choose an existing device or a new demo phone for each line. Existing devices remain pending compatibility checks. New phones show separate, one-time illustrative prices.
5. **Device features:** review protection, hotspot allowance, and SIM preference for each line.
6. **Account features:** choose AutoPay, spam blocking, account change protection, and notification preferences.
7. **Billing date:** select the suggested 12th, or apply for a custom recurring date from the 1st–28th. A custom date stays **pending review**.
8. **Add-ons:** optional travel, enhanced alerts, and cloud storage preferences. All can be skipped.
9. **Household members:** optionally add members, request transfers from an existing account, or skip. Additional members use additional planned lines in order. Invitations are not sent; member transfers require consent. Added/transferred members start with location sharing off.
10. **Review:** edit previous answers, review recurring and one-time estimates, acknowledge pending actions, and submit the demo setup request.

The estimate updates as choices change. Base wireless is an illustrative $33/line/month; protection and extra hotspot each add $5 per selected line. Add-on prices are displayed before selection. New-device prices are separate, and estimates exclude taxes and fees.

**Back**, refresh, and **Save & exit** retain the draft in this browser. Per-line choices can be mixed: for example, bring an existing number and phone on line 1, and request a new number and phone on line 2. Removing lines removes the associated draft selections and excess member entries.

Submission saves a separate setup request alongside the demo account, with a request ID and explicit pending statuses. The existing Morgan account is not overwritten. Use the **View setup** banner to reopen it; Change history records the new setup submission. When MongoDB is connected, the setup is included in the shared demo account snapshot. There is no real activation, number reservation, number port, device purchase, email invitation, member transfer, bill-date approval, or authentication service behind this prototype.

Automated tests validate input, independent number/device branches, costs, custom dates, member uniqueness/line limits, pending consent, draft resizing, inactive-field cleanup, and duplicate submission protection. Chrome tested the full multi-line custom-date/transfer path and a one-line suggested-date path with skipped extras, including validation, review consent, refresh resume, reopening saved requests, and mobile layout. No LiveAvatar sessions were used.

## Visual section workspaces

Each sidebar section now has its own designed workspace, followed by directly accessible account-tool cards:

- **Account & profile:** owner identity, household member cards, and linked services.
- **Billing & payments:** proportional statement breakdown, charge explanation, and AutoPay control.
- **Wireless plans:** three plan comparison cards, travel options, and saved-configuration details.
- **Devices:** an illustrated device collection with owners and current shared-device assignment.
- **Data & usage:** household distribution chart, previous/current home usage, and notification threshold.
- **Home internet:** an interactive network diagram, simulated speed snapshot, access, downtime, and backup cards.
- **Security & privacy:** demo protection overview and direct controls reflecting saved lock and spam settings.
- **Household & location:** illustrative proximity map showing only opted-in members, plus individual privacy cards.
- **Shopping & upgrades:** illustrative trade-in promotion and device preview cards.
- **Help & support:** Andi, Maya, and Leo specialist cards, troubleshooting, and opt-in video guidance.
- **Notifications:** a dated update feed, current alert preference, and connection status.

Change history uses a connected timeline with before/after panels. Rewards retain their own styled redemption cards. All charts, locations, products, prices, and readings are synthetic and labeled as such. Cards open the existing account tools; opening a card does not save a preference or initiate a transaction.

Chrome checked all 11 layouts and their primary actions, comparison/product/device/specialist cards, notification links, control tiles, mobile widths, and opt-in map markers without starting any LiveAvatar sessions.

## Visible, interactive avatar guides

The account workspace now displays three illustrated local avatars: **Andi** (account guide), **Maya** (billing guide), and **Leo** (service guide). Select a portrait to change your guide; the selection is remembered in this browser. The guide can be minimized without hiding account controls.

Choose one of four guided tasks:

- **Understand & pay my bill:** review charges, confirm a simulated payment, then inspect the balance and credit changes.
- **Review account security:** review protection, manage account lock, then compare the saved values in history.
- **Configure my services:** review the plan, preview and save preferences, then inspect configuration history.
- **Manage location sharing:** review household details, choose your own simulated sharing preference, then review the privacy change.

The guide advances when the relevant review or saved account state is detected. It does not apply a setting or payment on its own. Details and confirmation dialogs also display the selected avatar and the current guidance. Choose **Change task** to leave a walkthrough; saved account changes remain saved.

**Read guidance aloud** uses an installed local English voice, if available, and starts only on click. A written transcript is always visible. **Open live avatar options** opens the video controls and carries the current task’s guidance into the live panel. It does not start a video session. The three selectable portraits are local illustrated avatars; sandbox video uses the separately configured Wayne avatar. No cloud LLM calls are needed for these guided flows.

Chrome verified all four flows, automatic step advancement, avatar selection and persistence, minimize/expand, contextual video-panel text, and mobile layout. Testing created no LiveAvatar sessions or provider requests. Actual live video and MongoDB persistence remain unverified.

## State and tracking

Existing account data is preserved across the interface change, including prior payments, credits, and preferences. The interface no longer displays game progress. Reset is available when a fresh presentation baseline is needed.

New account events capture setting changes, member additions, member location-sharing changes, payment balance changes, earned/redeemed credits, reward entitlements, and saved configuration estimates. Browsing and read-only reviews are retained as activity but excluded from account-change history by default. Writes persist in browser storage, and in the shared MongoDB demo account when connected.

## Optional avatar assistance: stream only on request

**Guided help** opens an animated local character and a transcript. It makes no LiveAvatar provider calls. **Read with local voice** uses an installed English browser/OS voice marked local; if none exists, the transcript remains available. Navigating between sections does not automatically request or play narration.

The provided API key is saved in the ignored, owner-readable `backend/.env`. It is never placed in React environment variables or returned by the API. One read-only avatar metadata request was used to configure the sandbox Wayne avatar’s default voice. No streaming sessions were started during implementation or testing.

Click **Start sandbox avatar · up to 60s** only when ready to show video. This uses LiveAvatar FULL mode with no context or microphone; the avatar repeats the provided account guidance when you click **Narrate this step**. It is a narrated guide, not an open-ended voice agent. Browser audio policy may require another click to hear the stream.

Current guardrails:

- Sandbox is enabled by default. LiveAvatar documents this mode as not consuming credits; sandbox availability and request limits still depend on the provider.
- Two start reservations per UTC day, persisted separately in `backend/.runtime/avatar-budget.json`. Resetting the household does not change this count. Ambiguous start failures count to prevent accidental retry loops.
- One session at a time. No automatic start, reconnect, provider polling, or keep-alive calls.
- 360p video. The WebRTC library downloads only after **Start sandbox avatar** is clicked.
- Up to 60 seconds in sandbox; paid mode is capped at 120 seconds by the server.
- Stops after 45 seconds without guide interaction, on closing the guide, when the tab hides, and on page exit. Server cleanup also stops a session when local browser heartbeats disappear. Failed background stop requests back off and stop retrying after three total attempts; provider duration limits remain the final backstop.
- API start failures leave the transcript and local guide available. No automated tests contact the streaming provider.

For a longer presentation session, deliberately update `backend/.env` and restart the server:

```dotenv
LIVEAVATAR_SANDBOX=false
LIVEAVATAR_AVATAR_ID=<your-production-avatar-id>
LIVEAVATAR_VOICE_ID=<your-available-voice-id>
LIVEAVATAR_MAX_SECONDS=120
LIVEAVATAR_DAILY_SESSION_LIMIT=2
```

Paid mode is metered by LiveAvatar. Changing video resolution alone does not guarantee lower credit usage. Set a higher daily session limit only if your presentation needs it; the application caps the configurable limit at 10. Stop the current guide before resetting or restarting the server.

Official references: [sandbox behavior](https://docs.liveavatar.com/docs/sandbox-mode), [session configuration](https://docs.liveavatar.com/api-reference/sessions/create-session-token), [narration events](https://docs.liveavatar.com/docs/full-mode/events).

## Verification and limits

Automated tests cover all fixtures, tour coverage, repeatable credits, reward redemption, preference persistence, session budgets, timeout cleanup, failure cleanup, and bounded retries. Chrome QA for the redesigned game played all 11 quests, checked incorrect-choice hints, saved outcomes, one-time rewards, all 92 journal entries, a discovery dialog, refresh persistence, mobile layout, and local guide access. Earlier checks covered all tailored feature dialogs and the mocked live-start failure. No browser runtime errors were observed. The actual streamed audio/video session and a real MongoDB connection have not been exercised.

This is a local prototype. Household hubs simulate identities; they are not authenticated sessions or server-enforced permissions. Carrier actions, proximity, payments, diagnostics, product prices, and reward entitlements are synthetic. No invitation or transaction reaches a carrier. MongoDB mode shares a single demo snapshot and does not resolve concurrent writes. Use fictional data for the presentation.

## Squirrel Fund walkthrough

Open **Squirrel Fund** in the sidebar. Each household profile can review and confirm a small contribution from $0.50 to $25. Contributions are reserved separately until Alex, the household owner, confirms **Review bill payment**. Applying funds lowers the current amount due immediately; the regular payment dialog then shows the remaining balance.

For the presentation:

1. Switch to Taylor and chip in $5. Switch to Jamie and chip in $2. The fund now holds $7 without changing the statement balance.
2. Switch to Alex and apply the $7. The amount due becomes $157, with the contribution and application recorded in activity and change history.
3. Enable a member's daily or weekly contribution with explicit consent, an amount, and a monthly cap (up to $100). Saving an enabled schedule makes its first contribution due today. Subsequent checks cannot repeat the same due payment.
4. Use **Pause my schedule now** to stop future contributions. Members can return their own unused funds; funds already applied to the bill cannot be returned through this demo.

Automatic checks run every minute while the app is open, on reopening, and through **Check due demo contribution**. Dates use UTC. Missed periods do not generate catch-up contributions. Contributions stop at the remaining uncovered bill amount or the member's monthly cap; returned contributions still count against that month's automatic cap. There is no background payment service or connected funding source.

Reserved funds, applied funds, and reward credits are separate. Partial bill applications do not earn payment credits; completing the bill earns the existing 250-credit payment award once. Ordinary demo payment can leave unused reserved contributions available for their contributors to return. Future-cycle Feature store estimates remain separate from the current statement.

Verification: 58 automated tests pass, including contribution validation, duplicate protection, monthly caps, schedule pause, member returns, owner application, and payment reward accounting. Chrome checks covered multiple household profiles, automatic contributions, remaining-balance payment, refresh persistence, and mobile layout. No real transfers or LiveAvatar requests were made.
