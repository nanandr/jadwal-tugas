'use client';
import { useState, FormEvent } from 'react';
import { PlusCircle } from 'lucide-react';

interface TaskFormProps {
  onTaskAdded: () => void; 
}

export default function TaskForm({ onTaskAdded }: TaskFormProps) {
  const [name, setName] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [attachmentLink, setAttachmentLink] = useState(''); 
  const [submitLink, setSubmitLink] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapse, setCollapse] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!name.trim() || !deadlineDate) {
      setError('Nama tugas dan tanggal deadline wajib diisi.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/tasks', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, deadlineDate, deadlineTime, attachmentLink, submitLink }), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menambah tugas');
      }

      setName('');
      setDeadlineDate('');
      setDeadlineTime('');
      setAttachmentLink(''); 
      setSubmitLink(''); 
      onTaskAdded(); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex flex-row flex-1 items-center align-middle">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex-1">Tambah Tugas Baru</h2>
        <button className='mr-auto p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700' type="button" onClick={() => setCollapse(!isCollapse)}><svg data-accordion-icon className={(isCollapse ? 'rotate-180 ' : '') + "w-3 h-3 shrink-0"} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
      </svg></button>
      </div>
      
      <div className={isCollapse ? 'hidden' : 'mt-6'}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}
        {/* Baris Pertama: Nama Tugas */}
        <div className="grid grid-cols-1 mb-4">
          <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nama Tugas
          </label>
          <input
            type="text"
            id="taskName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: UTS SDA"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        
        {/* Baris Kedua: Waktu Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className='md:col-span-2'>
            <label htmlFor="deadlineDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tanggal Deadline
            </label>
            <input
              type="date"
              id="deadlineDate"
              value={deadlineDate}
              onChange={(e) => setDeadlineDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="deadlineTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Waktu Deadline (Opsional)
            </label>
            <input
              type="time"
              id="deadlineTime"
              value={deadlineTime}
              onChange={(e) => setDeadlineTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Baris Ketiga: Link Lampiran  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"> {/* Grid diubah agar ada 2 kolom */}
          {        /* Input untuk Link Lampiran */}
          <div>
            <label htmlFor="attachmentLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Link Tugas (Opsional)
            </label>
            <input
              type="url"
              id="attachmentLink"
              value={attachmentLink}
              onChange={(e) => setAttachmentLink(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="submitLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Link Pengumpulan (Opsional)
            </label>
            <input
              type="url"
              id="submitLink"
              value={submitLink}
              onChange={(e) => setSubmitLink(e.target.value)}
              placeholder="https://spot.upi.edu/..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto flex items-center justify-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out disabled:opacity-50"
        >
          <PlusCircle size={20} className="mr-2" />
          {isLoading ? 'Menambahkan...' : 'Tambah Tugas'}
        </button>
      </div>
    </form>
  );
}