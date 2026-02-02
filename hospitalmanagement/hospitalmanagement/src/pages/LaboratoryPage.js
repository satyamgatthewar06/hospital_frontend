import React, { useState } from 'react';
import AssignTests from '../components/Laboratory/AssignTests';
import UploadResults from '../components/Laboratory/UploadResults';
import PrintReports from '../components/Laboratory/PrintReports';
import '../styles/Laboratory.css';

const LaboratoryPage = () => {
  const [tab, setTab] = useState('assign');

  return (
    <div className="page laboratory-page">
      <h2>Laboratory</h2>

      <div className="lab-tabs">
        <button className={tab === 'assign' ? 'active' : ''} onClick={() => setTab('assign')}>Assign Tests</button>
        <button className={tab === 'upload' ? 'active' : ''} onClick={() => setTab('upload')}>Upload Results</button>
        <button className={tab === 'print' ? 'active' : ''} onClick={() => setTab('print')}>Print Reports</button>
      </div>

      <div className="lab-content">
        {tab === 'assign' && <AssignTests />}
        {tab === 'upload' && <UploadResults />}
        {tab === 'print' && <PrintReports />}
      </div>
    </div>
  );
};

export default LaboratoryPage;
