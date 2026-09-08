'use client';

import { FormEvent, useState } from 'react';

interface AccomplishmentFormProps {
  user: any;
  staffName: string;
  categories: { [key: string]: string[] };
  onSubmit: (data: any[]) => Promise<void>;
}

export function AccomplishmentForm({ user, staffName, categories, onSubmit }: AccomplishmentFormProps) {
  const categoryKeys = Object.keys(categories);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mainCategory, setMainCategory] = useState(categoryKeys[0]);
  const [subCategory, setSubCategory] = useState(categories[categoryKeys[0]][0]);
  const [description, setDescription] = useState('');
  const [supervisedByEfren, setSupervisedByEfren] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  function handleMainCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const category = e.target.value;
    setMainCategory(category);
    setSubCategory(categories[category][0]);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!staffName.trim() || !description.trim() || !subCategory) {
      setSubmitMessage('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setSubmitMessage('');

    try {
      const entries = [
        {
          staff_name: staffName.trim(),
          accomplishment_date: date,
          category: subCategory,
          description: description.trim(),
        },
      ];

      if (supervisedByEfren) {
        entries.push({
          staff_name: 'Efren L. Soliva',
          accomplishment_date: date,
          category: subCategory,
          description: `[Supervised] ${description.trim()}`,
        });
      }

      await onSubmit(entries);

      setDate(new Date().toISOString().split('T')[0]);
      setMainCategory(categoryKeys[0]);
      setSubCategory(categories[categoryKeys[0]][0]);
      setDescription('');
      setSupervisedByEfren(false);
      setSubmitMessage('Accomplishment logged successfully');
      setTimeout(() => setSubmitMessage(''), 3000);
    } catch (err) {
      setSubmitMessage('Failed to log accomplishment');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Log a New Accomplishment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Staff Name
            </label>
            <input
              type="text"
              value={staffName}
              readOnly
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={submitting}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={mainCategory}
              onChange={handleMainCategoryChange}
              disabled={submitting}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
            >
              {categoryKeys.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Sub-Category</label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              disabled={submitting}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
            >
              {categories[mainCategory].map((subCat) => (
                <option key={subCat} value={subCat}>
                  {subCat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            What was accomplished
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Deployed patch to resolve intermittent VPN issues; configured 3 new workstations for onboarding staff."
            disabled={submitting}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 font-sans"
          />
        </div>

        {staffName !== 'Efren L. Soliva' && (
          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              id="supervisedByEfren"
              checked={supervisedByEfren}
              onChange={(e) => setSupervisedByEfren(e.target.checked)}
              disabled={submitting}
              className="w-4 h-4 cursor-pointer"
            />
            <label htmlFor="supervisedByEfren" className="text-sm font-medium text-slate-700 cursor-pointer">
              Supervised by Efren L. Soliva
            </label>
            <span className="text-xs text-slate-500">
              (Also logs this accomplishment to Efren)
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            {submitting ? 'Logging...' : 'Log accomplishment'}
          </button>

          {submitMessage && (
            <span
              className={`text-sm ${
                submitMessage.includes('successfully')
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {submitMessage}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
