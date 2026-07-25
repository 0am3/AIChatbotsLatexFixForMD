import { demoteHeadings } from './headingDemoter.js';

/**
 * DeepSeek LaTeX & Heading Converter for Obsidian Markdown
 *
 * Rules:
 * 1. Display math: Replace `\[` ... `\]` with `$$` ... `$$`
 * 2. Inline math: Replace `\(` ... `\)` with `$` ... `$`
 * 3. Heading Demoter: Shifts heading levels down by headingShift
 * 4. Preserves code blocks and inline code backticks to prevent unintentional replacements.
 */

export function convertDeepSeek(input, options = {}) {
  if (!input) return '';
  const headingShift = options.headingShift !== undefined ? options.headingShift : 1; // Default +1 for DeepSeek

  // Tokenize string to separate code blocks / inline code from normal text
  const tokens = [];
  const codeBlockRegex = /(```[\s\S]*?```|`[^`\n]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', content: input.substring(lastIndex, match.index) });
    }
    tokens.push({ type: 'code', content: match[0] });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < input.length) {
    tokens.push({ type: 'text', content: input.substring(lastIndex) });
  }

  // Process text tokens
  const processedTokens = tokens.map(token => {
    if (token.type === 'code') return token.content;

    let text = token.content;

    // 1. Convert Display Math: \[ ... \] to $$ ... $$
    text = text.replace(/\\\[([\s\S]*?)\\\]/g, (fullMatch, equation) => {
      return `$$\n${equation.trim()}\n$$`;
    });

    // 2. Convert Inline Math: \( ... \) to $ ... $
    text = text.replace(/\\\(([\s\S]*?)\\\)/g, (fullMatch, equation) => {
      const trimmed = equation.trim();
      return `$${trimmed}$`;
    });

    return text;
  });

  const convertedLatex = processedTokens.join('');

  // Apply Heading Demotion
  return demoteHeadings(convertedLatex, headingShift);
}
