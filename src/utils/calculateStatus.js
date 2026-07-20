/**
 * Auto-calculate spare part status based on stock levels
 * @param {number} stokSaatIni - Current stock
 * @param {number} stokMinimum - Minimum stock threshold
 * @param {number} stokMaksimum - Maximum stock threshold
 * @returns {'Kritis' | 'Normal' | 'Berlebih'}
 */
export function calculateStatus(stokSaatIni, stokMinimum, stokMaksimum) {
  if (stokSaatIni <= stokMinimum) return 'Kritis';
  if (stokSaatIni >= stokMaksimum) return 'Berlebih';
  return 'Normal';
}
