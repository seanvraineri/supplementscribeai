"use client";

import { useState } from 'react';
import { X } from 'lucide-react';

interface SymptomModalProps {
  isOpen: boolean;
  onClose: () => void;
  symptom: {
    name: string;
    icon: string;
    color: string;
    scale: string;
  } | null;
  onSubmit: (symptomName: string, value: number, notes: string) => Promise<void>;
  isLoading?: boolean;
}

export default function SymptomModal({ 
  isOpen, 
  onClose, 
  symptom, 
  onSubmit, 
  isLoading = false 
}: SymptomModalProps) {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !symptom) return null;

  const handleSubmit = async () => {
    if (selectedValue === null) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(symptom.name, selectedValue, notes);
      // Reset form
      setSelectedValue(null);
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Error submitting symptom:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedValue(null);
    setNotes('');
    onClose();
  };

  const getValueDescription = (value: number) => {
    const descriptions = {
      1: 'Very Poor',
      2: 'Poor', 
      3: 'Below Average',
      4: 'Fair',
      5: 'Average',
      6: 'Above Average',
      7: 'Good',
      8: 'Very Good',
      9: 'Excellent',
      10: 'Perfect'
    };
    return descriptions[value as keyof typeof descriptions] || '';
  };

  const getColorForValue = (value: number) => {
    if (value <= 3) return 'text-red-600 bg-red-100';
    if (value <= 5) return 'text-orange-600 bg-orange-100';
    if (value <= 7) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{symptom.icon}</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{symptom.name}</h2>
              <p className="text-sm text-gray-600">Rate from {symptom.scale}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rating Scale */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you rate your {symptom.name.toLowerCase()} today?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => setSelectedValue(value)}
                  className={`aspect-square rounded-xl border-2 font-bold text-lg transition-all duration-200 ${
                    selectedValue === value
                      ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-110'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            
            {/* Value Description */}
            {selectedValue && (
              <div className="mt-3 text-center">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getColorForValue(selectedValue)}`}>
                  {getValueDescription(selectedValue)}
                </span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details about your symptoms..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedValue === null || isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              'Log Symptom'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 