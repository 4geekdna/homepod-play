# HomePod Play (Home Assistant)

Mobile page that sends real HTTP calls to Home Assistant:

```
POST {HA_URL}/api/services/media_player/media_play_pause
Authorization: Bearer {LONG_LIVED_TOKEN}
{"entity_id":"media_player.your_homepod"}
```

Live URL: https://4geekdna.github.io/homepod-play/

## Home Assistant setup

### 1. Expose the HomePod as a media player
Use **Apple TV** integration (HomePod Mini often appears there) or another integration that creates `media_player.*` for the bedroom HomePod. Copy the entity id, e.g. `media_player.bedroom_homepod`.

### 2. Create a long-lived token
Profile (your name, lower-left) → **Security** → **Long-lived access tokens** → Create token. Copy it once.

### 3. Allow this webpage to call HA (required)
GitHub Pages is `https://4geekdna.github.io`. Browsers block the request unless HA allows that origin.

In `configuration.yaml`:

```yaml
http:
  cors_allowed_origins:
    - https://4geekdna.github.io
```

Restart Home Assistant.

### 4. Use HTTPS if the page is HTTPS
An `https://` webpage cannot call `http://homeassistant.local:8123` (mixed content).
Options:
- Open HA over HTTPS (Nabu Casa, reverse proxy, or local TLS)
- Or open this control page over HTTP on your LAN instead of GitHub Pages

### 5. Fill the form on the page
- HA URL: `https://your-ha-address:8123` (no trailing slash)
- Token: the long-lived token
- Entity: `media_player.bedroom_homepod`
- Tap **Save & test**

## What the buttons do
- **Play** → `media_play`
- **Pause** → `media_pause`
- **Play / Pause** → `media_play_pause`
- **Stop** → `media_stop`
- **Start playlist (Shortcuts)** still launches `Called erotic music` to start the Apple Music playlist (HA play usually only resumes what is already queued)
