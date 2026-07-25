import { demoteHeadings } from './headingDemoter.js';

/**
 * Google Gemini LaTeX & Heading Converter for Obsidian Markdown
 *
 * Gemini output has native LaTeX support, but applies heading demotion (default +2 levels).
 */

export function convertGemini(input, options = {}) {
  if (!input) return '';
  const headingShift = options.headingShift !== undefined ? options.headingShift : 2;
  return demoteHeadings(input, headingShift);
}
