import React, { useState } from 'react';
import styled from 'styled-components';
import Display from './Display';
import Keypad from './Keypad';
import HistoryModal from './HistoryModal';

const Wrapper = styled.div`
  width: 320px;
  margin: 40px auto;
  padding: 16px;
  background: #1c1c1e;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  font-family: -apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", sans-serif;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default () => {
  const [display, setDisplay] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleButton = (value, type) => {
    if (type === 'digit' || type === 'operation') {
      setDisplay(prev => prev + value);
    } else if (type === 'clear') {
      if (value === 'C') setDisplay(prev => prev.slice(0, -1));
      else if (value === 'AC') setDisplay('');
    } else if (type === 'ask_history') {
      setIsHistoryOpen(true);
    }
  };

  const handleHistorySelect = (expression) => {
    setDisplay(expression);
    setIsHistoryOpen(false);
  };

  return (
    <Wrapper>
      <Display value={display} />
      <Keypad onButtonClick={handleButton} />
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectHistory={handleHistorySelect}
      />
    </Wrapper>
  );
};
