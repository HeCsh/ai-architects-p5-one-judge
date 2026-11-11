# AI Architects · Project 5: One judge (checkpoint)

Finished state of Project 5. One thing is working here:

- **A judge.** Type a soccer opinion into the box and press **Ask the judge**. The Pundit scores it out of ten and says why in two sentences.

Use this repo as the starting point for Project 5, or as the catch-up checkpoint for anyone who fell behind.

**Needs a key:** a `GEMINI_API_KEY`, the same kind of key you used in Projects 3 and 4.

## Why this project needs a server

Projects 1 to 4 were just files. The bot ran on a timer, saved the news, and the website showed what was saved. Nobody was waiting for an answer.

This time somebody types and wants an answer straight away. So something has to be awake and listening, and it has to hold the key. The key cannot go in the web page, because anyone can read every file a web page downloads. That something is the server, `scripts/server.mjs`. The browser talks to the server, and only the server talks to the AI.

## How this repo works

| File | What it does |
| --- | --- |
| `index.html` | The web page. A box, a button, and a card for the judge's score. |
| `config.json` | The settings you change: the topic, what gets sent in, and the judge with their character and rubric. |
| `scripts/server.mjs` | The server. Hands out the page, and passes each submission to the judge. |
| `scripts/judge.mjs` | The judge. Turns the judge in `config.json` into instructions for the AI, and reads the score out of the answer. |
| `scripts/ai.mjs` | The only file that talks to the AI. If the AI or the hosting ever changes, this is the only file that changes. |
| `.env` | Your secret key. You make this file yourself, and it never gets uploaded. |

## Run it on your own computer

You need Node.js 22 or newer. Type `node --version` in a terminal to check.

1. Press **Use this template** at the top of this page to make your own copy. Then get it onto your computer: press the green **Code** button and choose **Download ZIP**, and unzip it.
2. In the project folder, make a file called `.env` with one line in it:

   ```
   GEMINI_API_KEY=paste-your-key-here
   ```

   There is an example in `.env.example`. The `.gitignore` file stops `.env` from ever being uploaded.

3. In a terminal, in the project folder, run:

   ```
   node --env-file=.env scripts/server.mjs
   ```

4. Open **http://localhost:3000** in your browser.
5. Type an opinion and press **Ask the judge**.

To stop the server, click in the terminal and press **Ctrl+C**.

Nothing to install. It only uses what comes with Node.js.

## Change the judge

Open `config.json`. The judge lives there, not in the code.

```json
"judge": {
  "name": "The Pundit",
  "character": "A loud television pundit. Cares whether a claim is bold and whether it is actually backed up.",
  "rubric": {
    "9": "a clear claim with two or more specific reasons",
    "5": "a fair opinion resting on one thin reason",
    "2": "a claim with no reasoning, or one that contradicts itself"
  }
}
```

The **rubric** matters most. It tells the judge what a 9, a 5 and a 2 look like. Without it, an AI gives almost everything a 7, because 7 sounds polite. Change a line, save the file, and press the button again. You do not need to restart the server.

## Try these

| Type this | What the judge should think |
| --- | --- |
| Palmer should start ahead of Foden. He has more goal involvements this season and he takes the set pieces. | Clear claim, two reasons. High. |
| Arsenal will win the league because they are good. | One thin reason. Middle. |
| Just play everyone in attack. | No reasoning at all. Low. |

## What is deliberately missing

These gaps are on purpose. Each one is fixed in a later project. If you notice one, you have not made a mistake.

- **There is only one judge.** One judge cannot disagree with anybody, so there is no verdict yet. Project 6 adds two more judges and a verdict.
- **The judge will score anything.** Type an opinion about pizza, or ask it to rate your friend, and it will happily give a score. Project 6 adds rules so it only judges its own topic and never rates a person.
- **Soccer is written into the page.** The heading, the intro and the example in the box all say soccer. Project 7 moves all of that into `config.json` so the same code works for any topic.
- **Odd input gets a score anyway.** One word, nonsense, or a question instead of an opinion still gets a number. Project 8 teaches the judges to ask for more instead.
- **Nobody has checked the judge is fair.** Project 9 adds a set of test opinions with the scores they should get.
- **It only runs on your computer.** It is not online yet. Project 9 puts it on the internet.

Part of the JetLearn **AI Architects** course, Project 5.
