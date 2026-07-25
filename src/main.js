import { transformMarkdown, SUPPORTED_LLMS } from './engine/transformer.js';
import { readFromClipboard, copyToClipboard } from './engine/clipboard.js';
import { marked } from 'marked';
import katex from 'katex';

// Application State
const state = {
  currentLlm: 'deepseek',
  currentEnv: 'obsidian',
  inputText: '',
  outputText: ''
};

// Sample DeepSeek Markdown response
const SAMPLE_DEEPSEEK = `# Sample Fourier Series Calculation (DeepSeek Output)

با استفاده از سری فوریه تابع \\( f(x) = x^2 \\) در بازه \\( |x| < 1 \\) (یعنی بازه \\( (-1, 1) \\) با دوره تناوب \\( 2 \\) )، مقادیر سری‌های خواسته شده را محاسبه می‌کنیم.

### ۱. محاسبه سری فوریه تابع
از آنجا که \\( f(x) = x^2 \\) تابعی زوج است، ضرایب سینوسی صفر هستند (\\( b_n = 0 \\)) و سری فوریه به‌صورت زیر نوشته می‌شود:
\\[
f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} a_n \\cos(n\\pi x)
\\]
که در آن \\( L = 1 \\) و ضرایب از روابط زیر به‌دست می‌آیند:
\\[
a_0 = 2 \\int_{0}^{1} f(x) \\, dx = 2 \\int_{0}^{1} x^2 \\, dx = 2 \\left[ \\frac{x^3}{3} \\right]_0^1 = \\frac{2}{3}
\\]
\\[
a_n = 2 \\int_{0}^{1} f(x) \\cos(n\\pi x) \\, dx = 2 \\int_{0}^{1} x^2 \\cos(n\\pi x) \\, dx
\\]
برای محاسبه انتگرال، از روش جزء به جزء استفاده می‌کنیم:
\\[
\\int x^2 \\cos(kx) \\, dx = \\frac{x^2}{k}\\sin(kx) + \\frac{2x}{k^2}\\cos(kx) - \\frac{2}{k^3}\\sin(kx) \\quad (k = n\\pi)
\\]
پاسخ نهایی:
\\[
\\boxed{\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}} \\quad , \\quad \\boxed{\\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n^2} = \\frac{\\pi^2}{12}}
\\]`;

// DOM Elements
let inputTextarea;
let outputTextarea;
let llmButtons;
let envSelect;
let btnPaste;
let btnCopy;
let btnClear;
let btnLoadSample;
let btnPreviewToggle;
let btnClosePreview;
let previewModal;
let previewBody;
let inputStats;
let outputStats;

document.addEventListener('DOMContentLoaded', () => {
  initElements();
  initCanvasBackground();
  initEventListeners();
});

function initElements() {
  inputTextarea = document.getElementById('input-text');
  outputTextarea = document.getElementById('output-text');
  llmButtons = document.querySelectorAll('.llm-btn');
  envSelect = document.getElementById('env-select');
  btnPaste = document.getElementById('btn-paste-clipboard');
  btnCopy = document.getElementById('btn-copy-output');
  btnClear = document.getElementById('btn-clear-input');
  btnLoadSample = document.getElementById('btn-load-sample');
  btnPreviewToggle = document.getElementById('btn-preview-toggle');
  btnClosePreview = document.getElementById('btn-close-preview');
  previewModal = document.getElementById('preview-modal');
  previewBody = document.getElementById('preview-body');
  inputStats = document.getElementById('input-stats');
  outputStats = document.getElementById('output-stats');
}

