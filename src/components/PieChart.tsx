import React, { useMemo } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useParliamentaryQuestionsStore } from '@/store/parliamentaryQuestionsStore';
import { RESPONSE_TYPES } from '@/constants/responseTypes';
import './PieChart.css';

const PieChart: React.FC = () => {
  const getOverallStats = useParliamentaryQuestionsStore((state) => state.getOverallStats);
  const stats = getOverallStats();

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

  return (
    <div className="pie-chart-container">
      <h2 className="chart-title">Genel Dağılım</h2>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Oran']} />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart; 