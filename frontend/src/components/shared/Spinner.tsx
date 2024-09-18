// components/shared/Spinner.tsx

import React from 'react'; 
import '../../styles/spinner.css';  

const Spinner: React.FC = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;
