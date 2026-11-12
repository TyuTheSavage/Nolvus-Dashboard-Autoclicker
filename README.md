# Nolvus Background Clicker

Click Nexus Mods' **Slow download** button inside Nolvus Dashboard while keeping your mouse free for gaming or other apps.

This unofficial tool connects to Dashboard's local browser debugging port. It searches normal page content, open shadow DOM, and accessible frames for a visible, enabled button labelled exactly **Slow download**. It does not move the system cursor or activate windows.

## Requirements

- Windows and Nolvus Dashboard.
- [Node.js](https://nodejs.org/) 24 or newer, installed with Node available on PATH.
- A Nexus Mods account signed in inside Dashboard.

There are no npm dependencies and no npm install step.

## Setup

1. Download this repository using **Code > Download ZIP**, then extract it. Keep the files together.
2. Install Node.js if needed. Open a new terminal and check `node --version`.
3. Close Dashboard, create a shortcut to `NolvusDashBoard.exe`, and open the shortcut's **Properties**.
4. Append `--remote-debugging-port=8088` after the executable's closing quote in **Target**, for example:

   ```text
   "D:\Nolvus\NolvusDashBoard.exe" --remote-debugging-port=8088
   ```

   Replace the example path with your installation path. Do not move your Nolvus installation.
5. Start Dashboard using that shortcut and resume installation.
6. Double-click `Start-Nolvus-Clicker.cmd`. Leave its window open; minimizing it is fine.

You can use your mouse in another app while downloads proceed. Dashboard may still display its own windows or prompts.

## Stop

Close the clicker's console, press **Ctrl+C** in it, or run `Stop-Nolvus-Clicker.cmd` from the same folder. Allow up to roughly 15 seconds for a pending check to finish. Run only one copy at a time.

## Command line

```sh
node nolvus-background-clicker.mjs
```

To perform one scan (which can click a download button):

```sh
node nolvus-background-clicker.mjs --once
```

## How it works

The script polls `http://127.0.0.1:8088/json/list` every two seconds and connects to Nexus page targets using Node's built-in WebSocket support. It evaluates a small button search in the page, including open shadow roots, and calls the matching button's click handler. A per-page 20-second cooldown reduces repeated clicks.

It does not use the old Go downloader or its browser-protocol event decoder. Cookie events are ignored rather than decoded into Go types.

## Troubleshooting

- **Node is not recognized:** install Node.js 24 or newer and reopen your terminal or launcher.
- **Cannot find module:** extract all files together and run the launcher beside the `.mjs` file.
- **Connection error:** check Dashboard was started with the debugging flag. Open `http://localhost:8088/json/list` in your browser to check the endpoint.
- **Waiting for Slow download:** finish login, cookie choices, or verification manually. The tool only clicks the download button; it does not solve verification challenges.
- **Button stays visible:** Nexus markup may have changed. Include the error and Dashboard version in a GitHub issue. Review logs before sharing them; they contain timestamps and mod titles.

Logs are written to `nolvus-clicker.log` beside the script. Logs and stop flags are excluded by `.gitignore`.

## Compatibility and limits

Tested during a Nolvus Dashboard 4.0.2 installation on Windows with Node.js 24.22.1. Successive mod pages advanced in the live test. Other versions, minimized rendering, and future Nexus page changes have not been verified.

This tool does not change download speed limits or grant Premium features. It only automates the existing free-download button. Use it in accordance with the services' applicable rules.

The debugging endpoint provides browser control. Keep port 8088 local; do not expose or forward it. Remove the shortcut flag when you no longer need automation.

## License

MIT. This project is not affiliated with or endorsed by Nolvus or Nexus Mods.
