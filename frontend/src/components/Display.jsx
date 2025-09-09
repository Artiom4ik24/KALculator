import React from 'react';
import styled from 'styled-components';

const StyledDisplay = styled.input.attrs({ type: 'text', readOnly: true })`
  width: 100%;
  height: 80px;
  background: #1c1c1e;
  color: #fff;
  font-size: 2.5rem;
  text-align: right;
  border: none;
  outline: none;
  margin-bottom: 12px;
  padding-right: 12px;
`;

export default ({ value }) => <StyledDisplay value={value} />;
