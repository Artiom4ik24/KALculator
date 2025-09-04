import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  font-size: 1.5rem;
  padding: 16px;
  background: ${props =>
    props.variant === 'operation' || props.variant === 'send_string' ? '#ff9500'
      : props.variant === 'clear' || props.variant === 'reverse' ? '#a6a6a6'
      : '#333'};
  color: ${props => '#fff'};
  border: none;
  border-radius: 50%;
  transition: background 0.1s;
  &:active {
    background: ${props =>
      props.variant === 'operation' || props.variant === 'send_string' ? '#ff9500'
      : props.variant === 'clear' || props.variant === 'reverse' ? '#a6a6a6'
      : '#4d4d4d'};
  }
  &:disabled {
    background: #555; color: #777;
  }
`;

export default ({ label, variant, onClick, disabled }) => (
  <StyledButton variant={variant} onClick={onClick} disabled={disabled}>
    {label}
  </StyledButton>
);
