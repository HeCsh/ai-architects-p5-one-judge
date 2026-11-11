// The judge.
//
// It turns a judge from config.json into instructions the AI can follow,
// sends them off through ai.mjs, and reads the score out of the answer.
//
// It never talks to the AI directly. That is ai.mjs's job, and only ai.mjs.

import { askAI } from './ai.mjs';

// The rubric is the most important part of the prompt. Without it, an AI
// gives almost everything a 7, because 7 sounds polite. Telling it exactly
// what a 9, a 5 and a 2 look like gives it something to measure against.
export function buildPrompt(config, judge, submission) {
  return [
    `You are ${judge.name}, a judge on a panel. ${judge.character}`,
    '',
    `Someone has sent in ${config.submission}. Score it out of 10 using this rubric:`,
    `- 9 means ${judge.rubric['9']}`,
    `- 5 means ${judge.rubric['5']}`,
    `- 2 means ${judge.rubric['2']}`,
    'Scores in between are fine when it falls between two of these.',
    '',
    'Stay in character. Explain your score in exactly two sentences.',
    'Answer in exactly this format and nothing else:',
    'SCORE: <a whole number from 1 to 10>',
    'REASON: <your two sentences>',
    '',
    'Here is what they sent in:',
    '"""',
    submission,
    '"""',
  ].join('\n');
}

// The AI sends back plain text. We asked for a set format, but an AI does
// not always obey, so this reads it carefully rather than trusting it.
export function readAnswer(text) {
  const scoreMatch = text.match(/SCORE:\s*(\d+(?:\.\d+)?)/i);
  const reasonMatch = text.match(/REASON:\s*([\s\S]+)/i);
  if (!scoreMatch || !reasonMatch) {
    throw new Error('The judge answered in the wrong format, so no score could be read.');
  }

  // Anything outside 1 to 10 gets pulled back inside, so a judge who gets
  // carried away and says 11 cannot break the page.
  const score = Math.min(10, Math.max(1, Math.round(Number(scoreMatch[1]))));

  // We asked for two sentences. If the judge rambles on, keep the first two.
  const reason = reasonMatch[1]
    .replace(/[*_`#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+/)
    .slice(0, 2)
    .join(' ');

  return { score, reason };
}

export async function judgeIt(config, submission) {
  const judge = config.judge;
  const answer = await askAI(buildPrompt(config, judge, submission));
  return { judge: judge.name, character: judge.character, ...readAnswer(answer) };
}
