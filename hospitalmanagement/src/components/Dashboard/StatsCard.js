import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import './DashboardWidgets.css';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
    return (
        <div className="stats-card">
            <div className="stats-content">
                <div>
                    <h3 className="stats-title">{title}</h3>
                    <p className="stats-value">{value}</p>
                </div>
                <div className={`stats-icon ${color}`}>
                    {Icon && <Icon size={24} />}
                </div>
            </div>

            {trend && (
                <div className="stats-trend">
                    <span className={`trend-value ${trend === 'up' ? 'positive' : 'negative'}`}>
                        {trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        {trendValue}
                    </span>
                    <span className="trend-label">vs last month</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
