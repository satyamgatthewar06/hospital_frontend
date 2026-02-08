import React, { useState, useEffect } from 'react';
import { Bell, X, AlertCircle, Package, Clock, ShieldAlert } from 'lucide-react';
import '../components/Header.css';

const NotificationCenter = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Mocking "Smart Intelligence" Alerts
        const mockAlerts = [
            {
                id: 1,
                type: 'critical',
                title: 'Low Stock Alert',
                message: 'Paracetamol 500mg is below reorder level (Active: 40 units).',
                time: '10 mins ago',
                icon: Package,
                color: '#F56565'
            },
            {
                id: 2,
                type: 'warning',
                title: 'High Wait Time',
                message: 'OPD waiting room has 12 patients. Avg wait: 45 mins.',
                time: '25 mins ago',
                icon: Clock,
                color: '#ECC94B'
            },
            {
                id: 3,
                type: 'info',
                title: 'System Maintenance',
                message: 'Scheduled backup will run at 02:00 AM tonight.',
                time: '2 hours ago',
                icon: ShieldAlert,
                color: '#4299E1'
            }
        ];

        setNotifications(mockAlerts);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="notification-dropdown">
            <div className="notification-header">
                <h3>Smart Alerts ({notifications.length})</h3>
                <button onClick={onClose} className="close-btn"><X size={18} /></button>
            </div>

            <div className="notification-list">
                {notifications.length > 0 ? (
                    notifications.map(notif => (
                        <div key={notif.id} className={`notification-item ${notif.type}`}>
                            <div className="notif-icon" style={{ backgroundColor: `${notif.color}20`, color: notif.color }}>
                                <notif.icon size={20} />
                            </div>
                            <div className="notif-content">
                                <span className="notif-title">{notif.title}</span>
                                <p className="notif-message">{notif.message}</p>
                                <span className="notif-time">{notif.time}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-notifs">
                        <Bell size={24} color="#A0AEC0" />
                        <p>No new alerts.</p>
                    </div>
                )}
            </div>

            <div className="notification-footer">
                <button className="btn-text">Mark all as read</button>
            </div>

            <style jsx>{`
        .notification-dropdown {
          position: absolute;
          top: 70px; /* Header height */
          right: 80px; /* Align with bell icon */
          width: 320px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border: 1px solid #E2E8F0;
          z-index: 1100;
          animation: slideDown 0.2s ease;
        }

        .notification-header {
          padding: 1rem;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notification-header h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #2D3748;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #A0AEC0;
        }

        .notification-list {
          max-height: 350px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          padding: 1rem;
          border-bottom: 1px solid #F7FAFC;
          gap: 1rem;
          transition: background 0.2s;
        }

        .notification-item:hover {
          background-color: #F7FAFC;
        }

        .notification-item.critical .notif-time { color: #F56565; }
        
        .notif-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notif-content {
          display: flex;
          flex-direction: column;
        }

        .notif-title {
          font-weight: 600;
          font-size: 0.9rem;
          color: #2D3748;
        }

        .notif-message {
          font-size: 0.8rem;
          color: #718096;
          margin: 2px 0;
          line-height: 1.4;
        }

        .notif-time {
          font-size: 0.7rem;
          color: #A0AEC0;
          margin-top: 4px;
        }

        .notification-footer {
          padding: 0.8rem;
          text-align: center;
          border-top: 1px solid #E2E8F0;
          background: #F8FAFC;
          border-radius: 0 0 12px 12px;
        }

        .btn-text {
          background: none;
          border: none;
          color: var(--primary);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default NotificationCenter;
