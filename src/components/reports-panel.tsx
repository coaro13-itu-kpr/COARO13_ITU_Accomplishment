'use client';

import { useState } from 'react';

interface Accomplishment {
  id: string;
  staff_name: string;
  accomplishment_date: string;
  category: string;
  description: string;
  created_at: string;
}

interface ReportsPanelProps {
  accomplishments: Accomplishment[];
}

type PeriodType = 'week' | 'month' | 'quarter' | 'year';

export function ReportsPanel({ accomplishments }: ReportsPanelProps) {
  const [periodType, setPeriodType] = useState<PeriodType>('month');
  const [periodDate, setPeriodDate] = useState(new Date());

  function getPeriodRange(type: PeriodType, date: Date) {
    const d = new Date(date);
    let start, end;

    if (type === 'week') {
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      start = new Date(d.setDate(diff));
      end = new Date(new Date(start).setDate(start.getDate() + 6));
    } else if (type === 'month') {
      start = new Date(d.getFullYear(), d.getMonth(), 1);
      end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    } else if (type === 'quarter') {
      const q = Math.floor(d.getMonth() / 3);
      start = new Date(d.getFullYear(), q * 3, 1);
      end = new Date(d.getFullYear(), q * 3 + 3, 0);
    } else {
      start = new Date(d.getFullYear(), 0, 1);
      end = new Date(d.getFullYear(), 11, 31);
    }

    return [start.toISOString().split('T')[0], end.toISOString().split('T')[0]];
  }

  function getPeriodLabel(type: PeriodType, date: Date) {
    const [start] = getPeriodRange(type, date);
    const d = new Date(start);

    if (type === 'week') {
      const end = new Date(d);
      end.setDate(end.getDate() + 6);
      return `Week of ${d.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    } else if (type === 'month') {
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (type === 'quarter') {
      const q = Math.floor(d.getMonth() / 3) + 1;
      return `Q${q} ${d.getFullYear()}`;
    } else {
      return String(d.getFullYear());
    }
  }

  const [start, end] = getPeriodRange(periodType, periodDate);
  const periodAccomplishments = accomplishments.filter(
    (a) => a.accomplishment_date >= start && a.accomplishment_date <= end
  );

  const staffCounts = periodAccomplishments.reduce(
    (acc, a) => {
      acc[a.staff_name] = (acc[a.staff_name] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const categoryCounts = periodAccomplishments.reduce(
    (acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const sortedStaff = Object.entries(staffCounts).sort((a, b) => b[1] - a[1]);
  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  const maxStaffCount = sortedStaff.length > 0 ? sortedStaff[0][1] : 1;
  const maxCategoryCount = sortedCategories.length > 0 ? sortedCategories[0][1] : 1;

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2">
            {(['week', 'month', 'quarter', 'year'] as PeriodType[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriodType(p)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  periodType === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const d = new Date(periodDate);
                if (periodType === 'week') d.setDate(d.getDate() - 7);
                else if (periodType === 'month') d.setMonth(d.getMonth() - 1);
                else if (periodType === 'quarter') d.setMonth(d.getMonth() - 3);
                else d.setFullYear(d.getFullYear() - 1);
                setPeriodDate(d);
              }}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded font-medium"
            >
              ←
            </button>

            <span className="text-sm font-semibold text-slate-900 min-w-[200px] text-center">
              {getPeriodLabel(periodType, periodDate)}
            </span>

            <button
              onClick={() => {
                const d = new Date(periodDate);
                if (periodType === 'week') d.setDate(d.getDate() + 7);
                else if (periodType === 'month') d.setMonth(d.getMonth() + 1);
                else if (periodType === 'quarter') d.setMonth(d.getMonth() + 3);
                else d.setFullYear(d.getFullYear() + 1);
                setPeriodDate(d);
              }}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded font-medium"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="text-3xl font-bold text-slate-900">{periodAccomplishments.length}</div>
          <div className="text-sm text-slate-600 mt-1">Entries logged</div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="text-3xl font-bold text-slate-900">{sortedStaff.length}</div>
          <div className="text-sm text-slate-600 mt-1">Staff who logged</div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="text-2xl font-bold text-slate-900">
            {sortedCategories.length > 0 ? sortedCategories[0][0] : '—'}
          </div>
          <div className="text-sm text-slate-600 mt-1">
            {sortedCategories.length > 0
              ? `${sortedCategories[0][1]} entries`
              : 'Busiest category'}
          </div>
        </div>
      </div>

      {/* By staff */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Accomplishments by Staff</h3>

        {sortedStaff.length === 0 ? (
          <p className="text-slate-500 text-sm">No entries in this period</p>
        ) : (
          <div className="space-y-3">
            {sortedStaff.map(([name, count]) => (
              <div key={name} className="flex items-center gap-3">
                <div className="w-32 text-sm font-medium text-slate-700 truncate">{name}</div>
                <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${(count / maxStaffCount) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-right text-sm font-medium text-slate-700">{count}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* By category */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Accomplishments by Category</h3>

        {sortedCategories.length === 0 ? (
          <p className="text-slate-500 text-sm">No entries in this period</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 font-semibold text-slate-700">Category</th>
                  <th className="text-right py-2 px-3 font-semibold text-slate-700">Count</th>
                </tr>
              </thead>
              <tbody>
                {sortedCategories.map(([cat, count]) => (
                  <tr key={cat} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-3 text-slate-700">{cat}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-amber-600 h-full rounded-full"
                            style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                          />
                        </div>
                        <span className="font-medium text-slate-900 w-8 text-right">{count}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Export button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            const csv = [
              ['Date', 'Staff', 'Category', 'Description'].join(','),
              ...periodAccomplishments.map((a) =>
                [
                  a.accomplishment_date,
                  `"${a.staff_name}"`,
                  `"${a.category}"`,
                  `"${a.description.replace(/"/g, '""')}"`,
                ].join(',')
              ),
            ].join('\n');

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `it-unit-accomplishments-${getPeriodLabel(periodType, periodDate)
              .replace(/\s+/g, '-')
              .toLowerCase()}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Export as CSV
        </button>
      </div>
    </div>
  );
}
