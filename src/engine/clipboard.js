/**
 * Clipboard Helper using modern browser navigator.clipboard API with fallbacks
 */

export async function readFromClipboard() {
  if (!navigator.clipboard || !navigator.clipboard.readText) {
    throw new Error('Clipboard API not supported in your browser or connection context (requires HTTPS or localhost).');
  }

  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (err) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      throw new Error('Clipboard access permission denied. Please grant clipboard permission to paste directly.');
    }
    throw new Error(`Failed to read clipboard: ${err.message || err}`);
  }
}

export async function copyToClipboard(text) {
  if (!text) return false;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.warn('Navigator clipboard write failed, falling back to execCommand', e);
    }
  }

  // Fallback
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    document.body.removeChild(textarea);
    return false;
  }
}
