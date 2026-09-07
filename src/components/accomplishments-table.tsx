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

interface AccomplishmentsTableProps {
  accomplishments: Accomplishment[];
  onDelete: (id: string) => Promise<void>;
}

export function AccomplishmentsTable({ accomplishments, onDelete }: AccomplishmentsTableProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filterStaff, setFilterStaff] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const uniqueStaff = [...new Set(accomplishments.map((a) => a.staff_name))].sort();
  const uniqueCategories = [...new Set(accomplishments.map((a) => a.category))].sort();

  const filtered = accomplishments.filter((a) => {
    if (filterStaff && a.staff_name !== filterStaff) return false;
    if (filterCategory && a.category !== filterCategory) return false;
    if (filterDateFrom && a.accomplishment_date < filterDateFrom) return false;
    if (filterDateTo && a.accomplishment_date > filterDateTo) return false;
    return true;
  });

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      await onDelete(id);
      setConfirmDeleteId(null);
    } finally {
      setDeleting(false);
    }
  }

  if (accomplishments.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <p className="text-slate-600">No accomplishments logged yet</p>
        <p className="text-sm text-slate-500 mt-2">
          Head to Log Entry to record the first item
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Staff</label>
            <select
              value={filterStaff}
              onChange={(e) => setFilterStaff(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All staff</option>
              {uniqueStaff.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All categories</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">From</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">To</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {(filterStaff || filterCategory || filterDateFrom || filterDateTo) && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStaff('');
                  setFilterCategory('');
                  setFilterDateFrom('');
                  setFilterDateTo('');
                }}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-1 px-3 rounded text-sm"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Staff</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                  Description
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-sm">
                    No entries match these filters
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                      {a.accomplishment_date}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {a.staff_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{a.category}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 max-w-xs truncate">
                      {a.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {confirmDeleteId === a.id ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleDelete(a.id)}
                            disabled={deleting}
                            className="text-red-600 hover:text-red-700 disabled:text-slate-400 font-medium text-xs"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={deleting}
                            className="text-slate-600 hover:text-slate-700 disabled:text-slate-400 font-medium text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(a.id)}
                          className="text-red-600 hover:text-red-700 font-medium text-xs"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-500 text-center">
        Showing {filtered.length} of {accomplishments.length} entries
      </p>
    </div>
  );
}
