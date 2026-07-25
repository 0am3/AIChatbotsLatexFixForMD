import { demoteHeadings } from './headingDemoter.js';

/**
 * Google Gemini LaTeX & Heading Converter for Obsidian Markdown
 *
 * Gemini output has native LaTeX support, but optionally applies heading demotion if specified.
 */

export function convertGemini(input, options = {}) {
  if (!input) return '';
  const headingShift = options.headingShift !== undefined ? options.headingShift : 0;
  return demoteHeadings(input, headingShift);
}
