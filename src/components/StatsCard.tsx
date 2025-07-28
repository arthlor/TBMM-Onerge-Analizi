import React from 'react';
import './StatsCard.css';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, color = 'default' }) => {
  return (
    <div 
      className="stats-card" 
      data-color={color}
      tabIndex={0}
      role="button"
      aria-label={`${title}: ${value}`}
    >
      <div className="stats-card-title">{title}</div>
      <div className="stats-card-value">{value}</div>
      {subtitle && <div className="stats-card-subtitle">{subtitle}</div>}
    </div>
  );
};

export default StatsCard; 