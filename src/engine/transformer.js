import { convertDeepSeek } from './converters/deepseek.js';
import { convertGemini } from './converters/gemini.js';
import { convertClaude } from './converters/claude.js';

export const SUPPORTED_LLMS = [
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: '⚡',
    badge: 'Fix Required',
    defaultHeadingShift: 1,
    description: 'Converts \\( \\) to $ $ and \\[ \\] to $$ $$. Demotes headings by +1 level.'
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: '🧠',
    badge: 'Passthrough',
    defaultHeadingShift: 3,
    description: 'Pass-through LaTeX math with default +3 level heading demotion.'
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    icon: '✨',
    badge: 'Passthrough',
    defaultHeadingShift: 2,
    description: 'Pass-through LaTeX math with default +2 level heading demotion.'
  }
];

export const SUPPORTED_ENVIRONMENTS = [
  {
    id: 'obsidian',
    name: 'Obsidian MD',
    icon: '💎',
    supported: true
  },
  {
    id: 'notion',
    name: 'Notion (Coming Soon)',
    icon: '📝',
    supported: false
  },
  {
    id: 'typora',
    name: 'Typora (Coming Soon)',
    icon: '📄',
    supported: false
  }
];

/**
 * Main Transformation Dispatcher
 * @param {string} input - Raw clipboard or typed AI Markdown text
 * @param {string} llmId - Selected LLM ('deepseek', 'claude', 'gemini')
 * @param {string} envId - Selected target environment ('obsidian')
 * @param {Object} options - Additional options e.g. { headingShift: 1 }
 * @returns {string} Formatted Markdown text
 */
export function transformMarkdown(input, llmId = 'deepseek', envId = 'obsidian', options = {}) {
  if (!input) return '';

  switch (llmId.toLowerCase()) {
    case 'deepseek':
      return convertDeepSeek(input, options);
    case 'claude':
      return convertClaude(input, options);
    case 'gemini':
      return convertGemini(input, options);
    default:
      return convertDeepSeek(input, options);
  }
}
