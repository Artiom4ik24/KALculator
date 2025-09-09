import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #a6a6a6;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;

  th, td {
    border: 1px solid #333;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #4d4d4d;
  }

  tr:hover {
    background-color: #a6a6a6;
    cursor: pointer;
  }
`;

const HistoryModal = ({ isOpen, onClose, onSelectHistory }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000//history/');
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Error fetching table', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2>Previous calculations</h2>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <HistoryTable>
            <thead>
              <tr>
                <th>Expression</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => onSelectHistory(item.expression)}
                >
                  <td>{item.equation}</td>
                  <td>{item.answer}</td>
                </tr>
              ))}
            </tbody>
          </HistoryTable>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default HistoryModal;