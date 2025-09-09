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
      const okResponse = await response.json();
      return { success: true, message: okResponse.answer };
    } else {
      const errorResponse = await response.json();
      return { success: false, message: errorResponse.message };
    }
  } catch (error) {
    return { success: false, message: "Server error" };
  } 
};

export default () => {
  const [display, setDisplay] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [bracesDiff, setBracesDiff] = useState(0);
  
  const handleButton =  async (value, type) => {
    if (type === 'send_string') {
      if (!display)
        return;

      const result = await calculateOnServer(display);  
      setDisplay(String(result.message))

      if (!result.success) {
        setTimeout(() => setDisplay(''), 1000);
      }
    } else if (type === 'digit') {
      setDisplay(prev => 
        prev.at(-1) === '0' ?
        (
          prev.length == 1 ?
          value :
          '/*+-'.includes(prev.at(-2)) ?
          prev.slice(0, -1) + value :
          prev + value
        ) :
        prev + value);
    } else if (type === 'operation') {
      setDisplay(prev => 
        prev === '0' && value === '-' ?
        value :
        prev === '0' ?
        prev :
        prev === '-' && value === '-' ?
        prev :
        prev === '-' ?
        '0' : 
        '/*+'.includes(prev.at(-1)) ? 
        prev.slice(0, -1) + value : 
        prev.at(-1) === '(' && value !== '-' ?
        prev :
        prev.at(-1) === '-' && prev.at(-2) === '(' ?
        (
          value === '-' ?
          prev : 
          prev.slice(0, -1)
        ) :
        prev + value);
    } else if (type === 'dot') {
      setDisplay(prev => 
        prev.at(-1) === ')' ? 
        prev + '*0' + value :
        '/*+-('.includes(prev.at(-1)) ? 
        prev + '0' + value : 
        prev.lastIndexOf(value) == -1 ?
        prev + value :
        prev.lastIndexOf(value) == prev.length - 1 ?
        prev :
        /^\d+$/.test(prev.slice(prev.lastIndexOf(value) + 1, -1)) ? 
        prev :
        prev + value
      )
    } else if (type == 'l_brace') {
      setDisplay(prev =>
        prev === '0' ? 
        value :
        '0123456789.'.includes(prev.at(-1)) ? 
        prev + '*' + value :
        prev + value
      )
      setBracesDiff(prev => prev + 1)
    } else if (type == 'r_brace') {
      if (bracesDiff > 0 && display.at(-1) !== '(') {
        setDisplay(prev =>
          '/*+-'.includes(prev.at(-1)) ? 
          prev.slice(0, -1) + value : 
          prev + value
        )
        setBracesDiff(prev => prev - 1)
      }
    } else if (type === 'clear') {
      if (value === 'C') {
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
      }
      else if (value === 'AC') setDisplay('0');
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
