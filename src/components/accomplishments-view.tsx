'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { AccomplishmentForm } from './accomplishment-form';
import { AccomplishmentsTable } from './accomplishments-table';
import { ReportsPanel } from './reports-panel';
import { SignOutButton } from './sign-out-button';

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

const STAFF_NAMES: { [key: string]: string } = {
  '0283363': 'Keith P. Rabina',
  '0229296': 'Efren L. Soliva',
};

function getStaffName(user: any): string {
  const email = user?.email || '';
  const employeeId = email.split('@')[0];
  return STAFF_NAMES[employeeId] || user?.user_metadata?.full_name || email;
}

interface Accomplishment {
  id: string;
  staff_name: string;
  accomplishment_date: string;
  category: string;
  description: string;
  created_at: string;
  user_id: string;
}

export default function AccomplishmentsView({ user }: { user: any }) {
  const supabase = createClient();
  const [accomplishments, setAccomplishments] = useState<Accomplishment[]>([]);
  const [activeTab, setActiveTab] = useState<'log' | 'entries' | 'reports'>('log');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAccomplishments();

    const channel = supabase
      .channel('accomplishments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'accomplishments',
        },
        (payload) => {
          loadAccomplishments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadAccomplishments() {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('accomplishments')
        .select('*')
        .order('accomplishment_date', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setAccomplishments(data || []);
    } catch (err) {
      setError('Failed to load accomplishments');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddAccomplishment(entries: Omit<Accomplishment, 'id' | 'user_id' | 'created_at'>[]) {
    try {
      setError(null);
      const insertData = entries.map((data) => ({
        ...data,
        user_id: user.id,
      }));

      const { error: insertError } = await supabase.from('accomplishments').insert(insertData);

      if (insertError) {
        setError(insertError.message);
        return;
      }

      await loadAccomplishments();
      setActiveTab('entries');
    } catch (err) {
      setError('Failed to add accomplishment');
    }
  }

  async function handleDeleteAccomplishment(id: string) {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('accomplishments')
        .delete()
        .eq('id', id);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }

      await loadAccomplishments();
    } catch (err) {
      setError('Failed to delete accomplishment');
    }
  }

  async function handleUpdateAccomplishment(id: string, data: Omit<Accomplishment, 'id' | 'user_id' | 'created_at'>) {
    try {
      setError(null);
      const { error: updateError } = await supabase
        .from('accomplishments')
        .update(data)
        .eq('id', id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      await loadAccomplishments();
    } catch (err) {
      setError('Failed to update accomplishment');
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              Commission on Audit • Regional Office No. XIII
            </p>
            <h1 className="text-2xl font-bold text-slate-900">IT Unit Ledger</h1>
            <p className="text-sm text-slate-600 mt-1">
              Shared accomplishment log • Every entry rolls up into the unit's reports
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">{user.id}</p>
            </div>
            <SignOutButton />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-slate-200 px-6">
          <nav className="flex gap-8 max-w-6xl mx-auto">
            <button
              onClick={() => setActiveTab('log')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'log'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Log Entry
            </button>
            <button
              onClick={() => setActiveTab('entries')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'entries'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              All Entries
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reports'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Reports
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-slate-600">Loading...</div>
          </div>
        ) : (
          <>
            {activeTab === 'log' && (
              <AccomplishmentForm
                user={user}
                staffName={getStaffName(user)}
                categories={CATEGORIES}
                onSubmit={handleAddAccomplishment}
              />
            )}

            {activeTab === 'entries' && (
              <AccomplishmentsTable
                accomplishments={accomplishments}
                onDelete={handleDeleteAccomplishment}
                onUpdate={handleUpdateAccomplishment}
                categories={CATEGORIES}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsPanel accomplishments={accomplishments} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
