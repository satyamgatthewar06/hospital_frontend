import React, { useState, useEffect, useContext } from 'react';
import { X, Palette, Bell, User, Monitor, Settings as SettingsIcon } from 'lucide-react';
import { settingsAPI } from '../services/api';
import { HospitalContext } from '../context/HospitalContext';
import './Settings.css';

const TABS = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'display', label: 'Display', icon: Monitor },
    { id: 'system', label: 'System', icon: SettingsIcon },
];

const DEFAULT_SETTINGS = {
    // Appearance
    theme: 'light',
    colorScheme: 'blue',
    fontSize: 'medium',
    viewMode: 'comfortable',

    // Notifications
    enableNotifications: true,
    soundAlerts: true,
    desktopNotifications: false,
    emailNotifications: true,
    notificationFrequency: 'instant',

    // Profile
    displayName: 'Dr. Alfred Strange',
    email: 'alfred.strange@hospital.com',
    language: 'en',

    // Display
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    currency: 'INR',
    timezone: 'Asia/Kolkata',

    // System
    autoSave: true,
    sessionTimeout: '30',
    dataRefresh: '5',
};

const Settings = ({ isOpen, onClose }) => {
    const { currentUser } = useContext(HospitalContext);
    const [activeTab, setActiveTab] = useState('appearance');
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Load settings from API on mount
    useEffect(() => {
        if (isOpen && currentUser?.id) {
            loadSettings();
        }
    }, [isOpen, currentUser]);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const response = await settingsAPI.get(currentUser.id);
            if (response.data.data) {
                setSettings({ ...DEFAULT_SETTINGS, ...response.data.data });
            } else {
                // Use localStorage as fallback
                const savedSettings = localStorage.getItem('hospitalSettings');
                if (savedSettings) {
                    setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
                }
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            // Fallback to localStorage
            const savedSettings = localStorage.getItem('hospitalSettings');
            if (savedSettings) {
                setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
            }
        } finally {
            setLoading(false);
        }
    };

    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            if (currentUser?.id) {
                // Save to API
                await settingsAPI.save({
                    userId: currentUser.id,
                    settings: settings
                });
            }

            // Also save to localStorage as backup
            localStorage.setItem('hospitalSettings', JSON.stringify(settings));

            alert('Settings saved successfully!');
            onClose();
        } catch (error) {
            console.error('Error saving settings:', error);
            // Fallback to localStorage only
            localStorage.setItem('hospitalSettings', JSON.stringify(settings));
            alert('Settings saved locally (server unavailable)');
            onClose();
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        if (window.confirm('Are you sure you want to reset all settings to default?')) {
            try {
                if (currentUser?.id) {
                    await settingsAPI.delete(currentUser.id);
                }
                localStorage.removeItem('hospitalSettings');
                setSettings(DEFAULT_SETTINGS);
                alert('Settings reset to defaults');
            } catch (error) {
                console.error('Error resetting settings:', error);
                localStorage.removeItem('hospitalSettings');
                setSettings(DEFAULT_SETTINGS);
                alert('Settings reset locally');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="settings-overlay" onClick={onClose} />
            <div className="settings-panel">
                {/* Header */}
                <div className="settings-header">
                    <h2>Settings</h2>
                    <button className="close-btn" onClick={onClose} aria-label="Close settings">
                        <X size={24} />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="settings-tabs">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <Icon size={18} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="settings-content">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading settings...</div>
                    ) : (
                        <>
                            {activeTab === 'appearance' && (
                                <div className="settings-section">
                                    <h3>Appearance</h3>

                                    <div className="setting-item">
                                        <label>Theme</label>
                                        <select value={settings.theme} onChange={(e) => handleChange('theme', e.target.value)}>
                                            <option value="light">Light</option>
                                            <option value="dark">Dark</option>
                                            <option value="auto">Auto</option>
                                        </select>
                                    </div>

                                    <div className="setting-item">
                                        <label>Color Scheme</label>
                                        <select value={settings.colorScheme} onChange={(e) => handleChange('colorScheme', e.target.value)}>
                                            <option value="blue">Blue</option>
                                            <option value="green">Green</option>
                                            <option value="purple">Purple</option>
                                            <option value="red">Red</option>
                                        </select>
                                    </div>

                                    <div className="setting-item">
                                        <label>Font Size</label>
                                        <select value={settings.fontSize} onChange={(e) => handleChange('fontSize', e.target.value)}>
                                            <option value="small">Small</option>
                                            <option value="medium">Medium</option>
                                            <option value="large">Large</option>
                                        </select>
                                    </div>

                                    <div className="setting-item">
                                        <label>View Mode</label>
                                        <select value={settings.viewMode} onChange={(e) => handleChange('viewMode', e.target.value)}>
                                            <option value="compact">Compact</option>
                                            <option value="comfortable">Comfortable</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="settings-section">
                                    <h3>Notifications</h3>

                                    <div className="setting-item checkbox-item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={settings.enableNotifications}
                                                onChange={(e) => handleChange('enableNotifications', e.target.checked)}
                                            />
                                            <span>Enable Notifications</span>
                                        </label>
                                    </div>

                                    <div className="setting-item checkbox-item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={settings.soundAlerts}
                                                onChange={(e) => handleChange('soundAlerts', e.target.checked)}
                                            />
                                            <span>Sound Alerts</span>
                                        </label>
                                    </div>

                                    <div className="setting-item checkbox-item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={settings.desktopNotifications}
                                                onChange={(e) => handleChange('desktopNotifications', e.target.checked)}
                                            />
                                            <span>Desktop Notifications</span>
                                        </label>
                                    </div>

                                    <div className="setting-item checkbox-item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={settings.emailNotifications}
                                                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                                            />
                                            <span>Email Notifications</span>
                                        </label>
                                    </div>

                                    <div className="setting-item">
                                        <label>Notification Frequency</label>
                                        <select value={settings.notificationFrequency} onChange={(e) => handleChange('notificationFrequency', e.target.value)}>
                                            <option value="instant">Instant</option>
                                            <option value="hourly">Hourly Digest</option>
                                            <option value="daily">Daily Digest</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'profile' && (
                                <div className="settings-section">
                                    <h3>Profile</h3>

                                    <div className="setting-item">
                                        <label>Display Name</label>
                                        <input
                                            type="text"
                                            value={settings.displayName}
                                            onChange={(e) => handleChange('displayName', e.target.value)}
                                        />
                                    </div>

                                    <div className="setting-item">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={settings.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                        />
                                    </div>

                                    <div className="setting-item">
                                        <label>Language</label>
                                        <select value={settings.language} onChange={(e) => handleChange('language', e.target.value)}>
                                            <option value="en">English</option>
                                            <option value="hi">Hindi</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                        </select>
                                    </div>

                                    <div className="setting-item">
                                        <label>Change Password</label>
                                        <button className="btn-secondary">Update Password</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'display' && (
                                <div className="settings-section">
                                    <h3>Display Preferences</h3>

                                    <div className="setting-item">
                                        <label>Date Format</label>
                                        <select value={settings.dateFormat} onChange={(e) => handleChange('dateFormat', e.target.value)}>
                                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                        </select>
                                    </div>

                                    <div className="setting-item">
                                        <label>Time Format</label>
                                        <select value={settings.timeFormat} onChange={(e) => handleChange('timeFormat', e.target.value)}>
                                            <option value="12h">12 Hour</option>
                                            <option value="24h">24 Hour</option>
                                        </select>
                                    </div>

                                    <div className="setting-item">
                                        <label>Currency</label>
                                        <select value={settings.currency} onChange={(e) => handleChange('currency', e.target.value)}>
                                            <option value="INR">INR (₹)</option>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                        </select>
                                    </div>

                                    <div className="setting-item">
                                        <label>Timezone</label>
                                        <select value={settings.timezone} onChange={(e) => handleChange('timezone', e.target.value)}>
                                            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                            <option value="America/New_York">America/New York (EST)</option>
                                            <option value="Europe/London">Europe/London (GMT)</option>
                                            <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'system' && (
                                <div className="settings-section">
                                    <h3>System Settings</h3>

                                    <div className="setting-item checkbox-item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={settings.autoSave}
                                                onChange={(e) => handleChange('autoSave', e.target.checked)}
                                            />
                                            <span>Auto-save Changes</span>
                                        </label>
                                    </div>

                                    <div className="setting-item">
                                        <label>Session Timeout (minutes)</label>
                                        <input
                                            type="number"
                                            value={settings.sessionTimeout}
                                            onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                                            min="5"
                                            max="120"
                                        />
                                    </div>

                                    <div className="setting-item">
                                        <label>Data Refresh Interval (minutes)</label>
                                        <input
                                            type="number"
                                            value={settings.dataRefresh}
                                            onChange={(e) => handleChange('dataRefresh', e.target.value)}
                                            min="1"
                                            max="60"
                                        />
                                    </div>

                                    <div className="setting-item">
                                        <label>Export Settings</label>
                                        <button className="btn-secondary" onClick={() => {
                                            const dataStr = JSON.stringify(settings, null, 2);
                                            const dataBlob = new Blob([dataStr], { type: 'application/json' });
                                            const url = URL.createObjectURL(dataBlob);
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.download = 'hospital-settings.json';
                                            link.click();
                                        }}>
                                            Download Settings
                                        </button>
                                    </div>

                                    <div className="setting-item">
                                        <label>Reset Settings</label>
                                        <button className="btn-danger" onClick={handleReset}>
                                            Reset to Defaults
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="settings-footer">
                    <button className="btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
                    <button className="btn-primary" onClick={handleSave} disabled={saving || loading}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Settings;
