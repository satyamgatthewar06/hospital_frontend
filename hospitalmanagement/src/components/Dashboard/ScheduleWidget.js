import React from 'react';
import './DashboardWidgets.css';

const ScheduleWidget = ({ title, events = [] }) => {
    return (
        <div className="schedule-widget">
            <div className="widget-header">
                <h3>{title}</h3>
                <button className="add-btn">+</button>
            </div>

            <div className="schedule-list">
                {events.length > 0 ? (
                    events.map((event, index) => (
                        <div key={index} className="schedule-item">
                            <div className="time-col">
                                <span className="time-start">{event.time}</span>
                            </div>
                            <div className={`event-card ${event.type}`}>
                                <h4>{event.title}</h4>
                                <p>{event.subtitle}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-events">No upcoming events</p>
                )}
            </div>
        </div>
    );
};

export default ScheduleWidget;
