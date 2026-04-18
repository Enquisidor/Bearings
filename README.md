# Bearings

"In fact, 'task' is not quite the right word. Rather a 'compass', something that can help us at least to some extent orient ourselves within a fragmented chaos, where very few past and tested recipes remain operative." - Alenka Zupancic

An instrument for noticing when the assumptions you navigate *from* have stopped working.

Not a therapist. Not a coach. Not an oracle. A compass for people whose ground is moving.

---

## What it is

Bearings is a [Claude Project](https://support.claude.com/en/articles/9517075-what-are-projects) template. You set it up once inside your own Claude.ai account and use it whenever you need to think out loud about why something isn't working the way it used to.

It runs on your own Claude subscription. It's not a service. Your conversations and your Readings live inside your own Claude account — this repository is just the configuration.

## What it's useful for

- When a framework you relied on stops producing accurate readings
- When a strategy that used to work stops working, for reasons you can't quite name
- When an intuition that felt load-bearing suddenly feels contingent
- When you're reaching for something and it isn't there

Bearings doesn't give you a new direction. It helps you see that the old direction has stopped being reliable, and sits with you inside the uncertainty until a new one is actually available.

## Setup (one time, ~5 minutes)

1. You need a [Claude.ai](https://claude.ai) account. Any plan works, including free.
2. In Claude.ai, open **Projects** in the sidebar → **Create project** → name it `Bearings`.
3. Open the Project. Click **Edit** on the instructions panel. Copy the entire contents of [`project-instructions.md`](./project-instructions.md) and paste them in. Save.
4. Add a new document to the Project knowledge. Name it `Readings`. Leave it empty. This is where your accumulated field notes will live.

Done.

## Using it

- **Start a session** — open your Bearings Project, start a new chat. Just say what's on your mind, or let Bearings ask.
- **End a session** — tell Bearings when you're ready to stop. It will offer to update your Readings, either as prose in the chat or as a downloadable `Readings.md` file. The file option is usually cleaner — download it, upload it to the Project knowledge to replace the existing Readings document.
- **See your readings anytime** — just ask. Bearings renders them as a short field note.
- **Edit directly** — open the Readings document in the Project knowledge and edit it yourself. Your record, your hand.
- **Incognito** — at the start of a session, say *"I want this one to be incognito."* Bearings will skip reading from your Readings and won't offer to update them.

## Core concepts

**The poleshift.** A previously reliable coordinate becomes inoperative — not because it was wrong, but because the terrain it was mapping has changed. You reach for it and find nothing, or something that returns a false reading.

**Three field states.** *Stable* — coordinates are working. *Spinning* — active flux, the reading is genuinely null, and that's information. *Confidently wrong* — the most dangerous state, old coordinates returning false positives.

**Load-bearing assumptions.** The coordinates you navigate *from*, not the ones you consciously hold. Bearings listens for these underneath the conversation and surfaces them at the right moment.

**Readings.** The quiet, running record of what has surfaced across your conversations. Stored as prose, not as a schema. Editable by you at any time.

## A note on privacy

Your Readings and your conversations live inside your own Claude Project, under your own Claude account. Anthropic's standard privacy policies apply.

Bearings itself is not a service — nothing is hosted anywhere by anyone on your behalf. This repository only contains the instructions. Once you set up your Project, nothing in this repo is involved in your conversations.

If you want a conversation that touches no record at all, use incognito mode.

## Background

Bearings started from a question about Alenka Zupančič's observation that fragmentation has left us without reliable universals to orient by — and that the task (or rather, the compass) is to find new ways to navigate chaos where "few past and tested recipes remain operative."

The product is a small attempt at one such compass. Not a universal. Just an instrument for the wanderer.

## License

MIT. Do what you want with it. If you improve it, a pull request would be welcome.
