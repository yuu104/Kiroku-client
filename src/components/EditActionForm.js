import styled from "styled-components";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons";
import ChoiceModal from "./ChoiceModal";
import axios from "axios";

// styled-components →
const Overlay = styled.div`
  position: fixed;
  top: 0;
  z-index: 40;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.4);
`;
const NameLabel = styled.label`
  display: block;
  margin-bottom: 25px;
`;
const NameInp = styled.input`
  border: none;
  border-bottom: 2px solid rgb(55, 53, 47);
  width: 90%;
  height: 40px;
  outline: none;
  padding: 0;
  padding-left: 10px;
  cursor: pointer;
  font-size: 16px;
  box-sizing: border-box;
  outline: none;
  border-radius: 0;
  appearance: none;
`;
const UnderLine = styled.div`
  width: 90%;
  height: 4px;
  position: relative;
  background-color: rgb(55, 53, 47);
  top: -4px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease-out;
`;
const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffff;
  padding: 50px 30px;
  box-sizing: border-box;
  overflow: scroll;
  ${NameInp}:focus + ${UnderLine} {
    transform: scaleX(1);
  }
  @media(min-width: 600px) {
    padding-top: 20px;
    width: 400px;
    height: 600px;
    border-radius: 5px;
  }
`;
const BackBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 30px;
  height: 30px;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
`;
const BackIcon = styled(FontAwesomeIcon)`
  font-size: 22px;
`;
const ColorLabel = styled.label`
  display: block;
  margin: 20px 0 5px 0;
  @media (min-width: 600px) {
    margin: 40px 0 5px 0;
  }
`;
const ColorContainer = styled.div`
  width: 100%;
  height: 200px;
  max-height: 200px;
  overflow: scroll;
  border: 2px solid rgb(55, 53, 47);
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, 50px);
  gap: 10px;
  box-sizing: border-box;
  background-color: #fff;
  padding: 10px 0;
`;
const ColorItem = styled.div`
  cursor: pointer;
  height: 50px;
  background-color: ${props => props.color};
  border-radius: 5px;
  border: ${props => props.color === props.focusKey ? '2px solid rgb(55, 53, 47)' : 'none'};
`;
const ButtonContainer = styled.div`
  margin: 30px 0;
  display: flex;
  justify-content: center;
  position: relative;
`
const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  padding: 5px 0;
  background-color: #fff;
  border: 1px solid rgba(55, 53, 47, 0.16);
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: rgba(55, 53, 47, 0.05);
  }
`;
const DeleteButton = styled.div`
  position: absolute;
  right: 20px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
`;
const DeleteIcon = styled(FontAwesomeIcon)` 
  font-size: 30px;
  cursor: pointer;
`;
// ← styled-components

const EditActionForm = (props) => {

  let history = useHistory();

  const colors = [
    'rgb(255, 23, 68)',
    'rgb(198, 40, 40)',
    'rgb(211, 47, 47)',
    'rgb(229, 57, 53)',
    'rgb(244, 67, 54)',
    'rgb(239, 83, 80)',
    'rgb(229, 115, 115)',
    'rgb(239, 154, 154)',
    'rgb(173, 20, 87)',
    'rgb(194, 24, 91)',
    'rgb(216, 27, 96)',
    'rgb(233, 30, 99)',
    'rgb(236, 64, 122)',
    'rgb(240, 98, 146)',
    'rgb(244, 143, 177)',
    'rgb(106, 27, 154)',
    'rgb(123, 31, 162)',
    'rgb(142, 36, 170)',
    'rgb(156, 39, 176)',
    'rgb(171, 71, 188)',
    'rgb(186, 104, 200)',
    'rgb(206, 147, 216)',
    'rgb(69, 39, 160)',
    'rgb(94, 53, 177)',
    'rgb(103, 58, 183)',
    'rgb(126, 87, 194)',
    'rgb(149, 117, 205)',
    'rgb(179, 157, 219)',
    'rgb(57, 73, 171)',
    'rgb(92, 107, 192)',
    'rgb(121, 134, 203)',
    'rgb(159, 168, 218)',
    'rgb(21, 101, 192)',
    'rgb(30, 136, 229)',
    'rgb(66, 165, 245)',
    'rgb(100, 181, 246)',
    'rgb(144, 202, 249)',
    'rgb(0, 131, 143)',
    'rgb(0, 151, 167)',
    'rgb(38, 198, 218)',
    'rgb(128, 222, 234)',
    'rgb(0, 137, 123)',
    'rgb(38, 166, 154)',
    'rgb(128, 203, 196)',
    'rgb(67, 160, 71)', 
    'rgb(102, 187, 106)',
    'rgb(165, 214, 167)',
    'rgb(104, 159, 56)',
    'rgb(139, 195, 74)',
    'rgb(174, 213, 129)',
    'rgb(175, 180, 43)',
    'rgb(205, 220, 57)',
    'rgb(230, 238, 156)',
    'rgb(249, 168, 37)',
    'rgb(253, 216, 53)',
    'rgb(255, 235, 59)',
    'rgb(255, 245, 157)',
    'rgb(239, 108, 0)',
    'rgb(216, 67, 21)',
    'rgb(255, 87, 34)',
    'rgb(255, 138, 101)',
    'rgb(121, 85, 72)',
    'rgb(161, 136, 127)',
    'rgb(97, 97, 97)',
    'rgb(224, 224, 224)',
    'rgb(55, 71, 79)',
    'rgb(96, 125, 139)',
    'rgb(176, 190, 197)'
  ];

  const isEdit = props.boolean;

  const deleteAction = () => {
    axios.delete(
      "https://kiroku-server.herokuapp.com/actions",
      { 
        data: {
          id: props.id
        }
      }
    ).then((res) => {
      props.changeForce();
      history.push("/time-log/edit-actions/top");
    });
  }

  const [isOpen, setIsOpen] = useState(props.isOpen);
  const changeIsOpen = () => {
    setIsOpen(prev => !prev);
  }

  return (
    <Overlay>
      <Container>
        <BackBtn onClick={() => history.goBack()}>
          <BackIcon icon={faAngleDoubleLeft}></BackIcon>
        </BackBtn>
        <h2>{props.title}</h2>
        <NameLabel>アクション名</NameLabel>
        <NameInp
          type="text"
          value={props.name}
          onChange={(e) => props.changeName(e.target.value)}
        />
        <UnderLine></UnderLine>
        <ColorLabel>カラーの選択</ColorLabel>
        <ColorContainer>
          {
            colors.map((item) => {
              return (
                <ColorItem
                  key={item}
                  color={item}
                  focusKey={props.focusKey}
                  onClick={() => {
                    props.changeColor(item);
                    props.changeFocusKey(item);
                  }}
                >
                </ColorItem>
              );
            })
          }
        </ColorContainer>
        <ButtonContainer>
          <Button onClick={props.onClick}>{props.buttonName}</Button>
          {
            isEdit ? (
              <DeleteButton onClick={() => setIsOpen(true)}>
                <DeleteIcon icon={faTrashAlt}></DeleteIcon>
              </DeleteButton>
            ) : (
              null
            )
          }
        </ButtonContainer>
      </Container>
      <ChoiceModal
        title="本当に削除しますか？"
        yes="削除"
        no="キャンセル"
        isOpen={isOpen}
        cancel={changeIsOpen}
        yesEvent={deleteAction}
        isIcon={true}
        name={props.name}
        color={props.color}
      />
    </Overlay>
  );

}

export default EditActionForm;