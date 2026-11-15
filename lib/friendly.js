// Turns technical errors into plain words for the admin screen.

export function friendly(err) {
  const m = String((err && err.message) || err || '').toLowerCase();
  if (m.includes('quota') || m.includes('429') || m.includes('rate')) {
    return 'The AI is busy or its limit is reached. Please wait a few minutes and try again.';
  }
  if (m.includes('abort') || m.includes('timeout')) {
    return 'The AI took too long. Please try again.';
  }
  if (m.includes('did not return')) {
    return 'The AI could not make this picture. Please try again, or use clearer photos.';
  }
  if (m.includes('api key') || m.includes('permission') || m.includes('billing') ||
      m.includes('gemini_api_key') || m.includes('not found') || m.includes('403') || m.includes('404')) {
    return 'The AI tool is not set up correctly. Please tell your website helper and check the Health page.';
  }
  return 'Something went wrong. Nothing was lost. Please try again.';
}
