import { useState } from 'react';
import { analyzeRejectReason } from './helpers.js';
import './App.css';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState({});

  function handleAnalyze() {
    const lines = input.split('\n');
    const output = {};
    for (let line of lines) {
      line = line.trim();
      if (line.length > 0) {
        output[line] = analyzeRejectReason(line);
      }
    }
    setResult(output);
  }

  const exampleReasons = [
    'Registration certificate does not match',
    'License plate number in vehicle front photo is different',
    'Vehicle photo is not the same vehicle',
    'Photocopy of registration',
    'Photo of ID Card is blurry',
    'Registration certificate and ID Card do not match',
    'Vehicle photo and registration certificate mismatch',
  ];

  function handleFillExamples() {
    setInput(exampleReasons.join('\n'));
  }

  function renderBadges(analysis) {
    const categories = [
      { key: 'registrationDoc', label: 'Registration Document' },
      { key: 'vehicleDoc', label: 'Vehicle Document' },
      { key: 'idCardDoc', label: 'ID Card' },
    ];

    return (
      <div className="badge-row">
        {categories.map((cat) => (
          <span
            key={cat.key}
            className={`badge ${analysis[cat.key] ? 'badge-yes' : 'badge-no'}`}
          >
            {cat.label}: {analysis[cat.key] ? 'Needs Update' : 'OK'}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="app-container">
      <h2 className="title">Shinra Reject Analyzer</h2>

      <div className="card">
        <textarea
          rows={6}
          className="input-box"
          placeholder="Enter reject reasons, one per line..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="button-row">
          <button className="analyze-btn" onClick={handleAnalyze}>
            Analyze
          </button>
          <button className="example-btn" onClick={handleFillExamples}>
            Fill Examples
          </button>
        </div>
      </div>

      {Object.keys(result).length > 0 && (
        <div className="card output">
          <h3>Analysis Result</h3>
          <ul className="result-list">
            {Object.entries(result).map(([reason, analysis]) => (
              <li key={reason} className="result-item">
                <p className="reason-text">{reason}</p>
                {renderBadges(analysis)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
