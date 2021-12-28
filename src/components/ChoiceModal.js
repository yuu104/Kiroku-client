import styled from "styled-components";
import ActionIcon from "./ActionIcon";

// styled-components →
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 40;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
`;
const Container = styled.div`
  width: 300px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
`;
const Title = styled.h3`
  font-size: 18px;
  text-align: center;
  margin-bottom: 30px;
`;
const Icon = styled.div`
  width: 70px;
  height: 70px;
  margin: 0 auto;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
`;
const Button = styled.div`
  width: 95px;
  height: 35px;
  font-size: 15px;
  border: 2px solid rgb(55, 53, 47);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;
// ← styled-components

const ChoiceModal = (props) => {

  return(
    props.isOpen ? (
      <Overlay>
        <Container>
          <Title>{props.title}</Title>
          {
            props.isIcon ? (
              <Icon>
                <ActionIcon name={props.name} color={props.color} />
              </Icon>
            ) : null
          }
          <ButtonContainer>
              <Button onClick={props.cancel}>{props.no}</Button>
              <Button onClick={props.yesEvent}>{props.yes}</Button>
          </ButtonContainer>
        </Container>
      </Overlay>
    ) : null
  )
}

export default ChoiceModal;