# Phase 2 — what Edward needs to do in browser

My sandbox can't reach `console.cloud.google.com`, `drive.google.com`, or `vercel.com`. These five tasks are gated on you. Each is small. Order matters for #3 → #4 → #5.

## 1. Vercel: switch test channel (~1 min)

Project: `fruition-landing` (team `JQoxPCHAFHTF2kAHrdGRkxPV`).

Settings → Environment Variables → find `SLACK_BLOG_IDEA_CHANNEL_ID` → set Production value to:

```
C0B4NFVDJKY
```

(That's `#website-blogs`. Bot is already a member, mentions already work there.)

Redeploy Production (or wait for the next push to trigger one).

## 2. LLM API key in Vercel (~1 min)

The new `marketaLinkedIn.ts` uses `OPENROUTER_API_KEY` (same as the existing bot at `src/lib/claudeClient.ts`). Confirm it's already in Production env — it should be, since the Fruition Bot mention replies already work. If it isn't, the bot would also be broken.

You can override the model with `MARKETA_LINKEDIN_MODEL` (default `anthropic/claude-sonnet-4.5`) if you want to swap to Haiku for cheaper or Opus for richer output.

The n8n draft path (full blog) uses a separate direct-Anthropic credential stored inside n8n itself, so Vercel doesn't need anything else.

## 3. GCP service account (~8 min)

1. Open https://console.cloud.google.com/projectcreate while signed in as `edward@fruitionservices.io`.
2. Project name: `fruition-marketa`. Organization: pick whatever Fruition org is available (or leave No organization if your account has no org).
3. Once created, open the project, then:
4. https://console.cloud.google.com/apis/library/drive.googleapis.com → Enable.
5. https://console.cloud.google.com/apis/library/docs.googleapis.com → Enable.
6. https://console.cloud.google.com/iam-admin/serviceaccounts → Create service account.
   - Name: `marketa-auto-docs`
   - Description: `Service account for Marketa auto-docs (Vercel)`
   - **No** project roles needed (Drive permission is granted at the folder level in step 4, not via IAM).
   - Skip "Grant users access".
   - Done.
7. Click the new SA, Keys tab, Add key, JSON, Create. A file like `fruition-marketa-xxxxxxx.json` downloads.

Copy the service account's email — it'll look like `marketa-auto-docs@fruition-marketa.iam.gserviceaccount.com`. You'll need it for step 4.

## 4. Drive folder (~3 min)

1. Open https://drive.google.com/drive/my-drive while signed in as `edward@fruitionservices.io`.
2. New → New folder → name it exactly: `Marketa - Auto Drafts`.
3. Right-click the folder → Share → Share. Paste the service account email from step 3. Role: **Editor**. Uncheck "Notify people". Send.
4. Open the folder. Copy the folder ID from the URL — it's the part after `/folders/`. Looks like `1ABC...xyz`.

## 5. Vercel env vars for Google (~3 min)

In a terminal, run:

```
base64 -i ~/Downloads/fruition-marketa-xxxxxxx.json | pbcopy
```

(replace the filename with the actual download). That puts the base64 blob in your clipboard.

In Vercel → Settings → Environment Variables → Add new:

- `GOOGLE_SERVICE_ACCOUNT_JSON_B64` = paste the base64 blob. Production env.
- `MARKETA_DRAFTS_FOLDER_ID` = the folder ID from step 4. Production env.

Redeploy Production.

## When done

Reply with "phase 2 done" or similar. I'll have the Phase 3 code already committed waiting for those env vars to exist. We'll do an end-to-end smoke test (top-level post in #website-blogs → verify Slack thread reply + 2 Google Docs appear).
