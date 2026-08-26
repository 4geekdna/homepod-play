# HomePod Play

Simple mobile web page that starts an Apple Music playlist on your **bedroom HomePod Mini** by launching the iOS Shortcut **Called erotic music**.

**Live URL (after enabling Pages):**  
https://4geekdna.github.io/homepod-play/

## How it works

A browser cannot talk to a HomePod directly. This page opens:

`shortcuts://run-shortcut?name=Called%20erotic%20music`

Your existing Shortcut then plays the playlist on the bedroom HomePod Mini.

## One-time Pages setup

1. Repo → **Settings** → **Pages** (left sidebar: **Code, planning, and automation**)
2. Source → **GitHub Actions**
3. **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**

## Use on iPhone

1. Open the live URL in Safari or Chrome
2. Tap **Play on Bedroom HomePod**
3. Allow the page to open Shortcuts if asked

The Shortcut name must match **exactly**: `Called erotic music`
