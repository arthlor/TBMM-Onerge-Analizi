import { create } from 'zustand';
import { ParliamentaryQuestion, MinistryPerformance } from '@/types/parliamentaryQuestions.types';

interface ParliamentaryQuestionsState {
  data: ParliamentaryQuestion[];
  filteredData: ParliamentaryQuestion[];
  selectedMinistry: string | null;
  sortBy: 'total' | 'timelyRate' | 'name';
  sortOrder: 'asc' | 'desc';
  searchTerm: string;
  selectedResponseTypes: string[];
  
  // Actions
  setData: (data: ParliamentaryQuestion[]) => void;
  setSelectedMinistry: (ministry: string | null) => void;
  setSortBy: (sortBy: 'total' | 'timelyRate' | 'name') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setSearchTerm: (term: string) => void;
  setSelectedResponseTypes: (types: string[]) => void;
  
  // Computed values
  getMinistryPerformance: () => MinistryPerformance[];
  getOverallStats: () => {
    totalQuestions: number;
    timelyResponseRate: number;
    lateResponseRate: number;
    unansweredRate: number;
    inProgressRate: number;
    withdrawnRate: number;
  };
}

export const useParliamentaryQuestionsStore = create<ParliamentaryQuestionsState>((set, get) => ({
  data: [],
  filteredData: [],
  selectedMinistry: null,
  sortBy: 'total',
  sortOrder: 'desc',
  searchTerm: '',
  selectedResponseTypes: [],
  
  setData: (data) => {
    set({ data, filteredData: data });
  },
  
  setSelectedMinistry: (ministry) => {
    set({ selectedMinistry: ministry });
  },
  
  setSortBy: (sortBy) => {
    set({ sortBy });
  },
  
  setSortOrder: (order) => {
    set({ sortOrder: order });
  },
  
  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },
  
  setSelectedResponseTypes: (types) => {
    set({ selectedResponseTypes: types });
  },
  
  getMinistryPerformance: () => {
    const { data } = get();
    return data
      .filter((item) => item.muhatap !== 'Toplam')
      .map((item) => {
        const total = item.toplam || 0;
        const timelyRate = total > 0 ? (item.suresiIcindeCevaplanan / total) * 100 : 0;
        const lateRate = total > 0 ? (item.suresiGectiktenSonraCevaplanan / total) * 100 : 0;
        const unansweredRate = total > 0 ? (item.cevaplanmadigiGelenKagitlardaIlanEdilen / total) * 100 : 0;
        const inProgressRate = total > 0 ? (item.cevaplanmaSuresiDevamEden / total) * 100 : 0;
        const withdrawnRate = total > 0 ? (item.geriAlinan / total) * 100 : 0;
        
        return {
          name: item.muhatap,
          totalQuestions: item.toplam,
          timelyResponseRate: timelyRate,
          lateResponseRate: lateRate,
          unansweredRate: unansweredRate,
          inProgressRate: inProgressRate,
          withdrawnRate: withdrawnRate,
          performanceScore: timelyRate * 0.6 + (100 - unansweredRate) * 0.4,
          suresiIcindeCevaplanan: item.suresiIcindeCevaplanan,
          suresiGectiktenSonraCevaplanan: item.suresiGectiktenSonraCevaplanan,
          cevaplanmaSuresiDevamEden: item.cevaplanmaSuresiDevamEden,
        };
      });
  },
  
  getOverallStats: () => {
    const { data } = get();
    const totalRow = data.find((item) => item.muhatap === 'Toplam');
    
    if (!totalRow) {
      return {
        totalQuestions: 0,
        timelyResponseRate: 0,
        lateResponseRate: 0,
        unansweredRate: 0,
        inProgressRate: 0,
        withdrawnRate: 0,
      };
    }
    
    // Handle division by zero
    const total = totalRow.toplam || 0;
    
    return {
      totalQuestions: totalRow.toplam,
      timelyResponseRate: total > 0 ? (totalRow.suresiIcindeCevaplanan / total) * 100 : 0,
      lateResponseRate: total > 0 ? (totalRow.suresiGectiktenSonraCevaplanan / total) * 100 : 0,
      unansweredRate: total > 0 ? (totalRow.cevaplanmadigiGelenKagitlardaIlanEdilen / total) * 100 : 0,
      inProgressRate: total > 0 ? (totalRow.cevaplanmaSuresiDevamEden / total) * 100 : 0,
      withdrawnRate: total > 0 ? (totalRow.geriAlinan / total) * 100 : 0,
    };
  },
})); 