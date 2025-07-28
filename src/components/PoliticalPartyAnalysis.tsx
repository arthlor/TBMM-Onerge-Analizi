import React, { useState, useMemo } from 'react';
import { parliamentaryQuestionsData } from '@/data/parliamentaryQuestionsData';
import { useMobileDetection } from '@/utils/mobileDetection';
import './PoliticalPartyAnalysis.css';

interface PoliticalPartyData {
  party: string;
  total: number;
  withdrawn: number | null;
  timelyAnswered: number | null;
  lateAnswered: number | null;
  unanswered: number | null;
  inProgress: number | null;
}

const PoliticalPartyAnalysis: React.FC = () => {
  const [selectedParty, setSelectedParty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'total' | 'timelyRate' | 'unansweredRate'>('total');
  const { isMobile, isTablet } = useMobileDetection();

  const partyData = useMemo(() => {
    return parliamentaryQuestionsData.politicalPartyData.filter(item => item.party !== 'Toplam');
  }, []);

  const sortedData = useMemo(() => {
    return [...partyData].sort((a, b) => {
      switch (sortBy) {
        case 'total':
          return b.total - a.total;
        case 'timelyRate':
          const rateA = a.total > 0 ? ((a.timelyAnswered || 0) / a.total) * 100 : 0;
          const rateB = b.total > 0 ? ((b.timelyAnswered || 0) / b.total) * 100 : 0;
          return rateB - rateA;
        case 'unansweredRate':
          const unrateA = a.total > 0 ? ((a.unanswered || 0) / a.total) * 100 : 0;
          const unrateB = b.total > 0 ? ((b.unanswered || 0) / b.total) * 100 : 0;
          return unrateB - unrateA;
        default:
          return 0;
      }
    });
  }, [partyData, sortBy]);

  const selectedPartyData = useMemo(() => {
    if (selectedParty === 'all') {
      return parliamentaryQuestionsData.politicalPartyData.find(item => item.party === 'Toplam');
    }
    return partyData.find(item => item.party === selectedParty);
  }, [selectedParty, partyData]);

  const getResponseRate = (data: PoliticalPartyData | undefined) => {
    if (!data || data.total === 0) return 0;
    const answered = (data.timelyAnswered || 0) + (data.lateAnswered || 0);
    return (answered / data.total) * 100;
  };

  const getTimelyResponseRate = (data: PoliticalPartyData | undefined) => {
    if (!data || data.total === 0) return 0;
    return ((data.timelyAnswered || 0) / data.total) * 100;
  };

  return (
    <div className="political-party-analysis">
      <div className="analysis-header">
        <div className="header-content">
          <h2>Siyasi Parti Analizi</h2>
          <p>Yazılı soru önergelerinin siyasi partilere göre dağılımı ve performans analizi</p>
        </div>
      </div>

      <div className="analysis-controls">
        <div className="controls-container">
          <div className="control-group">
            <label htmlFor="party-select">Parti Seçin</label>
            <select
              id="party-select"
              value={selectedParty}
              onChange={(e) => setSelectedParty(e.target.value)}
              className="control-select"
            >
              <option value="all">Tüm Partiler</option>
              {partyData.map((party) => (
                <option key={party.party} value={party.party}>
                  {party.party}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="sort-select">Sıralama</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="control-select"
            >
              <option value="total">Toplam Soru Sayısı</option>
              <option value="timelyRate">Zamanında Cevaplanma Oranı</option>
              <option value="unansweredRate">Cevaplanmamış Oranı</option>
            </select>
          </div>
        </div>
      </div>

      <div className="analysis-content">
        <div className="content-grid">
          <div className="party-overview">
            <div className="overview-card">
              <div className="card-header">
                <h3>Seçili Parti Özeti</h3>
                <div className="card-subtitle">
                  {selectedParty === 'all' ? 'Tüm partilerin toplam performansı' : `${selectedParty} partisinin performans detayları`}
                </div>
              </div>
              {selectedPartyData && (
                <div className="overview-stats">
                  <div className="stat-item primary">
                    <span className="stat-label">Toplam Soru</span>
                    <span className="stat-value">{selectedPartyData.total.toLocaleString()}</span>
                  </div>
                  <div className="stat-item positive">
                    <span className="stat-label">Zamanında Cevaplanan</span>
                    <span className="stat-value">{(selectedPartyData.timelyAnswered || 0).toLocaleString()}</span>
                    <span className="stat-percentage">({getTimelyResponseRate(selectedPartyData).toFixed(1)}%)</span>
                  </div>
                  <div className="stat-item neutral">
                    <span className="stat-label">Gecikmeli Cevaplanan</span>
                    <span className="stat-value">{(selectedPartyData.lateAnswered || 0).toLocaleString()}</span>
                  </div>
                  <div className="stat-item negative">
                    <span className="stat-label">Cevaplanmamış</span>
                    <span className="stat-value">{(selectedPartyData.unanswered || 0).toLocaleString()}</span>
                    <span className="stat-percentage">({((selectedPartyData.unanswered || 0) / selectedPartyData.total * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="stat-item pending">
                    <span className="stat-label">Devam Eden</span>
                    <span className="stat-value">{(selectedPartyData.inProgress || 0).toLocaleString()}</span>
                  </div>
                  <div className="stat-item withdrawn">
                    <span className="stat-label">Geri Alınan</span>
                    <span className="stat-value">{(selectedPartyData.withdrawn || 0).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="party-comparison">
            <div className="comparison-header">
              <h3>Parti Karşılaştırması</h3>
              <p>Siyasi partilerin soru önergesi performanslarının detaylı karşılaştırması</p>
            </div>
            <div className="comparison-table">
              <table>
                <thead>
                  <tr>
                    <th>Parti</th>
                    <th>Toplam Soru</th>
                    <th>Zamanında Cevaplanma</th>
                    <th>Gecikmeli Cevaplanma</th>
                    <th>Cevaplanmamış</th>
                    <th>Devam Eden</th>
                    <th>Geri Alınan</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((party) => (
                    <tr key={party.party} className={selectedParty === party.party ? 'selected' : ''}>
                      <td className="party-name">{party.party}</td>
                      <td className="total-questions">{party.total.toLocaleString()}</td>
                      <td className="timely-answered">
                        <div className="cell-content">
                          <span className="cell-value">{(party.timelyAnswered || 0).toLocaleString()}</span>
                          <span className="percentage">
                            ({party.total > 0 ? ((party.timelyAnswered || 0) / party.total * 100).toFixed(1) : 0}%)
                          </span>
                        </div>
                      </td>
                      <td className="late-answered">
                        <div className="cell-content">
                          <span className="cell-value">{(party.lateAnswered || 0).toLocaleString()}</span>
                          <span className="percentage">
                            ({party.total > 0 ? ((party.lateAnswered || 0) / party.total * 100).toFixed(1) : 0}%)
                          </span>
                        </div>
                      </td>
                      <td className="unanswered">
                        <div className="cell-content">
                          <span className="cell-value">{(party.unanswered || 0).toLocaleString()}</span>
                          <span className="percentage">
                            ({party.total > 0 ? ((party.unanswered || 0) / party.total * 100).toFixed(1) : 0}%)
                          </span>
                        </div>
                      </td>
                      <td className="in-progress">{(party.inProgress || 0).toLocaleString()}</td>
                      <td className="withdrawn">{(party.withdrawn || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="party-charts">
            <div className="chart-section">
              <div className="chart-header">
                <h3>Parti Performans Grafiği</h3>
                <p>İlk 10 partinin soru önergesi dağılımı ve performans oranları</p>
              </div>
              <div className="performance-chart">
                {sortedData.slice(0, 10).map((party, index) => {
                  const timelyRate = party.total > 0 ? ((party.timelyAnswered || 0) / party.total) * 100 : 0;
                  const lateRate = party.total > 0 ? ((party.lateAnswered || 0) / party.total) * 100 : 0;
                  const unansweredRate = party.total > 0 ? ((party.unanswered || 0) / party.total) * 100 : 0;
                  
                  return (
                    <div key={party.party} className="party-bar">
                      <div className="party-label">{party.party}</div>
                      <div className="bar-container">
                        <div 
                          className="bar-segment timely" 
                          style={{ width: `${timelyRate}%` }}
                          title={`Zamanında: ${timelyRate.toFixed(1)}%`}
                        />
                        <div 
                          className="bar-segment late" 
                          style={{ width: `${lateRate}%` }}
                          title={`Gecikmeli: ${lateRate.toFixed(1)}%`}
                        />
                        <div 
                          className="bar-segment unanswered" 
                          style={{ width: `${unansweredRate}%` }}
                          title={`Cevaplanmamış: ${unansweredRate.toFixed(1)}%`}
                        />
                      </div>
                      <div className="party-total">{party.total.toLocaleString()}</div>
                    </div>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="chart-legend">
                <h4>Grafik Açıklaması</h4>
                <div className="legend-items">
                  <div className="legend-item">
                    <div className="legend-color timely"></div>
                    <span className="legend-label">Zamanında Cevaplanan</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color late"></div>
                    <span className="legend-label">Gecikmeli Cevaplanan</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color unanswered"></div>
                    <span className="legend-label">Cevaplanmamış</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticalPartyAnalysis; 