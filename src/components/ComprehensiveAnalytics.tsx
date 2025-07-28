import React, { useMemo } from 'react';
import { useParliamentaryQuestionsStore } from '@/store/parliamentaryQuestionsStore';
import './ComprehensiveAnalytics.css';

const ComprehensiveAnalytics: React.FC = () => {
  const data = useParliamentaryQuestionsStore((state) => state.data);

  const analytics = useMemo(() => {
    const ministries = data.filter(item => item.muhatap !== 'Toplam');
    const total = data.find(item => item.muhatap === 'Toplam');

    if (!total) return null;

    // Calculate overall statistics
    const totalQuestions = total.toplam;
    const totalAnswered = total.suresiIcindeCevaplanan + total.suresiGectiktenSonraCevaplanan;
    const totalUnanswered = total.cevaplanmadigiGelenKagitlardaIlanEdilen;
    const totalInProgress = total.cevaplanmaSuresiDevamEden;
    const totalWithdrawn = total.geriAlinan;

    // Calculate percentages
    const answeredPercentage = ((totalAnswered / totalQuestions) * 100).toFixed(1);
    const timelyAnsweredPercentage = ((total.suresiIcindeCevaplanan / totalQuestions) * 100).toFixed(1);
    const lateAnsweredPercentage = ((total.suresiGectiktenSonraCevaplanan / totalQuestions) * 100).toFixed(1);
    const unansweredPercentage = ((totalUnanswered / totalQuestions) * 100).toFixed(1);
    const inProgressPercentage = ((totalInProgress / totalQuestions) * 100).toFixed(1);
    const withdrawnPercentage = ((totalWithdrawn / totalQuestions) * 100).toFixed(1);

    // Find best and worst performing ministries
    const ministryPerformance = ministries.map(ministry => {
      const totalAnswered = ministry.suresiIcindeCevaplanan + ministry.suresiGectiktenSonraCevaplanan;
      const responseRate = (totalAnswered / ministry.toplam) * 100;
      const timelyRate = (ministry.suresiIcindeCevaplanan / ministry.toplam) * 100;
      
      return {
        name: ministry.muhatap,
        totalQuestions: ministry.toplam,
        responseRate: responseRate.toFixed(1),
        timelyRate: timelyRate.toFixed(1),
        unansweredCount: ministry.cevaplanmadigiGelenKagitlardaIlanEdilen,
        inProgressCount: ministry.cevaplanmaSuresiDevamEden,
      };
    });

    const bestPerforming = [...ministryPerformance]
      .sort((a, b) => parseFloat(b.responseRate) - parseFloat(a.responseRate))
      .slice(0, 3);

    const worstPerforming = [...ministryPerformance]
      .sort((a, b) => parseFloat(a.responseRate) - parseFloat(b.responseRate))
      .slice(0, 3);

    const mostUnanswered = [...ministryPerformance]
      .sort((a, b) => b.unansweredCount - a.unansweredCount)
      .slice(0, 3);

    const mostInProgress = [...ministryPerformance]
      .sort((a, b) => b.inProgressCount - a.inProgressCount)
      .slice(0, 3);

    return {
      totalQuestions,
      totalAnswered,
      totalUnanswered,
      totalInProgress,
      totalWithdrawn,
      answeredPercentage,
      timelyAnsweredPercentage,
      lateAnsweredPercentage,
      unansweredPercentage,
      inProgressPercentage,
      withdrawnPercentage,
      bestPerforming,
      worstPerforming,
      mostUnanswered,
      mostInProgress,
      ministryPerformance,
    };
  }, [data]);

  if (!analytics) return null;

  return (
    <div className="comprehensive-analytics">
      <div className="analytics-header">
        <h2>Kapsamlı Analiz</h2>
        <p>TBMM Yazılı Soru Önergeleri Detaylı İstatistikleri</p>
      </div>

      <div className="analytics-grid">





      </div>
    </div>
  );
};

export default ComprehensiveAnalytics; 