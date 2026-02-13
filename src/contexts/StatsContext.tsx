// src/contexts/StatsContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface Stats {
  totalProjets: number;
  totalActualites: number;
  totalTemoignages: number;
  totalPartenaires: number;
  totalUtilisateurs: number;
  totalContacts: number;
  totalMissions: number;
}

interface StatsContextType {
  stats: Stats;
  updateStats: (newStats: Partial<Stats>) => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

const initialStats: Stats = {
  totalProjets: 0,
  totalActualites: 0,
  totalTemoignages: 0,
  totalPartenaires: 0,
  totalUtilisateurs: 0,
  totalContacts: 0,
  totalMissions: 0,
};

export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<Stats>(initialStats);

  const updateStats = (newStats: Partial<Stats>) => {
    setStats(prev => ({ ...prev, ...newStats }));
  };

  return (
    <StatsContext.Provider value={{ stats, updateStats }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}