import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

export default ({ onButtonClick }) => {
  const buttons = [
    { label: 'AC', type: 'clear' },
    { label: 'C', type: 'clear' },
    { label: '±', type: 'reverse' },
    { label: '÷', type: 'operation', value: '/' },
    { label: '7', type: 'digit' },
    { label: '8', type: 'digit' },
    { label: '9', type: 'digit' },
    { label: '×', type: 'operation', value: '*' },
    { label: '4', type: 'digit' },
    { label: '5', type: 'digit' },
    { label: '6', type: 'digit' },
    { label: '−', type: 'operation', value: '-' },
    { label: '1', type: 'digit' },
    { label: '2', type: 'digit' },
    { label: '3', type: 'digit' },
    { label: '+', type: 'operation', value: '+' },
    { label: 'H', type: 'ask_history' },
    { label: '0', type: 'digit' },
    { label: '.', type: 'dot' },
    { label: '=', type: 'send_string' },
  ];

  return (
    <Grid>
      {buttons.map((btn, i) => (
        <Button
          key={i}
          label={btn.label}
          variant={btn.type === 'operation' ? 'operation'
            : btn.type === 'clear' ? 'clear'
            : btn.type === 'send_string' ? 'send_string'
            : btn.type === 'reverse' ? 'reverse'
            : btn.type === 'dot' ? 'dot'
            : 'digit'}
          onClick={() => onButtonClick(btn.value ?? btn.label, btn.type)}
        />
      ))}
    </Grid>
  );
};
