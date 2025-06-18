"use client";

import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { OnboardingData } from '@/lib/schemas';
import { Icons, PremiumButton, PremiumInput, PremiumTag } from './shared/DesignSystem';

export function HealthProfileStep() {
  const form = useFormContext<OnboardingData>();
  const [allergyInput, setAllergyInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');
  
  const [allergiesStatus, setAllergiesStatus] = useState<'input' | 'none' | 'pending'>('pending');
  const [conditionsStatus, setConditionsStatus] = useState<'input' | 'none' | 'pending'>('pending');
  const [medicationsStatus, setMedicationsStatus] = useState<'input' | 'none' | 'pending'>('pending');
  
  const allergies = form.watch('allergies') || [];
  const conditions = form.watch('conditions') || [];
  const medications = form.watch('medications') || [];

  const addAllergy = () => {
    if (allergyInput.trim()) {
      const newAllergies = [...allergies, { value: allergyInput.trim() }];
      form.setValue('allergies', newAllergies, { shouldValidate: true });
      setAllergyInput('');
    }
  };

  const addCondition = () => {
    if (conditionInput.trim()) {
      const newConditions = [...conditions, { value: conditionInput.trim() }];
      form.setValue('conditions', newConditions, { shouldValidate: true });
      setConditionInput('');
    }
  };

  const addMedication = () => {
    if (medicationInput.trim()) {
      const newMedications = [...medications, { value: medicationInput.trim() }];
      form.setValue('medications', newMedications, { shouldValidate: true });
      setMedicationInput('');
    }
  };

  const removeAllergy = (index: number) => {
    const newAllergies = allergies.filter((_, i) => i !== index);
    form.setValue('allergies', newAllergies, { shouldValidate: true });
  };

  const removeCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    form.setValue('conditions', newConditions, { shouldValidate: true });
  };

  const removeMedication = (index: number) => {
    const newMedications = medications.filter((_, i) => i !== index);
    form.setValue('medications', newMedications, { shouldValidate: true });
  };

  const setNoneAllergies = () => {
    setAllergiesStatus('none');
    form.setValue('allergies', [], { shouldValidate: true });
  };

  const setNoneConditions = () => {
    setConditionsStatus('none');
    form.setValue('conditions', [], { shouldValidate: true });
  };

  const setNoneMedications = () => {
    setMedicationsStatus('none');
    form.setValue('medications', [], { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      {/* Allergies Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Allergies?</h3>
          <PremiumButton
            onClick={setNoneAllergies}
            variant={allergiesStatus === 'none' ? 'success' : 'secondary'}
            size="sm"
            selected={allergiesStatus === 'none'}
          >
            None
          </PremiumButton>
        </div>
        
        {allergiesStatus !== 'none' && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <PremiumInput
                  value={allergyInput}
                  onChange={(value) => {
                    setAllergyInput(value);
                    if (allergiesStatus === 'pending') setAllergiesStatus('input');
                  }}
                  placeholder="e.g., shellfish, nuts, dairy"
                  onEnter={addAllergy}
                />
              </div>
              <PremiumButton
                onClick={addAllergy}
                variant="success"
                size="sm"
                icon={<Icons.Plus />}
              >
                Add
              </PremiumButton>
            </div>
            
            {allergies.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {allergies.map((allergy, index) => (
                  <PremiumTag 
                    key={index}
                    onRemove={() => removeAllergy(index)}
                    color="red"
                  >
                    {allergy.value}
                  </PremiumTag>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Medical Conditions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Medical conditions?</h3>
          <PremiumButton
            onClick={setNoneConditions}
            variant={conditionsStatus === 'none' ? 'success' : 'secondary'}
            size="sm"
            selected={conditionsStatus === 'none'}
          >
            None
          </PremiumButton>
        </div>
        
        {conditionsStatus !== 'none' && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <PremiumInput
                  value={conditionInput}
                  onChange={(value) => {
                    setConditionInput(value);
                    if (conditionsStatus === 'pending') setConditionsStatus('input');
                  }}
                  placeholder="e.g., diabetes, high blood pressure"
                  onEnter={addCondition}
                />
              </div>
              <PremiumButton
                onClick={addCondition}
                variant="success"
                size="sm"
                icon={<Icons.Plus />}
              >
                Add
              </PremiumButton>
            </div>
            
            {conditions.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {conditions.map((condition, index) => (
                  <PremiumTag 
                    key={index}
                    onRemove={() => removeCondition(index)}
                    color="orange"
                  >
                    {condition.value}
                  </PremiumTag>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Medications Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Current medications?</h3>
          <PremiumButton
            onClick={setNoneMedications}
            variant={medicationsStatus === 'none' ? 'success' : 'secondary'}
            size="sm"
            selected={medicationsStatus === 'none'}
          >
            None
          </PremiumButton>
        </div>
        
        {medicationsStatus !== 'none' && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <PremiumInput
                  value={medicationInput}
                  onChange={(value) => {
                    setMedicationInput(value);
                    if (medicationsStatus === 'pending') setMedicationsStatus('input');
                  }}
                  placeholder="e.g., metformin, lisinopril"
                  onEnter={addMedication}
                />
              </div>
              <PremiumButton
                onClick={addMedication}
                variant="success"
                size="sm"
                icon={<Icons.Plus />}
              >
                Add
              </PremiumButton>
            </div>
            
            {medications.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {medications.map((medication, index) => (
                  <PremiumTag 
                    key={index}
                    onRemove={() => removeMedication(index)}
                    color="blue"
                  >
                    {medication.value}
                  </PremiumTag>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Compact Safety Message */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
        <p className="text-blue-700 text-sm font-medium">
          ✓ This helps us avoid interactions and select safe supplements for you
        </p>
      </div>
    </div>
  );
} 