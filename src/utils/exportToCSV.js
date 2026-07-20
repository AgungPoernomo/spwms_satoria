/**
 * Export data array to CSV file
 * @param {Array} data - Array of objects
 * @param {string} filename - File name without extension
 */
export function exportToCSV(data, filename = 'laporan') {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const val = row[header] ?? '';
        // Wrap in quotes if contains comma or newline
        return typeof val === 'string' && (val.includes(',') || val.includes('\n'))
          ? `"${val.replace(/"/g, '""')}"`
          : val;
      }).join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
