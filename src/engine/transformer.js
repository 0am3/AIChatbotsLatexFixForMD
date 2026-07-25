import { convertDeepSeek } from './converters/deepseek.js';
import { convertGemini } from './converters/gemini.js';

export const SUPPORTED_LLMS = [
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: '⚡',
    badge: 'Fix Required',
    description: 'Converts \\( \\) to $ $ and \\[ \\] to $$ $$ for Obsidian'
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    icon: '✨',
    badge: 'Native Support',
    description: 'Pass-through (Gemini output already formatted for Obsidian)'
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
 * @param {string} llmId - Selected LLM ('deepseek', 'gemini')
 * @param {string} envId - Selected target environment ('obsidian')
 * @returns {string} Formatted Markdown text
 */
export function transformMarkdown(input, llmId = 'deepseek', envId = 'obsidian') {
  if (!input) return '';

  switch (llmId.toLowerCase()) {
    case 'deepseek':
      return convertDeepSeek(input);
    case 'gemini':
      return convertGemini(input);
    default:
      return convertDeepSeek(input);
  }
}
