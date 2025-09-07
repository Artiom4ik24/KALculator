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
  const [display, setDisplay] = useState('0');

  const handleButton = (value, type) => {
    if (type === 'digit') {
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
        '/*+-'.includes(prev.at(-1)) ? 
        prev.slice(0, -1) + value : 
        prev + value);
    } else if (type === 'dot') {
      setDisplay(prev => 
        '/*+-'.includes(prev.at(-1)) ? 
        prev + '0' + value : 
        prev.lastIndexOf(value) == -1 ?
        prev + value :
        prev.lastIndexOf(value) == prev.length - 1 ?
        prev :
        /^\d+$/.test(prev.slice(prev.lastIndexOf(value) + 1, -1)) ? 
        prev :
        prev + value
      )
    } else if (type === 'clear') {
      if (value === 'C') {
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        if (prev === '') setDisplay('0');
      }
      else if (value === 'AC') setDisplay('0');
    }
  };

  return (
    <Wrapper>
      <Display value={display} />
      <Keypad onButtonClick={handleButton} />
    </Wrapper>
  );
};
