'use client';

import { FormEvent, useState } from 'react';

interface AccomplishmentFormProps {
  user: any;
  categories: string[];
  onSubmit: (data: any) => Promise<void>;
}

export function AccomplishmentForm({ user, categories, onSubmit }: AccomplishmentFormProps) {
  const [staffName, setStaffName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!staffName.trim() || !description.trim()) {
      setSubmitMessage('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setSubmitMessage('');

    try {
      await onSubmit({
        staff_name: staffName.trim(),
        accomplishment_date: date,
        category,
        description: description.trim(),
      });

      setStaffName('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory(categories[0]);
      setDescription('');
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
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="e.g. Juan Dela Cruz"
              disabled={submitting}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={submitting}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
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
