/**
 * Format ISO date string to locale date string (Indonesian)
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

/**
 * Format ISO timestamp to full date + time
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

/**
 * Returns today's date as YYYY-MM-DD string
 */
export function todayString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Generate a unique part code like SP-011
 */
export function generateKodePart(existingParts) {
  const maxId = existingParts.reduce((max, p) => {
    const num = parseInt(p.kode_part.replace('SP-', ''), 10);
    return num > max ? num : max;
  }, 0);
  return `SP-${String(maxId + 1).padStart(3, '0')}`;
}
