import React from 'react';
import StatsCard from './StatsCard';
import { useParliamentaryQuestionsStore } from '@/store/parliamentaryQuestionsStore';
import './OverallStats.css';

const OverallStats: React.FC = () => {
  const getOverallStats = useParliamentaryQuestionsStore((state: any) => state.getOverallStats);
  const stats = getOverallStats();

  return (
    <div className="overall-stats">
      <div className="stats-container">
        <StatsCard
          title="Toplam Soru"
          value={stats.totalQuestions.toLocaleString()}
          color="total"
        />
        <StatsCard
          title="Zamanında Cevaplanma"
          value={`${stats.timelyResponseRate.toFixed(1)}%`}
          subtitle={`${((stats.timelyResponseRate / 100) * stats.totalQuestions).toLocaleString()} soru`}
          color="timely"
        />
        <StatsCard
          title="Gecikmeli Cevaplanma"
          value={`${stats.lateResponseRate.toFixed(1)}%`}
          subtitle={`${((stats.lateResponseRate / 100) * stats.totalQuestions).toLocaleString()} soru`}
          color="late"
        />
        <StatsCard
          title="Cevaplanmamış"
          value={`${stats.unansweredRate.toFixed(1)}%`}
          subtitle={`${((stats.unansweredRate / 100) * stats.totalQuestions).toLocaleString()} soru`}
          color="unanswered"
        />
      </div>
    </div>
  );
};

export default OverallStats; 