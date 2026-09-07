interface Accomplishment {
  id: string;
  staff_name: string;
  accomplishment_date: string;
  category: string;
  description: string;
  created_at: string;
}

export function generateExcelReport(
  accomplishments: Accomplishment[],
  periodLabel: string,
  periodType: 'week' | 'month' | 'quarter' | 'year'
) {
  // Calculate summary statistics
  const staffCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};

  accomplishments.forEach((a) => {
    staffCounts[a.staff_name] = (staffCounts[a.staff_name] || 0) + 1;
    categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
  });

  // Create CSV content for Excel
  const lines: string[] = [];

  // Title and metadata
  lines.push('COMMISSION ON AUDIT - REGIONAL OFFICE NO. XIII');
  lines.push('IT UNIT ACCOMPLISHMENT REPORT');
  lines.push('');
  lines.push(`Report Period: ${periodLabel}`);
  lines.push(`Generated: ${new Date().toLocaleDateString()}`);
  lines.push('');

  // Summary statistics
  lines.push('SUMMARY STATISTICS');
  lines.push('Total Entries,' + accomplishments.length);
  lines.push('Staff Members,' + Object.keys(staffCounts).length);
  lines.push('Activity Categories,' + Object.keys(categoryCounts).length);
  lines.push('');

  // Staff breakdown
  lines.push('ACCOMPLISHMENTS BY STAFF');
  lines.push('Staff Name,Number of Entries');
  Object.entries(staffCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([staff, count]) => {
      lines.push(`"${staff}",${count}`);
    });
  lines.push('');

  // Category breakdown
  lines.push('ACCOMPLISHMENTS BY CATEGORY');
  lines.push('Category,Number of Entries');
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      lines.push(`"${category}",${count}`);
    });
  lines.push('');

  // Detailed accomplishments
  lines.push('DETAILED ACCOMPLISHMENTS');
  lines.push('Date,Staff Name,Category,Description');
  accomplishments
    .sort((a, b) => new Date(b.accomplishment_date).getTime() - new Date(a.accomplishment_date).getTime())
    .forEach((a) => {
      lines.push([
        a.accomplishment_date,
        `"${a.staff_name}"`,
        `"${a.category}"`,
        `"${a.description.replace(/"/g, '""')}"`,
      ].join(','));
    });

  return lines.join('\n');
}

export function downloadExcelReport(
  csvContent: string,
  periodLabel: string,
  periodType: 'week' | 'month' | 'quarter' | 'year'
) {
  const fileName = `IT-Unit-Accomplishments-${periodLabel.replace(/\s+/g, '-').toLowerCase()}.csv`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
