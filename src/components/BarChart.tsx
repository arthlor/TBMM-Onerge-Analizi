import React, { useMemo } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ParliamentaryQuestion } from '@/types/parliamentaryQuestions.types';
import { RESPONSE_TYPES } from '@/constants/responseTypes';
import './BarChart.css';

interface BarChartProps {
  data: ParliamentaryQuestion[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    return data
      .filter((item) => item.muhatap !== 'Toplam')
      .map((item) => ({
        ministry: item.muhatap,
        timely: item.suresiIcindeCevaplanan,
        late: item.suresiGectiktenSonraCevaplanan,
        unanswered: item.cevaplanmadigiGelenKagitlardaIlanEdilen,
        inProgress: item.cevaplanmaSuresiDevamEden,
        withdrawn: item.geriAlinan,
        total: item.toplam,
      }));
  }, [data]);

  return (
    <div className="bar-chart-container">
      <h2 className="chart-title">Bakanlık Performans Karşılaştırması</h2>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsBarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 100,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="ministry" 
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            tick={{ fontSize: 10 }}
          />
          <YAxis tickFormatter={(value: number) => `${value / 1000}k`} />
          <Tooltip 
            formatter={(value: number, name: string) => [
              value.toLocaleString(),
              RESPONSE_TYPES.find(type => 
                type.key === 'suresiIcindeCevaplanan' && name === 'timely' ||
                type.key === 'suresiGectiktenSonraCevaplanan' && name === 'late' ||
                type.key === 'cevaplanmadigiGelenKagitlardaIlanEdilen' && name === 'unanswered' ||
                type.key === 'cevaplanmaSuresiDevamEden' && name === 'inProgress' ||
                type.key === 'geriAlinan' && name === 'withdrawn'
              )?.shortLabel || name
            ]}
          />
          <Legend />
          <Bar dataKey="timely" stackId="a" fill="#4CAF50" name="Zamanında" />
          <Bar dataKey="late" stackId="a" fill="#FF9800" name="Gecikmeli" />
          <Bar dataKey="unanswered" stackId="a" fill="#F44336" name="Cevaplanmadı" />
          <Bar dataKey="inProgress" stackId="a" fill="#2196F3" name="Devam Ediyor" />
          <Bar dataKey="withdrawn" stackId="a" fill="#9E9E9E" name="Geri Alındı" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart; 