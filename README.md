# Korean Phrase Quiz

A simple website for learning useful everyday Korean phrases through multiple-choice quizzes.
Built with HTML, CSS and JavaScript 

## Features

- 10 everyday phrases displayed in both Hangul and English
- Questions and answer options are shuffled every round
- Instant right/wrong feedback with a short explanation
- Result view with score and percentage

## Project structure

```
index.html                  The page (start, quiz and result views)
css/style.css               Styling
js/quiz.js                  Quiz logic
data/phrases-questions.json Questions and answer options
```

## How to run

The questions are loaded with `fetch()`, which does not work when `index.html` is opened
directly from the file system (`file://`). Use a local server instead, for example:

- **VS Code:** install the *Live Server* extension, right-click `index.html` and choose *Open with Live Server*.

## Adding questions

Add a new object to the `questions` array in `data/phrases-questions.json`:

```json
{
  "id": 11,
  "phrase": "물 주세요",
  "romanization": "mul juseyo",
  "options": ["Water, please", "Coffee, please", "The bill, please", "Help me, please"],
  "answer": "Water, please",
  "note": "Optional explanation shown after answering."
}
```

`answer` must match one of the `options` exactly.
