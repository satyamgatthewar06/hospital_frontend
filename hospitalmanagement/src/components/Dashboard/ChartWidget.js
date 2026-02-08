import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import './DashboardWidgets.css';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler
);

const ChartWidget = ({ title, type, data, options, height = 300 }) => {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 20,
                    font: { family: "'Inter', sans-serif", size: 12 }
                }
            },
        },
        scales: type !== 'doughnut' ? {
            x: { grid: { display: false } },
            y: { grid: { borderDash: [5, 5] }, border: { display: false } }
        } : {},
        ...options
    };

    return (
        <div className="chart-widget">
            <div className="widget-header">
                <h3>{title}</h3>
                {/* Helper controls can go here, e.g., Dropdown for Week/Month */}
            </div>
            <div className="chart-container" style={{ height }}>
                {type === 'line' && <Line data={data} options={chartOptions} />}
                {type === 'bar' && <Bar data={data} options={chartOptions} />}
                {type === 'doughnut' && <Doughnut data={data} options={chartOptions} />}
            </div>
        </div>
    );
};

export default ChartWidget;
