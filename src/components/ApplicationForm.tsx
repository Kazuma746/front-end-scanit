'use client';

import { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import { Application, CreateApplicationData, UpdateApplicationData } from '@/types/application';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateApplicationData | UpdateApplicationData) => Promise<void>;
  application?: Application | null;
  cvOptions: Array<{ _id: string; name: string; }>;
  isLoading?: boolean;
}

const ApplicationForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  application, 
  cvOptions,
  isLoading = false 
}: ApplicationFormProps) => {
  const [formData, setFormData] = useState<{
    cvId: string;
    companyName: string;
    jobTitle: string;
    status: 'pending' | 'interview' | 'rejected' | 'accepted';
    comments: string;
    applicationDate: string;
  }>({
    cvId: '',
    companyName: '',
    jobTitle: '',
    status: 'pending',
    comments: '',
    applicationDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (application) {
      // Mode édition
      setFormData({
        cvId: application.cvId._id,
        companyName: application.companyName,
        jobTitle: application.jobTitle || '',
        status: application.status,
        comments: application.comments || '',
        applicationDate: new Date(application.applicationDate).toISOString().split('T')[0]
      });
    } else {
      // Mode création - réinitialiser
      setFormData({
        cvId: '',
        companyName: '',
        jobTitle: '',
        status: 'pending',
        comments: '',
        applicationDate: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [application, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Le nom de l\'entreprise est requis';
    }

    if (!application && !formData.cvId) {
      newErrors.cvId = 'Veuillez sélectionner un CV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      const submitData = application 
        ? {
            companyName: formData.companyName,
            jobTitle: formData.jobTitle || undefined,
            status: formData.status,
            comments: formData.comments || undefined,
            applicationDate: formData.applicationDate
          }
        : {
            cvId: formData.cvId,
            companyName: formData.companyName,
            jobTitle: formData.jobTitle || undefined,
            status: formData.status,
            comments: formData.comments || undefined,
            applicationDate: formData.applicationDate
          };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'interview', label: 'Entretien' },
    { value: 'rejected', label: 'Refusé' },
    { value: 'accepted', label: 'Accepté' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {application ? 'Modifier la candidature' : 'Nouvelle candidature'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!application && (
            <div>
              <label htmlFor="cvId" className="block text-sm font-medium text-gray-700 mb-1">
                CV associé *
              </label>
              <select
                id="cvId"
                name="cvId"
                value={formData.cvId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.cvId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner un CV</option>
                {cvOptions.map(cv => (
                  <option key={cv._id} value={cv._id}>
                    {cv.name}
                  </option>
                ))}
              </select>
              {errors.cvId && <p className="text-red-500 text-sm mt-1">{errors.cvId}</p>}
            </div>
          )}

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'entreprise *
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.companyName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Google, Microsoft..."
            />
            {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
          </div>

          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Poste visé
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: Développeur Frontend, Chef de projet..."
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="applicationDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date de candidature
            </label>
            <input
              type="date"
              id="applicationDate"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
              Commentaires
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Notes, informations supplémentaires..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <FiSave size={16} />
              <span>{isLoading ? 'Enregistrement...' : 'Enregistrer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm; 