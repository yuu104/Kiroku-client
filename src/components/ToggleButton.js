import { memo } from "react";
import styled from "styled-components";

// styled-components →
const Container = styled.div`
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 5px;
`;
const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 30px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  color: ${(props) =>
    props.content === props.display ? "#42A5F5" : "rgba(0, 0, 0, 0.54)"};
  background-color: ${(props) =>
    props.content === props.display ? "rgba(66,165,245,0.1)" : "#fff"};
  border-radius: ${(props) => (props.isLeft ? "5px 0 0 5px" : "0 5px 5px 0")};
  &:hover {
    background-color: ${(props) =>
      props.content === props.display
        ? "rgba(11,114,192,0.1)"
        : "rgba(0, 0, 0, 0.05)"};
  }
  @media (min-width: 600px) {
    font-size: 12px;
    width: 65px;
    height: 40px;
  }
`;
// ← styled-components

const ToggleButton = memo((props) => {
  return (
    <Container>
      <Button
        className="border"
        display={props.display}
        content={props.leftContent}
        isLeft={true}
        onClick={() => props.changeDisplay(props.leftContent)}
      >
        {props.leftContent}
      </Button>
      <Button
        display={props.display}
        content={props.rightContent}
        onClick={() => props.changeDisplay(props.rightContent)}
      >
        {props.rightContent}
      </Button>
    </Container>
  );
});

export default ToggleButton;
