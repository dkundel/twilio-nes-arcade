import React from 'react';
import styled from 'styled-components';
import { Text } from './common';

const OrderedList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const ListEntry = styled(Text.withComponent('li'))`
  flex: 1;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.2);
  margin-top: 5px;
  margin-bottom: 5px;
  border: 2px solid #fff;
  font-size: 1.2em;
  display: flex;
  align-items: center;
`;

const ScoreEntry = ({ position, name, score }) => {
  return (
    <ListEntry>
      {position}. {name}: {score}
    </ListEntry>
  );
};

const ScoreList = ({ entries }) => {
  entries = new Array(10).fill('foo');
  return (
    <OrderedList>
      {entries.map((val, idx) => (
        <ScoreEntry key={idx} position={idx + 1} score={9001} name="Foo" />
      ))}
    </OrderedList>
  );
};

export default ScoreList;
