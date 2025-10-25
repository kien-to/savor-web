'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

interface StoreInfo {
  id: string;
  title: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface StoreOwnerState {
  isStoreOwnerMode: boolean;
  hasStore: boolean;
  storeInfo: StoreInfo | null;
  isLoading: boolean;
}

interface StoreOwnerContextType extends StoreOwnerState {
  toggleStoreOwnerMode: () => void;
  checkStoreOwnership: () => Promise<void>;
  refreshStoreInfo: () => Promise<void>;
}

const StoreOwnerContext = createContext<StoreOwnerContextType | undefined>(undefined);

export function StoreOwnerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreOwnerState>({
    isStoreOwnerMode: false,
    hasStore: false,
    storeInfo: null,
    isLoading: true,
  });

  // Initialize store owner state from localStorage
  useEffect(() => {
    const initializeStoreOwnerState = async () => {
      try {
        // Auto-enable store owner mode for testing
        setState(prev => ({
          ...prev,
          isStoreOwnerMode: true,
          isLoading: false,
        }));
        
        // Check if user has a store
        await checkStoreOwnership();
      } catch (error) {
        console.error('Error initializing store owner state:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeStoreOwnerState();
  }, []);

  const toggleStoreOwnerMode = async () => {
    const newMode = !state.isStoreOwnerMode;
    localStorage.setItem('isStoreOwnerMode', newMode.toString());
    setState(prev => ({ ...prev, isStoreOwnerMode: newMode }));
  };

  const checkStoreOwnership = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // TODO: Implement API call to check store ownership
      // For now, using mock data for testing
      const mockStoreInfo: StoreInfo = {
        id: '1',
        title: 'Test Store',
        type: 'restaurant',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country',
        phone: '+1-555-0123',
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      };
      
      setState(prev => ({
        ...prev,
        hasStore: true,
        storeInfo: mockStoreInfo,
        isLoading: false,
      }));
    } catch (error) {
      console.log('User does not have a store or error fetching store info:', error);
      // For testing, always simulate having a store
      const mockStoreInfo: StoreInfo = {
        id: '1',
        title: 'Test Store',
        type: 'restaurant',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country',
        phone: '+1-555-0123',
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      };
      setState(prev => ({
        ...prev,
        hasStore: true,
        storeInfo: mockStoreInfo,
        isLoading: false,
      }));
    }
  };

  const refreshStoreInfo = async () => {
    await checkStoreOwnership();
  };

  return (
    <StoreOwnerContext.Provider
      value={{
        ...state,
        toggleStoreOwnerMode,
        checkStoreOwnership,
        refreshStoreInfo,
      }}
    >
      {children}
    </StoreOwnerContext.Provider>
  );
}

export function useStoreOwner() {
  const context = useContext(StoreOwnerContext);
  if (context === undefined) {
    throw new Error('useStoreOwner must be used within a StoreOwnerProvider');
  }
  return context;
}
