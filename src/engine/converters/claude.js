import { demoteHeadings } from './headingDemoter.js';

/**
 * Claude (claude.ai) LaTeX & Heading Converter for Obsidian Markdown
 *
 * Claude output has native LaTeX support ($$ / $), but applies heading demotion (default +3 levels).
 */

export function convertClaude(input, options = {}) {
  if (!input) return '';
  const headingShift = options.headingShift !== undefined ? options.headingShift : 3;
  return demoteHeadings(input, headingShift);
}
