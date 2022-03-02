import * as React from 'react';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

interface ModalProps extends React.PropsWithChildren<unknown> {
  isOpen: boolean;
  closeModal?: () => void;
}

export function Modal({ isOpen, children }: ModalProps) {
  useLockBodyScroll(isOpen);

  return (
    <div className={`fixed inset-0 ${isOpen ? '' : 'pointer-events-none'}`}>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-90' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        className={`fixed h-full shadow-lg overflow-y-auto w-full p-4 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
