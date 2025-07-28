import React, { useState, useMemo } from 'react';
import { useParliamentaryQuestionsStore } from '@/store/parliamentaryQuestionsStore';
import type { ParliamentaryQuestion } from '@/types/parliamentaryQuestions.types';
import './DetailedDataTable.css';

interface SortConfig {
  key: keyof ParliamentaryQuestion;
  direction: 'asc' | 'desc';
}

const DetailedDataTable: React.FC = () => {
  const data = useParliamentaryQuestionsStore((state) => state.data);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'toplam', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('');

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((item) => {
      const matchesSearch = item.muhatap.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMinistry = selectedMinistry === '' || item.muhatap === selectedMinistry;
      return matchesSearch && matchesMinistry;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [data, sortConfig, searchTerm, selectedMinistry]);

  const handleSort = (key: keyof ParliamentaryQuestion) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getResponseRate = (item: ParliamentaryQuestion) => {
    const totalAnswered = item.suresiIcindeCevaplanan + item.suresiGectiktenSonraCevaplanan;
    return totalAnswered > 0 ? ((totalAnswered / item.toplam) * 100).toFixed(1) : '0.0';
  };

  const getTimelyResponseRate = (item: ParliamentaryQuestion) => {
    return item.toplam > 0 ? ((item.suresiIcindeCevaplanan / item.toplam) * 100).toFixed(1) : '0.0';
  };

  const ministries = useMemo(() => {
    return data.filter(item => item.muhatap !== 'Toplam').map(item => item.muhatap);
  }, [data]);

  return (
    <div className="detailed-data-table">
      <div className="table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Bakanlık ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
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

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('muhatap')} className="sortable">
                Bakanlık
                {sortConfig.key === 'muhatap' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('toplam')} className="sortable">
                Toplam
                {sortConfig.key === 'toplam' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('suresiIcindeCevaplanan')} className="sortable">
                Süresi İçinde Cevaplanan
                {sortConfig.key === 'suresiIcindeCevaplanan' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('suresiGectiktenSonraCevaplanan')} className="sortable">
                Süresi Geçtikten Sonra Cevaplanan
                {sortConfig.key === 'suresiGectiktenSonraCevaplanan' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('cevaplanmadigiGelenKagitlardaIlanEdilen')} className="sortable">
                Cevaplanmadığı Gelen Kağıtlarda İlan Edilen
                {sortConfig.key === 'cevaplanmadigiGelenKagitlardaIlanEdilen' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('cevaplanmaSuresiDevamEden')} className="sortable">
                Cevaplanma Süresi Devam Eden
                {sortConfig.key === 'cevaplanmaSuresiDevamEden' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('geriAlinan')} className="sortable">
                Geri Alınan
                {sortConfig.key === 'geriAlinan' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th className="calculated-column">Cevaplanma Oranı (%)</th>
              <th className="calculated-column">Zamanında Cevaplanma Oranı (%)</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((item, index) => (
              <tr key={index} className={item.muhatap === 'Toplam' ? 'total-row' : ''}>
                <td className="ministry-name">{item.muhatap}</td>
                <td className="number-cell">{item.toplam.toLocaleString()}</td>
                <td className="number-cell positive">
                  {item.suresiIcindeCevaplanan.toLocaleString()}
                </td>
                <td className="number-cell warning">
                  {item.suresiGectiktenSonraCevaplanan.toLocaleString()}
                </td>
                <td className="number-cell negative">
                  {item.cevaplanmadigiGelenKagitlardaIlanEdilen.toLocaleString()}
                </td>
                <td className="number-cell pending">
                  {item.cevaplanmaSuresiDevamEden.toLocaleString()}
                </td>
                <td className="number-cell withdrawn">
                  {item.geriAlinan.toLocaleString()}
                </td>
                <td className="percentage-cell">
                  <div className="percentage-bar">
                    <div 
                      className="percentage-fill" 
                      style={{ width: `${getResponseRate(item)}%` }}
                    ></div>
                    <span className="percentage-text">{getResponseRate(item)}%</span>
                  </div>
                </td>
                <td className="percentage-cell">
                  <div className="percentage-bar">
                    <div 
                      className="percentage-fill timely" 
                      style={{ width: `${getTimelyResponseRate(item)}%` }}
                    ></div>
                    <span className="percentage-text">{getTimelyResponseRate(item)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailedDataTable; 