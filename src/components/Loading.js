import React from 'react';
import ReactLoading from 'react-loading';
import styled from 'styled-components';

// styled-components →
const Container = styled.div`
  position: ${props => props.isLoading ? 'absolute': 'static'};
  top: ${props => props.isLoading ? '0': 'auto'};
  left: ${props => props.isLoading ? '0': 'auto'};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
// ← styled-components

const Loading = (props) => {
  return (
    <Container isLoading={props.isLoading} >
      <ReactLoading type='spin' color='rgba(0, 0, 0, 0.15)' width={30} height={30} />
    </Container>
  )
}

export default Loading