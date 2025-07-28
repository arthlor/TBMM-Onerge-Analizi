import React, { useMemo } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useParliamentaryQuestionsStore } from '@/store/parliamentaryQuestionsStore';
import { RESPONSE_TYPES } from '@/constants/responseTypes';
import { useMobileDetection } from '@/utils/mobileDetection';
import './PieChart.css';

const PieChart: React.FC = () => {
  const getOverallStats = useParliamentaryQuestionsStore((state) => state.getOverallStats);
  const stats = getOverallStats();
  const { isMobile, isTablet } = useMobileDetection();

  const pieData = useMemo(() => {
    return RESPONSE_TYPES.map((type) => {
      let value = 0;
      switch (type.key) {
        case 'suresiIcindeCevaplanan':
          value = stats.timelyResponseRate;
          break;
        case 'suresiGectiktenSonraCevaplanan':
          value = stats.lateResponseRate;
          break;
        case 'cevaplanmadigiGelenKagitlardaIlanEdilen':
          value = stats.unansweredRate;
          break;
        case 'cevaplanmaSuresiDevamEden':
          value = stats.inProgressRate;
          break;
        case 'geriAlinan':
          value = stats.withdrawnRate;
          break;
      }
      return {
        name: type.shortLabel,
        value,
        color: type.color,
      };
    }).filter((item) => item.value > 0);
  }, [stats]);

  const chartHeight = isMobile ? 250 : isTablet ? 280 : 300;
  const outerRadius = isMobile ? 60 : isTablet ? 70 : 80;

  return (
    <div className="pie-chart-container">
      <h2 className="chart-title">Genel Dağılım</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <RechartsPieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: { name: string; percent: number }) => 
                isMobile ? `${(percent * 100).toFixed(0)}%` : `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={outerRadius}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Oran']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: isMobile ? '12px' : '14px'
              }}
            />
            <Legend 
              wrapperStyle={{
                fontSize: isMobile ? '10px' : '12px',
                paddingTop: '10px'
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChart; 