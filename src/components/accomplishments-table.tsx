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
  onUpdate: (id: string, data: Omit<Accomplishment, 'id' | 'created_at' | 'user_id'>, supervised?: boolean) => Promise<void>;
  categories: { [key: string]: string[] };
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

export function AccomplishmentsTable({ accomplishments, onDelete, onUpdate, categories }: AccomplishmentsTableProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
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

  function handleEditClick(accomplishment: Accomplishment) {
    const mainCat = getMainCategory(accomplishment.category);

    let supervisedByEfren = false;
    let descriptionForEdit = accomplishment.description;

    if (accomplishment.staff_name !== 'Efren L. Soliva') {
      const efrenEntry = accomplishments.find(
        (a) =>
          a.staff_name === 'Efren L. Soliva' &&
          a.accomplishment_date === accomplishment.accomplishment_date &&
          a.category === accomplishment.category &&
          a.description.startsWith('[Supervised]')
      );
      supervisedByEfren = !!efrenEntry;
    }

    setEditingId(accomplishment.id);
    setEditingData({
      accomplishment_date: accomplishment.accomplishment_date,
      mainCategory: mainCat,
      category: accomplishment.category,
      description: accomplishment.description,
      staff_name: accomplishment.staff_name,
      supervisedByEfren: supervisedByEfren,
    });
  }

  async function handleEditSubmit() {
    if (!editingData.description.trim() || !editingData.category) {
      return;
    }

    try {
      await onUpdate(
        editingId!,
        {
          staff_name: editingData.staff_name,
          accomplishment_date: editingData.accomplishment_date,
          category: editingData.category,
          description: editingData.description.trim(),
        },
        editingData.supervisedByEfren
      );
      setEditingId(null);
      setEditingData(null);
    } catch (err) {
      console.error('Failed to update accomplishment', err);
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
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEditClick(a)}
                            className="text-blue-600 hover:text-blue-700 font-medium text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(a.id)}
                            className="text-red-600 hover:text-red-700 font-medium text-xs"
                          >
                            Delete
                          </button>
                        </div>
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

      {/* Edit Modal */}
      {editingId && editingData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-200 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Edit Accomplishment</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editingData.accomplishment_date}
                    onChange={(e) =>
                      setEditingData({ ...editingData, accomplishment_date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Staff Name
                  </label>
                  <input
                    type="text"
                    value={editingData.staff_name}
                    disabled
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editingData.mainCategory}
                    onChange={(e) => {
                      const mainCat = e.target.value;
                      setEditingData({
                        ...editingData,
                        mainCategory: mainCat,
                        category: categories[mainCat][0],
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.keys(categories).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Sub-Category
                  </label>
                  <select
                    value={editingData.category}
                    onChange={(e) =>
                      setEditingData({ ...editingData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories[editingData.mainCategory].map((subCat) => (
                      <option key={subCat} value={subCat}>
                        {subCat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingData.description}
                  onChange={(e) =>
                    setEditingData({ ...editingData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                />
              </div>

              {editingData.staff_name !== 'Efren L. Soliva' && (
                <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    id="editSupervisedByEfren"
                    checked={editingData.supervisedByEfren || false}
                    onChange={(e) =>
                      setEditingData({ ...editingData, supervisedByEfren: e.target.checked })
                    }
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label
                    htmlFor="editSupervisedByEfren"
                    className="text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    Supervised by Efren L. Soliva
                  </label>
                  <span className="text-xs text-slate-500">
                    (Also logs this accomplishment to Efren)
                  </span>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditingData(null);
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
