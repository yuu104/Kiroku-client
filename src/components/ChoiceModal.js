import Modal from "react-modal";
import styled from "styled-components";
import ActionIcon from "./ActionIcon";

// styled-components →
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
  border: 2px solid #0d0d0d;
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

Modal.setAppElement("#root");

const ChoiceModal = (props) => {

  return(
    <Modal
      isOpen={props.isOpen}
      className="modalContent"
      overlayClassName="modalOverlay"
    >
      <Title>{props.title}</Title>
      {
        props.isIcon ? (
          <Icon>
            <ActionIcon name={props.name} color={props.color} />
          </Icon>
        ) : (
          null
        )
      }
      <ButtonContainer>
        <Button onClick={props.cancel}>{props.no}</Button>
        <Button onClick={props.yesEvent}>{props.yes}</Button>
      </ButtonContainer>
    </Modal>
  )

}

export default ChoiceModal;