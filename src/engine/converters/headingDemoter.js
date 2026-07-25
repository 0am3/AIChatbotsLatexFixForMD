/**
 * Heading Demoter (Hierarchy Shift) Helper
 *
 * Safely demotes Markdown ATX headings (# , ## , ### , etc.) by a specified offset level
 * while protecting code blocks, inline code, and non-heading '#' usages.
 *
 * @param {string} input - Markdown text
 * @param {number} levelShift - Number of levels to shift down (e.g. +1, +2)
 * @returns {string} - Modified markdown text
 */
export function demoteHeadings(input, levelShift = 0) {
  if (!input || typeof input !== 'string') return '';
  const shift = parseInt(levelShift, 10);
  if (isNaN(shift) || shift <= 0) return input;

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

    // Replace line-start headings: ^(#{1,6})(\s+.*)
    return token.content.replace(/^(#{1,6})(\s+[^\n]*)/gm, (fullMatch, hashes, rest) => {
      const currentLevel = hashes.length;
      const newLevel = Math.min(currentLevel + shift, 6);
      return '#'.repeat(newLevel) + rest;
    });
  });

  return processedTokens.join('');
}
