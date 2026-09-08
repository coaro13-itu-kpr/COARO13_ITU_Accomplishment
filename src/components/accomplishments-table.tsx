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

const CATEGORIES: { [key: string]: string[] } = {
  'Technical Services': [
    'Technical Review and Inspection',
    'Property Appraisal',
    'Submission of Annual Audit Reports for Publication',
    'Submission of Compliance Audit Reports for Publication',
    'Submission of SALN of all COA Caraga Personnel',
    'Other Technical Audit Activities',
  ],
  'General Administration and Support': [
    'Assistance in defining IT specifications',
    'Server Administration and Maintenance',
    'Network Administration and Maintenance',
    'Voice over Internet Protocol (VoIP) installation/configuration, administration and maintenance',
    'Internet configuration, connection and other technical assistance related to internet',
    'Database backup',
    'Biometric Machine Maintenance and System Administration',
    'Troubleshooting - Network Printing Problems',
    'Troubleshooting - Microsoft Office Problems',
    'Troubleshooting - Computer Virus Problems',
    'Troubleshooting - Operating System Problems',
    'Troubleshooting - Access Point Problems',
    'Troubleshooting - Local Area Network Problems',
    'Troubleshooting - CAMS Problems',
    'Troubleshooting - VoIP Problems',
    'Troubleshooting - Internet Connectivity Problems',
    'Troubleshooting - Daily Time Record Updating',
    'Troubleshooting - Initial Setup of New Desktop/Laptop',
    'Troubleshooting - Cashier System (WINACIC DISC System) Problems',
    'Troubleshooting - Issues with Developed Information Systems',
    'Website Content Management',
    'Walk-in client queries',
    'Others',
  ],
  'eNGAS and eBudget': [
    'eNGAS and eBudget Support',
    'eNGAS and eBudget Roll-out',
  ],
  'Support during Meetings/Events': [
    'Setup Audio/Visual/Zoom Meetings',
  ],
  'Other Activities/Special Assignments': [
    'Resource Person/Assistant RPs for eNGAS and eBudget Functional Training and Other IT Trainings',
  ],
};

function getMainCategory(subCategory: string): string {
  for (const [mainCat, subCats] of Object.entries(CATEGORIES)) {
    if (subCats.includes(subCategory)) {
      return mainCat;
    }
  }
  return '';
}

export function AccomplishmentsTable({ accomplishments, onDelete }: AccomplishmentsTableProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filterStaff, setFilterStaff] = useState('');
  const [filterMainCategory, setFilterMainCategory] = useState('');
  const [filterSubCategory, setFilterSubCategory] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const uniqueStaff = [...new Set(accomplishments.map((a) => a.staff_name))].sort();
  const mainCategories = Object.keys(CATEGORIES);
  const subCategories = filterMainCategory ? CATEGORIES[filterMainCategory] : [];
  const uniqueSubCategories = [...new Set(accomplishments.map((a) => a.category))].sort();

  const [filterSearch, setFilterSearch] = useState('');

  const filtered = accomplishments.filter((a) => {
    if (filterStaff && a.staff_name !== filterStaff) return false;
    if (filterMainCategory && getMainCategory(a.category) !== filterMainCategory) return false;
    if (filterSubCategory && a.category !== filterSubCategory) return false;
    if (filterDateFrom && a.accomplishment_date < filterDateFrom) return false;
    if (filterDateTo && a.accomplishment_date > filterDateTo) return false;
    if (filterSearch) {
      const searchLower = filterSearch.toLowerCase();
      if (!a.description.toLowerCase().includes(searchLower) &&
          !a.staff_name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
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
      <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by description or staff name..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

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
              value={filterMainCategory}
              onChange={(e) => {
                setFilterMainCategory(e.target.value);
                setFilterSubCategory('');
              }}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All categories</option>
              {mainCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Sub-Category</label>
            <select
              value={filterSubCategory}
              onChange={(e) => setFilterSubCategory(e.target.value)}
              disabled={!filterMainCategory}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
            >
              <option value="">All sub-categories</option>
              {subCategories.map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
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
        </div>

        {(filterSearch || filterStaff || filterMainCategory || filterSubCategory || filterDateFrom || filterDateTo) && (
          <div className="flex justify-end">
            <button
              onClick={() => {
                setFilterSearch('');
                setFilterStaff('');
                setFilterMainCategory('');
                setFilterSubCategory('');
                setFilterDateFrom('');
                setFilterDateTo('');
              }}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-1 px-4 rounded text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
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
                  Sub-Category
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
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">
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
                    <td className="px-4 py-3 text-sm text-slate-600">{getMainCategory(a.category)}</td>
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