function initEventListeners() {
  // Input live conversion
  inputTextarea.addEventListener('input', () => {
    state.inputText = inputTextarea.value;
    runConversion();
  });

  // LLM Switch buttons
  llmButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      llmButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentLlm = btn.dataset.llm;
      showToast(`Selected LLM: ${btn.textContent.trim()}`);
      runConversion();
    });
  });

  // Target environment selection
  envSelect.addEventListener('change', (e) => {
    state.currentEnv = e.target.value;
    document.getElementById('target-env-label').textContent = `Target: ${e.target.options[e.target.selectedIndex].text.split(' ')[1]} MD`;
    runConversion();
  });

  // Paste from Clipboard
  btnPaste.addEventListener('click', async () => {
    try {
      const text = await readFromClipboard();
      if (text) {
        inputTextarea.value = text;
        state.inputText = text;
        runConversion();
        showToast('Pasted successfully from clipboard! ✨');
      } else {
        showToast('Clipboard is empty');
      }
    } catch (err) {
      showToast(`⚠️ ${err.message || 'Clipboard access denied'}`);
    }
  });

  // Copy output
  btnCopy.addEventListener('click', async () => {
    if (!state.outputText) {
      showToast('Nothing to copy!');
      return;
    }
    const success = await copyToClipboard(state.outputText);
    if (success) {
      showToast('Copied transformed Markdown to clipboard! 📋');
    } else {
      showToast('Failed to copy text.');
    }
  });

  // Clear Input
  btnClear.addEventListener('click', () => {
    inputTextarea.value = '';
    state.inputText = '';
    runConversion();
    showToast('Input cleared');
  });

  // Load DeepSeek Sample
  btnLoadSample.addEventListener('click', () => {
    // Switch to DeepSeek button active state
    llmButtons.forEach(b => {
      if (b.dataset.llm === 'deepseek') b.classList.add('active');
      else b.classList.remove('active');
    });
    state.currentLlm = 'deepseek';

    inputTextarea.value = SAMPLE_DEEPSEEK;
    state.inputText = SAMPLE_DEEPSEEK;
    runConversion();
    showToast('Loaded DeepSeek sample output! 🧪');
  });

  // Live Preview Modal Toggle
  btnPreviewToggle.addEventListener('click', () => {
    renderPreviewModal();
    previewModal.classList.add('active');
  });

  btnClosePreview.addEventListener('click', () => {
    previewModal.classList.remove('active');
  });

  previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
      previewModal.classList.remove('active');
    }
  });
}

function runConversion() {
  const result = transformMarkdown(state.inputText, state.currentLlm, state.currentEnv);
  state.outputText = result;
  outputTextarea.value = result;

  updateStats();
}

function updateStats() {
  const inChar = state.inputText.length;
  const inLines = state.inputText ? state.inputText.split('\n').length : 0;
  inputStats.textContent = `${inChar} characters | ${inLines} lines`;

  const outChar = state.outputText.length;
  const outLines = state.outputText ? state.outputText.split('\n').length : 0;
  outputStats.textContent = `${outChar} characters | ${outLines} lines`;
}

// Live Preview Renderer with Marked + KaTeX
function renderPreviewModal() {
  if (!state.outputText) {
    previewBody.innerHTML = '<p style="color: var(--text-muted);">No transformed markdown to preview yet.</p>';
    return;
  }

  // Parse Markdown with custom KaTeX math rendering replacement
  let textToRender = state.outputText;

  // Replace $$...$$ with block math placeholder
  const blockMaths = [];
  textToRender = textToRender.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
    try {
      const rendered = katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
      blockMaths.push(rendered);
      return `___BLOCK_MATH_${blockMaths.length - 1}___`;
    } catch (e) {
      return match;
    }
  });

  // Replace $...$ with inline math placeholder
  const inlineMaths = [];
  textToRender = textToRender.replace(/\$([^\$\n]+)\$/g, (match, math) => {
    try {
      const rendered = katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
      inlineMaths.push(rendered);
      return `___INLINE_MATH_${inlineMaths.length - 1}___`;
    } catch (e) {
      return match;
    }
  });

  // Render markdown with marked
  let html = marked.parse(textToRender);

  // Restore KaTeX rendered maths
  blockMaths.forEach((htmlMath, i) => {
    html = html.replace(`___BLOCK_MATH_${i}___`, htmlMath);
  });
  inlineMaths.forEach((htmlMath, i) => {
    html = html.replace(`___INLINE_MATH_${i}___`, htmlMath);
  });

  previewBody.innerHTML = html;
}

// Toast notification system
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// Interactive Canvas Background with dynamic moving particles
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2 + 1,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.5 + 0.2
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}
