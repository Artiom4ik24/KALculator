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

const calculateOnServer = async (expression) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/calculate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ equation: expression })
    });

    if (response.ok) {
      const answer = await response.text();
      return answer;
    } else {
      const errorResponse = await response.json();
      return errorResponse.message;
    }

  } catch (error) {
    return "Server error.";
  }
};

export default () => {
  const [display, setDisplay] = useState('');

  const handleButton =  async (value, type) => {
    if (type === 'send_string') {
      if (!display)
        return;
      try {
        const result = await calculateOnServer(display);
        setDisplay(String(result));
      } catch {
        setDisplay('Error');
        setTimeout(() => setDisplay(''), 1000)
      }
    }

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
