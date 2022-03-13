import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopCircle } from "@fortawesome/free-regular-svg-icons";

// styled-components →
const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  @media (min-width: 600px) {
    width: 370px;
  }
`;

const Desc = styled.div`
  font-size: 13px;
  text-align: left;
  opacity: 0.5;
  @media (min-width: 900px) {
    padding-left: 50px;
  }
`;

const Action = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  border-bottom: 2px solid;
  border-color: ${(props) => props.color};
  @media (min-width: 900px) {
    margin: 0 50px;
  }
`;

const Mark = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: ${(props) => props.color};
`;

const Name = styled.p`
  margin: 0;
  font-size: 20px;
`;

const StopBox = styled.div`
  margin-left: auto;
  margin-right: 10px;
`;

const Stop = styled(FontAwesomeIcon)`
  font-size: 25px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;
// ← styled-components

const NowAction = (props) => {
  return (
    <Container>
      <Desc>実行中のアクション</Desc>
      <Action color={props.color}>
        <Mark color={props.color}></Mark>
        <Name>{props.startAction}</Name>
        <StopBox onClick={props.changeIsStopLog}>
          <Stop icon={faStopCircle}></Stop>
        </StopBox>
      </Action>
    </Container>
  );
};

export default NowAction;
