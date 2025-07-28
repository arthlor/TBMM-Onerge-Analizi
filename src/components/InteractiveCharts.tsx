import React, { useState, useMemo } from 'react';
import { useParliamentaryQuestionsStore } from '@/store/parliamentaryQuestionsStore';
import './InteractiveCharts.css';

type ChartType = 'stacked-bar' | 'donut' | 'comparison' | 'trend';

const InteractiveCharts: React.FC = () => {
  const data = useParliamentaryQuestionsStore((state) => state.data);
  const [selectedChart, setSelectedChart] = useState<ChartType>('stacked-bar');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('');

  const ministries = useMemo(() => {
    return data.filter(item => item.muhatap !== 'Toplam').map(item => item.muhatap);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!selectedMinistry) return data.filter(item => item.muhatap !== 'Toplam');
    return data.filter(item => item.muhatap === selectedMinistry);
  }, [data, selectedMinistry]);

  const totalData = useMemo(() => {
    return data.find(item => item.muhatap === 'Toplam');
  }, [data]);

  const renderStackedBarChart = () => {
    return (
      <div className="chart-container">
        <h3>Bakanlık Bazında Dağılım</h3>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color timely"></div>
            <span>Zamanında Cevaplanan</span>
          </div>
          <div className="legend-item">
            <div className="legend-color late"></div>
            <span>Geç Cevaplanan</span>
          </div>
          <div className="legend-item">
            <div className="legend-color unanswered"></div>
            <span>Cevaplanmayan</span>
          </div>
          <div className="legend-item">
            <div className="legend-color in-progress"></div>
            <span>Devam Eden</span>
          </div>
        </div>
        <div className="stacked-bars">
          {filteredData.map((item, index) => {
            const total = item.toplam;
            const timelyPercent = (item.suresiIcindeCevaplanan / total) * 100;
            const latePercent = (item.suresiGectiktenSonraCevaplanan / total) * 100;
            const unansweredPercent = (item.cevaplanmadigiGelenKagitlardaIlanEdilen / total) * 100;
            const inProgressPercent = (item.cevaplanmaSuresiDevamEden / total) * 100;

            return (
              <div key={index} className="bar-group">
                <div className="bar-label">{item.muhatap}</div>
                <div className="bar-container">
                  <div 
                    className="bar-segment timely" 
                    style={{ width: `${timelyPercent}%` }}
                    title={`Zamanında: ${item.suresiIcindeCevaplanan} (${timelyPercent.toFixed(1)}%)`}
                  ></div>
                  <div 
                    className="bar-segment late" 
                    style={{ width: `${latePercent}%` }}
                    title={`Geç: ${item.suresiGectiktenSonraCevaplanan} (${latePercent.toFixed(1)}%)`}
                  ></div>
                  <div 
                    className="bar-segment unanswered" 
                    style={{ width: `${unansweredPercent}%` }}
                    title={`Cevaplanmayan: ${item.cevaplanmadigiGelenKagitlardaIlanEdilen} (${unansweredPercent.toFixed(1)}%)`}
                  ></div>
                  <div 
                    className="bar-segment in-progress" 
                    style={{ width: `${inProgressPercent}%` }}
                    title={`Devam Eden: ${item.cevaplanmaSuresiDevamEden} (${inProgressPercent.toFixed(1)}%)`}
                  ></div>
                </div>
                <div className="bar-total">{total.toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDonutChart = () => {
    if (!totalData) return null;

    const total = totalData.toplam;
    const timelyPercent = (totalData.suresiIcindeCevaplanan / total) * 100;
    const latePercent = (totalData.suresiGectiktenSonraCevaplanan / total) * 100;
    const unansweredPercent = (totalData.cevaplanmadigiGelenKagitlardaIlanEdilen / total) * 100;
    const inProgressPercent = (totalData.cevaplanmaSuresiDevamEden / total) * 100;

    return (
      <div className="chart-container">
        <h3>Genel Dağılım</h3>
        <div className="donut-chart">
          <div className="donut-container">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#e9ecef" strokeWidth="20"/>
              <circle 
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                stroke="#28a745" 
                strokeWidth="20"
                strokeDasharray={`${timelyPercent * 5.03} ${500 - timelyPercent * 5.03}`}
                strokeDashoffset="0"
                transform="rotate(-90 100 100)"
              />
              <circle 
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                stroke="#ffc107" 
                strokeWidth="20"
                strokeDasharray={`${latePercent * 5.03} ${500 - latePercent * 5.03}`}
                strokeDashoffset={`-${timelyPercent * 5.03}`}
                transform="rotate(-90 100 100)"
              />
              <circle 
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                stroke="#dc3545" 
                strokeWidth="20"
                strokeDasharray={`${unansweredPercent * 5.03} ${500 - unansweredPercent * 5.03}`}
                strokeDashoffset={`-${(timelyPercent + latePercent) * 5.03}`}
                transform="rotate(-90 100 100)"
              />
              <circle 
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                stroke="#6f42c1" 
                strokeWidth="20"
                strokeDasharray={`${inProgressPercent * 5.03} ${500 - inProgressPercent * 5.03}`}
                strokeDashoffset={`-${(timelyPercent + latePercent + unansweredPercent) * 5.03}`}
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div className="donut-center">
              <div className="donut-total">{total.toLocaleString()}</div>
              <div className="donut-label">Toplam</div>
            </div>
          </div>
          <div className="donut-legend">
            <div className="legend-item">
              <div className="legend-color timely"></div>
              <span>Zamanında ({timelyPercent.toFixed(1)}%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color late"></div>
              <span>Geç ({latePercent.toFixed(1)}%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color unanswered"></div>
              <span>Cevaplanmayan ({unansweredPercent.toFixed(1)}%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color in-progress"></div>
              <span>Devam Eden ({inProgressPercent.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderComparisonChart = () => {
    return (
      <div className="chart-container">
        <h3>Bakanlık Karşılaştırması</h3>
        <div className="comparison-chart">
          {filteredData.map((item, index) => {
            const responseRate = ((item.suresiIcindeCevaplanan + item.suresiGectiktenSonraCevaplanan) / item.toplam) * 100;
            const timelyRate = (item.suresiIcindeCevaplanan / item.toplam) * 100;

            return (
              <div key={index} className="comparison-item">
                <div className="comparison-label">{item.muhatap}</div>
                <div className="comparison-bars">
                  <div className="comparison-bar">
                    <div className="bar-label">Cevaplanma Oranı</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill response" 
                        style={{ width: `${responseRate}%` }}
                      ></div>
                      <span className="bar-value">{responseRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="comparison-bar">
                    <div className="bar-label">Zamanında Oranı</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill timely" 
                        style={{ width: `${timelyRate}%` }}
                      ></div>
                      <span className="bar-value">{timelyRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'stacked-bar':
        return renderStackedBarChart();
      case 'donut':
        return renderDonutChart();
      case 'comparison':
        return renderComparisonChart();
      default:
        return renderStackedBarChart();
    }
  };

  return (
    <div className="interactive-charts">
      <div className="chart-controls">
        <div className="chart-type-selector">
          <button 
            className={`chart-type-btn ${selectedChart === 'stacked-bar' ? 'active' : ''}`}
            onClick={() => setSelectedChart('stacked-bar')}
          >
            Yığın Grafik
          </button>
          <button 
            className={`chart-type-btn ${selectedChart === 'donut' ? 'active' : ''}`}
            onClick={() => setSelectedChart('donut')}
          >
            Halka Grafik
          </button>
          <button 
            className={`chart-type-btn ${selectedChart === 'comparison' ? 'active' : ''}`}
            onClick={() => setSelectedChart('comparison')}
          >
            Karşılaştırma
          </button>
        </div>
        <div className="ministry-filter">
          <select
            value={selectedMinistry}
            onChange={(e) => setSelectedMinistry(e.target.value)}
            className="ministry-select"
          >
            <option value="">Tüm Bakanlıklar</option>
            {ministries.map((ministry) => (
              <option key={ministry} value={ministry}>
                {ministry}
              </option>
            ))}
          </select>
        </div>
      </div>
      {renderChart()}
    </div>
  );
};

export default InteractiveCharts; 