# marketa demo

walkthrough for showing the team. 5 min if you don't get questions, 10 if you do.

## before the meeting

tabs open left to right:

- #website-blogs
- monday board (https://fruitionservices.monday.com/boards/5028637584)
- the Marketa - Auto Drafts shared drive folder
- sanity studio (in case someone asks where it publishes to)

## the pitch (1 min)

say something close to:

> "so the current content workflow is: someone writes a brief, someone else writes a draft, someone edits, someone formats it for the CMS, someone makes the linkedin version, then we publish. this took like a week per post and we publish one a week so we never get ahead.
>
> i built a thing that does most of that. you post a brief in #website-blogs, ~90 seconds later you get two google docs in your slack thread — a full blog draft and a linkedin variant. you read them, edit in the doc, flip a status on monday, it auto-publishes to fruitionservices.io. that's it."

don't oversell. they'll see if it's good.

## the demo (3-4 min)

### step 1: post a brief

post this in #website-blogs while they watch:

```
Title: <pick something timely or relevant to them>
Industry: <Construction / Operations / SaaS / etc>
Target keyword: <one phrase>

<3-5 sentences of brief. name the angle, name 3 things to cover>
```

while it processes, say:

> "the message hits a vercel route. that route checks you're on the allowed-poster list, parses the title/industry/keyword out, creates a monday item, and fires off n8n to draft the post. you'll see a thread reply in like 2 seconds."

### step 2: queued reply lands

bot replies in thread with the ⏳ Queued card. click "Open in monday".

> "this is the item. brief column, industry, target keyword, slack origin (that's how it knows where to reply later). stage is 'drafting' right now. n8n is calling claude opus with the marketa system prompt. takes about 80-90 seconds."

### step 3: wait for draft ready

refresh monday every 20s or so. when stage flips to "Draft ready":

> "ok stage just flipped. that flip fired another webhook back to vercel, which generated the linkedin post, made two google docs in our shared drive, wrote the urls back to monday, and posted the second reply in slack."

### step 4: open the docs

go back to slack, click "Open blog draft". new tab opens.

> "ok so two things to notice. one — the formatting is real. headings are real google docs headings, bold is real bold, links are real links. nothing has literal # or ** in it. that was annoying to build but it means you don't reformat anything.
>
> two — top of every doc has meta description ready for the cms, then placeholders for AI checks, grammarly, plagiarism screenshots — same shape as ishani's manual drafts so it slots into her review process. bottom has FAQs for AEO."

scroll down briefly. point at one bold term and one hyperlink so they see those are real.

then click "Open LinkedIn post" — same tab thing.

> "linkedin variant. 150-250 words, hook line, bullets, CTA, hashtags. ready to paste."

### step 5: the review flow

back to monday.

> "from here a human reviews. you edit in the doc (anyone @fruitionservices.io can edit, it's shared at the domain level). then on monday you flip stage to either 'edits requested' or 'approved to publish'.
>
> edits requested → vercel sends it back to n8n for a revision pass.
>
> approved to publish → vercel reads the final draft, upserts it to sanity with the slug/industry/seo fields, gets a published url back, writes it to the item."

flip the test item to "Approved to publish" if you're brave, or just describe it.

if you flip it, open the published url. it should be live at fruitionservices.io/blog/<slug>.

## what's not done yet (30s)

be honest:

> "what's working: everything you just saw, slack to publish.
>
> what's not: marketa doesn't pick topics yet — humans still seed the briefs. next is pulling trending keywords from ahrefs or search console and having her draft candidate ideas without anyone posting. and linkedin auto-publish isn't wired — right now you copy-paste from the doc."

## questions they'll probably ask

**"how much does it cost"**
~$1.50-2 per post in claude tokens. nothing else. monday/slack/sanity we already pay for.

**"does it hallucinate stats"**
the system prompt only lets it cite stats if it can produce a real source url. if it can't source a claim it has to soften it. but still verify the citations before publish. real plagiarism check still needs a human paste from a real tool, the doc has a placeholder for that screenshot.

**"who has approval power"**
anyone with monday board access. the stage column is the gate. we can lock it down more if needed.

**"how do I get added as a poster"**
slack user id added to a vercel env var. takes 30 seconds, ping me.

**"can it do images"**
no. you bring your own.

**"what if it writes garbage"**
it does sometimes. you flip to 'edits requested' with a comment in the brief column, n8n takes another pass.

**"why monday for the workflow"**
we're a monday platinum partner, dogfooding the platform. also the stage dropdown is a clean state machine and the webhooks are reliable.

## what to ask them

at the end:

- want to be added to the approved-poster list?
- anything in the doc format you'd change? section order, where placeholders go?
- topics or industries we should tune the prompt for?
- what would make you trust the auto-publish step — required reviewer? staging url? both?
