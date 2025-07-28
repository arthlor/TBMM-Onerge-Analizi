import React, { useMemo } from 'react';
import { useParliamentaryQuestionsStore } from '@/store/parliamentaryQuestionsStore';
import './PerformanceRanking.css';

const PerformanceRanking: React.FC = () => {
  const getMinistryPerformance = useParliamentaryQuestionsStore((state: any) => state.getMinistryPerformance);
  const performanceData = getMinistryPerformance();

  const sortedData = useMemo(() => {
    return [...performanceData].sort((a, b) => b.performanceScore - a.performanceScore);
  }, [performanceData]);

  const topPerformers = sortedData.slice(0, 3);
  const bottomPerformers = sortedData.slice(-3).reverse();

  // Filter ministries with data for critical situations
  const ministriesWithData = performanceData.filter((ministry: any) => ministry.totalQuestions > 0);
  
  const mostUnanswered = useMemo(() => {
    return [...ministriesWithData]
      .sort((a, b) => b.unansweredRate - a.unansweredRate)
      .slice(0, 3);
  }, [ministriesWithData]);

  const mostInProgress = useMemo(() => {
    return [...ministriesWithData]
      .sort((a, b) => b.inProgressRate - a.inProgressRate)
      .slice(0, 3);
  }, [ministriesWithData]);

  const formatPercentage = (value: number): string => {
    if (isNaN(value) || !isFinite(value)) return '0%';
    return `${value.toFixed(1)}%`;
  };

  const formatScore = (value: number): string => {
    if (isNaN(value) || !isFinite(value)) return '0';
    return value.toFixed(1);
  };

  return (
    <div className="performance-ranking-container">
      <h2 className="chart-title">Performans Sıralaması</h2>
      
      <div className="ranking-grid">
        {/* Top Performers */}
        <div className="ranking-section">
          <h3 className="section-title">En İyi Performans</h3>
          <div className="ranking-cards">
            {topPerformers.map((ministry, index) => (
              <div key={ministry.name} className="ranking-card top-card">
                <div className="rank">#{index + 1}</div>
                <div className="ministry-name">{ministry.name}</div>
                <div className="score">{formatScore(ministry.performanceScore)}</div>
                <div className="rate">{formatPercentage(ministry.timelyResponseRate)} zamanında</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Performers */}
        <div className="ranking-section">
          <h3 className="section-title">En Düşük Performans</h3>
          <div className="ranking-cards">
            {bottomPerformers.map((ministry, index) => (
              <div key={ministry.name} className="ranking-card bottom-card">
                <div className="rank">#{sortedData.length - bottomPerformers.length + index + 1}</div>
                <div className="ministry-name">{ministry.name}</div>
                <div className="score">{formatScore(ministry.performanceScore)}</div>
                <div className="rate">{formatPercentage(ministry.timelyResponseRate)} zamanında</div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Situations */}
        <div className="critical-situations">
          <h3 className="section-title">Kritik Durumlar</h3>
          
          <div className="critical-grid">
            {/* Most Unanswered */}
            <div className="critical-section">
              <h4 className="critical-title">En Çok Cevaplanmayan</h4>
              <div className="critical-list">
                {mostUnanswered.map((ministry, index) => (
                  <div key={ministry.name} className="critical-item">
                    <span className="critical-name">{ministry.name}</span>
                    <span className="critical-count">{ministry.totalQuestions - ministry.suresiIcindeCevaplanan - ministry.suresiGectiktenSonraCevaplanan}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Most In Progress */}
            <div className="critical-section">
              <h4 className="critical-title">En Çok Devam Eden</h4>
              <div className="critical-list">
                {mostInProgress.map((ministry, index) => (
                  <div key={ministry.name} className="critical-item">
                    <span className="critical-name">{ministry.name}</span>
                    <span className="critical-count">{ministry.cevaplanmaSuresiDevamEden}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceRanking; 