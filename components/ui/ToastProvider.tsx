'use client';

import * as React from 'react';
import { useToast as useToastInternal } from './use-toast';

export const ToastContext = React.createContext<ReturnType<typeof useToastInternal> | undefined>(
  undefined,
);

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const toast = useToastInternal();

  return <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>;
}
