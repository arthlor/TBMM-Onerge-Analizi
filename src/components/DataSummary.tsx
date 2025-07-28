import React, { useMemo } from 'react';
import { useParliamentaryQuestionsStore } from '@/store/parliamentaryQuestionsStore';
import './DataSummary.css';

const DataSummary: React.FC = () => {
  const data = useParliamentaryQuestionsStore((state) => state.data);

  const summary = useMemo(() => {
    const ministries = data.filter(item => item.muhatap !== 'Toplam');
    const total = data.find(item => item.muhatap === 'Toplam');

    if (!total) return null;

    // Calculate key metrics
    const totalQuestions = total.toplam;
    const totalAnswered = total.suresiIcindeCevaplanan + total.suresiGectiktenSonraCevaplanan;
    const totalUnanswered = total.cevaplanmadigiGelenKagitlardaIlanEdilen;
    const totalInProgress = total.cevaplanmaSuresiDevamEden;

    // Calculate percentages
    const answeredPercentage = ((totalAnswered / totalQuestions) * 100).toFixed(1);
    const timelyAnsweredPercentage = ((total.suresiIcindeCevaplanan / totalQuestions) * 100).toFixed(1);
    const unansweredPercentage = ((totalUnanswered / totalQuestions) * 100).toFixed(1);

    // Find key insights
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
      .slice(0, 1)[0];

    const worstPerforming = [...ministryPerformance]
      .sort((a, b) => parseFloat(a.responseRate) - parseFloat(b.responseRate))
      .slice(0, 1)[0];

    const mostUnanswered = [...ministryPerformance]
      .sort((a, b) => b.unansweredCount - a.unansweredCount)
      .slice(0, 1)[0];

    const mostInProgress = [...ministryPerformance]
      .sort((a, b) => b.inProgressCount - a.inProgressCount)
      .slice(0, 1)[0];

    return {
      totalQuestions,
      totalAnswered,
      totalUnanswered,
      totalInProgress,
      answeredPercentage,
      timelyAnsweredPercentage,
      unansweredPercentage,
      bestPerforming,
      worstPerforming,
      mostUnanswered,
      mostInProgress,
    };
  }, [data]);

  if (!summary) return null;

  return (
    <div className="data-summary">
      <div className="summary-header">
        <div className="header-content">
          <h2>Veri Özeti</h2>
          <p>TBMM yazılı soru önergeleri analizi ve önemli bulgular</p>
        </div>
      </div>

      <div className="summary-content">
        {/* Key Numbers */}
        <section className="summary-section key-numbers">
          <div className="section-header">
            <h3>Temel Sayılar</h3>
            <p>Genel istatistikler ve performans göstergeleri</p>
          </div>
          <div className="numbers-grid">
            <div className="number-card total">
              <div className="number-icon">📊</div>
              <div className="number-content">
                <div className="number-value">{summary.totalQuestions.toLocaleString()}</div>
                <div className="number-label">Toplam Soru Önergesi</div>
              </div>
            </div>
            <div className="number-card answered">
              <div className="number-icon">✅</div>
              <div className="number-content">
                <div className="number-value">{summary.totalAnswered.toLocaleString()}</div>
                <div className="number-label">Cevaplanan Soru</div>
                <div className="number-percentage">{summary.answeredPercentage}%</div>
              </div>
            </div>
            <div className="number-card unanswered">
              <div className="number-icon">❌</div>
              <div className="number-content">
                <div className="number-value">{summary.totalUnanswered.toLocaleString()}</div>
                <div className="number-label">Cevaplanmayan Soru</div>
                <div className="number-percentage">{summary.unansweredPercentage}%</div>
              </div>
            </div>
            <div className="number-card in-progress">
              <div className="number-icon">🔄</div>
              <div className="number-content">
                <div className="number-value">{summary.totalInProgress.toLocaleString()}</div>
                <div className="number-label">Devam Eden Soru</div>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Insights */}
        <section className="summary-section performance-insights">
          <div className="section-header">
            <h3>Performans Analizi</h3>
            <p>En iyi ve en düşük performans gösteren kurumlar</p>
          </div>
          <div className="insights-grid">
            <div className="insight-card positive">
              <div className="insight-icon">🏆</div>
              <div className="insight-content">
                <div className="insight-title">En İyi Performans</div>
                <div className="insight-value">{summary.bestPerforming.name}</div>
                <div className="insight-rate">{summary.bestPerforming.responseRate}% cevaplanma oranı</div>
              </div>
            </div>
            <div className="insight-card negative">
              <div className="insight-icon">⚠️</div>
              <div className="insight-content">
                <div className="insight-title">En Düşük Performans</div>
                <div className="insight-value">{summary.worstPerforming.name}</div>
                <div className="insight-rate">{summary.worstPerforming.responseRate}% cevaplanma oranı</div>
              </div>
            </div>
            <div className="insight-card critical">
              <div className="insight-icon">🚨</div>
              <div className="insight-content">
                <div className="insight-title">En Çok Cevaplanmayan</div>
                <div className="insight-value">{summary.mostUnanswered.name}</div>
                <div className="insight-rate">{summary.mostUnanswered.unansweredCount.toLocaleString()} cevaplanmayan soru</div>
              </div>
            </div>
            <div className="insight-card pending">
              <div className="insight-icon">⏳</div>
              <div className="insight-content">
                <div className="insight-title">En Çok Devam Eden</div>
                <div className="insight-value">{summary.mostInProgress.name}</div>
                <div className="insight-rate">{summary.mostInProgress.inProgressCount.toLocaleString()} devam eden soru</div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Findings */}
        <section className="summary-section key-findings">
          <div className="section-header">
            <h3>Önemli Bulgular</h3>
            <p>Analiz sonuçlarından çıkan kritik tespitler</p>
          </div>
          <div className="findings-list">
            <div className="finding-item">
              <div className="finding-icon">📊</div>
              <div className="finding-text">
                <strong>Genel Durum:</strong> {summary.totalQuestions.toLocaleString()} soru önergesinden 
                <span className="highlight">{summary.answeredPercentage}%</span>'i cevaplanmış durumda.
              </div>
            </div>
            <div className="finding-item">
              <div className="finding-icon">⏰</div>
              <div className="finding-text">
                <strong>Zamanında Cevaplanma:</strong> Soruların sadece 
                <span className="highlight">{summary.timelyAnsweredPercentage}%</span>'i zamanında cevaplanmış.
              </div>
            </div>
            <div className="finding-item">
              <div className="finding-icon">❌</div>
              <div className="finding-text">
                <strong>Cevaplanmayan Sorular:</strong> {summary.totalUnanswered.toLocaleString()} soru 
                cevaplanmadığı gelen kağıtlarda ilan edilmiş.
              </div>
            </div>
            <div className="finding-item">
              <div className="finding-icon">🔄</div>
              <div className="finding-text">
                <strong>Devam Eden Süreçler:</strong> {summary.totalInProgress.toLocaleString()} soru 
                hala cevaplanma sürecinde.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DataSummary; 