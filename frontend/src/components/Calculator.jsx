import React, { useState } from 'react';
import styled from 'styled-components';
import Display from './Display';
import Keypad from './Keypad';

const Wrapper = styled.div`
  width: 320px;
  margin: 40px auto;
  padding: 16px;
  background: #1c1c1e;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  font-family: -apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", sans-serif;
`;

export default () => {
  const [display, setDisplay] = useState('');

  const handleButton = (value, type) => {
    if (type === 'digit' || type === 'operation') {
      setDisplay(prev => prev + value);
    } else if (type === 'clear') {
      if (value === 'C') setDisplay(prev => prev.slice(0, -1));
      else if (value === 'AC') setDisplay('');
    }
  };

  return (
    <Wrapper>
      <Display value={display} />
      <Keypad onButtonClick={handleButton} />
    </Wrapper>
  );
};
