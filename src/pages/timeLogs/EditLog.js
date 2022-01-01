import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import SelectTime from "../../components/SelectTime";
import ChoiceModal from "../../components/ChoiceModal";

// styled-components →
const Container = styled.div`
  margin: 80px 40px 0 40px;
`;
const BackBtn = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
`;
const BackIcon = styled(FontAwesomeIcon)`
  font-size: 22px;
  color: rgb(55, 53, 47);
`;
const ActionName = styled.h2`
  text-align: center;
  margin-top: 0;
`;
const Button = styled.div`
  background-color: #fff;
  border: 1px solid rgba(55, 53, 47, 0.16);
  border-radius: 5px;
  cursor: pointer;
  width: 100px;
  margin: 30px auto 0 auto;
  text-align: center;
  font-size: 15px;
  padding: 8px 0;
  &:hover{
    background-color: rgba(55, 53, 47, 0.05)
  }
`;
const DeleteBtn = styled.div`
  display: flex;
  justify-content: end;
  margin-right: 10px;
`;
const DeleteIcon = styled(FontAwesomeIcon)`
  font-size: 30px;
  opacity: 0.7;
  cursor: pointer;
  &:hover{
    opacity: 1;
  }
`;

const EditLog = (props) => {
  let history = useHistory();

  const [isOpen, setIsOpen] = useState(false);
  const changeIsOpen = () => {
    setIsOpen(prev => !prev);
  }

  useEffect(() => {
    if (props.actionName === '') history.push("/time-log/edit-log/top");
  }, [history, props.actionName]);

  const deleteRecord = () => {
    axios.delete(
      "https://kiroku-server.herokuapp.com/logs",
      {
        data: {
          id: props.editId
        }
      }
    ).then((res) => {
      setIsOpen(false);
      props.changeForce();
      history.push("/time-log/edit-log/top");
    });
  }

  return (
    <Container>
      <BackBtn onClick={() => history.goBack()}>
        <BackIcon icon={faAngleDoubleLeft}>
        </BackIcon>
      </BackBtn>
      <ActionName>{props.actionName}</ActionName>
      <SelectTime
        inpTitle="開始時間"
        hours={props.startHours}
        changeHours={props.changeStartHours}
        minutes={props.startMinutes}
        changeMinutes={props.changeStartMinutes}
      />
      <SelectTime
        inpTitle="終了時間"
        hours={props.finishHours}         
        changeHours={props.changeFinishHours}
        minutes={props.finishMinutes}
        changeMinutes={props.changeFinishMinutes}
      />
      <Button onClick={props.change}>変更</Button>
      <DeleteBtn>
        <DeleteIcon onClick={() => setIsOpen(true)} icon={faTrashAlt} />
      </DeleteBtn>
      <ChoiceModal
        title="本当に削除しますか？"
        yes="削除"
        no="キャンセル"
        isOpen={isOpen}
        cancel={changeIsOpen}
        yesEvent={deleteRecord}
      />
    </Container>
  )
}

export default EditLog;