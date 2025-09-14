
import React from 'react';
import { WarningIcon } from './icons/Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contactsCount: number;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, contactsCount, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
              <WarningIcon />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-gray-100" id="modal-title">
                Confirmar Envio
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Você está prestes a enviar uma mensagem para <strong>{contactsCount}</strong> contato(s).
                </p>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Prévia da Mensagem:</p>
                <blockquote className="mt-1 p-3 bg-gray-50 dark:bg-gray-700/50 border-l-4 border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {message}
                </blockquote>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 text-sm font-medium text-white border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Confirmar Envio
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
