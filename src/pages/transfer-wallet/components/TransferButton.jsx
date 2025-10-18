import React, { useState } from 'react';
import { Building2, X, Send } from 'lucide-react';

const TransferFormDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm] = useState('');
  const [filters] = useState({});

  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    alert('Transfer submitted successfully!');
    setIsModalOpen(false);
  };

  return (
    <div className="max-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Modal Trigger Button Row */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Send size={20} />
            Transfer
          </button>
        </div>

        {/* Transactions Table */}
        <TransactionsTable
          searchTerm={searchTerm}
          filters={filters}
        />
      </div>

      {/* Transfer Modal */}
      {isModalOpen && <TransferModal onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />}
    </div>
  );
};

// export default TransferFormDemo;