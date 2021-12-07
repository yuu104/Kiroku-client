
import styled from "styled-components";
import Modal from "react-modal";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import CloseButton from "../components/CloseButton";
import SelectTime from "../components/SelectTime";
import axios from "axios";
import IconGrid from "../components/IconGrid";
import ChoiceModal from "../components/ChoiceModal";

Modal.setAppElement("#root");
// styled-components →
const Container = styled.div`
  position: relative;
  border-radius: 15px;
  margin-bottom: 30px;
  background-color: #fff;
  @media(min-width: 900px) {
    padding: 15px;
    height: 500px;
  }
`;
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
`;
const BackIcon = styled(FontAwesomeIcon)`
  font-size: 22px;
  cursor: pointer;
  color: #0d0d0d;
  &:hover {
    opacity: 0.8;
  }
  @media (min-width: 600px) {
    font-size: 30px;
  }
`;
const Title = styled.h2`
  text-align: center;
  font-size: 17px;
  margin: 0;
  margin-left: 25%;
  @media (min-width: 600px) {
    font-size: 25px;
  }
`;
const Ul = styled.ul`
  padding: 0;
  overflow: scroll;
  margin-bottom: 0;
  max-height: 230px;
  @media(min-width: 900px) {
    max-height: 350px;
  }
`;
const List = styled.li`
  list-style: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 10px 10px;
  margin-bottom: 5px;
  margin: 5px;
  background-color: #fff;
  border: 2px solid #0d0d0d;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;
const AddButton = styled.div`
  color: #fff;
  background-color: #0d0d0d;
  width: 60px;
  text-align: center;
  padding: 7px 0;
  border-radius: 10px;
  margin: 8px 0 0 auto;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;
const AddModalTitle = styled.h2`
  text-align: center;
  font-size: 17px;
  margin: 0;
  @media (min-width: 600px) {
    font-size: 20px;
  }
`;
const IconContainer = styled.div`
  max-height: 200px;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, 50px);
  gap: 10px;
  margin: 20px 0;
  overflow: scroll;
  z-index: 1;
  @media(min-width: 600px) {
    grid-template-columns: repeat(auto-fit, 70px);
    max-height: 250px;
  }
`;
const ActionName = styled.h2`
  text-align: center;
`;
const Button = styled.div`
  color: #fff;
  background-color: #0d0d0d;
  cursor: pointer;
  width: 100px;
  margin: 30px auto 0 auto;
  text-align: center;
  font-size: 15px;
  padding: 8px 0;
  font-weight: 600;
  &:hover{
    opacity: 0.8;
  }
`;
const DeleteIcon = styled(FontAwesomeIcon)`
  font-size: 30px;
  position: absolute;
  bottom: 55px;
  right: 55px;
  cursor: pointer;
  &:hover{
    opacity: 0.8;
  }
`;
// ← styled-components

const EditTimeRecord = (props) => {

  let history = useHistory();

  const [modalIsOpen, setIsOpen] = useState(false);
  const [addModalIsOpen, setAddIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteIsOpen] = useState(false);
  const changeDeleteIsOpen = () => {
    setDeleteIsOpen(!deleteModalIsOpen);
  }

  const [editId, setEditId] = useState();

  const filterData =  props.chartData.filter((data) => {
    return data.id !== 'free';
  });

  const [actionName, setActionName] = useState("");
  const [startHours, setStartHours] = useState();
  const changeStartHours = (newState) => {
    setStartHours(newState);
  }
  const [startMinutes, setStartMinutes] = useState();
  const changeStartMinutes = (newState) => {
    setStartMinutes(newState);
  }
  const [finishHours, setFinishHours] = useState();
  const changeFinishHours = (newState) => {
    setFinishHours(newState);
  }
  const [finishMinutes, setFinishMinutes] = useState();
  const changeFinishMinutes = (newState) => {
    setFinishMinutes(newState);
  }

  const change = () => {
    const newStartDate = new Date(props.nowDay.getFullYear(), props.nowDay.getMonth(), props.nowDay.getDate(), startHours, startMinutes);
    const newFinishDate = new Date(props.nowDay.getFullYear(), props.nowDay.getMonth(), props.nowDay.getDate(), finishHours, finishMinutes);
    let changeable = 'ok';
    for (let i = 0; i < filterData.length; i++) { 
      if (filterData[i].id === editId) continue;
      if (
        (newStartDate >= filterData[i].start_time && newStartDate < filterData[i].finish_time) || (newFinishDate > filterData[i].start_time && newFinishDate < filterData[i].finish_time)
      ) {
        changeable = 'duplicate';
        break;
      } 
    }
    if (newStartDate > new Date() || newFinishDate > new Date()) changeable = 'fast'
    if (changeable === 'ok') {
      axios.patch(
        `https://kiroku-server.herokuapp.com/logs/${editId}/edit`,
        {
          start_time: `${props.nowDay.getFullYear()},${props.nowDay.getMonth()+1},${props.nowDay.getDate()},${startHours},${startMinutes}`,
          finish_time: `${props.nowDay.getFullYear()},${props.nowDay.getMonth()+1},${props.nowDay.getDate()},${finishHours},${finishMinutes}`
        }
      ).then((res) => {
        setIsOpen(false);
        props.changeDb();
      });
    } else if (changeable === 'duplicate') {
      alert("時刻が他のアクションと重複しているため、変更できません。");
    } else if (changeable === 'fast') {
      alert("現在よりも後の時刻は記録することができません。");
    }
  }

  const [focusKey, setFocusKey] = useState();
  const [itemNamem, setItemName] = useState("");
  const [color, setColor] = useState("");
  const onClick = (action) => {
    setFocusKey(action.id);
    setItemName(action.item_name);
    setColor(action.color);
  }
  const addRecord = () => {
    const newStartDate = new Date(props.nowDay.getFullYear(), props.nowDay.getMonth(), props.nowDay.getDate(), startHours, startMinutes);
    const newFinishDate = new Date(props.nowDay.getFullYear(), props.nowDay.getMonth(), props.nowDay.getDate(), finishHours, finishMinutes);
    if (focusKey === undefined) {
      alert("アクションが選択されていません。");
      return;
    }
    if (newFinishDate -  newStartDate <= 0) {
      alert("時刻設定が正しくないため、追加できません。");
      return;
    }
    if (newStartDate > new Date() || newFinishDate > new Date()) {
      alert("現在よりも後の時刻は記録することができません。");
      return;
    }
    let addable = true;
    for (let i = 0; i < filterData.length; i++) {
      if (filterData[i].id === editId) continue;
      if (
        (newStartDate >= filterData[i].start_time && newStartDate < filterData[i].finish_time) || (newFinishDate > filterData[i].start_time && newFinishDate < filterData[i].finish_time)
      ) {
        addable = false;
        break;
      }
    }
    if (addable) {
      axios.post(
        "https://kiroku-server.herokuapp.com/logs",
        {
          item_name: itemNamem,
          color: color,
          start_time: `${props.nowDay.getFullYear()},${props.nowDay.getMonth()+1},${props.nowDay.getDate()},${startHours},${startMinutes}`,
          finish_time: `${props.nowDay.getFullYear()},${props.nowDay.getMonth()+1},${props.nowDay.getDate()},${finishHours},${finishMinutes}`
        },
        {
          headers: {accessToken: localStorage.getItem("accessToken")}
        },
      ).then((res) => {
        if (res.data.isInvalid) {
          history.push("/login");
        } else {
          setAddIsOpen(false);
          setFocusKey(undefined);
          props.changeDb();
        }
      });
    } else {
      alert("時刻が他のアクションと重複しているため、追加できません。");
    }
  }

  const deleteRecord = () => {
    axios.delete(
      "https://kiroku-server.herokuapp.com/logs",
      {
        data: {
          id: editId
        }
      }
    ).then((res) => {
      setDeleteIsOpen(false);
      setIsOpen(false);
      props.changeDb();
    });
  }

  return (
    <Container>
      <TitleContainer>
        <BackIcon
          icon={faAngleDoubleLeft}
          onClick={() => props.changeIsEditRecord(false)}
        >
        </BackIcon>
        <Title>記録の編集</Title>
      </TitleContainer>
      <Ul>
        {
          filterData.map((data) => {
            const nowStartHours = ("0" + data.start_time.getHours()).slice(-2);
            const nowStartMinutes =  ("0" + data.start_time.getMinutes()).slice(-2);
            const nowFinishHours = ("0" + data.finish_time.getHours()).slice(-2);
            const nowFinishMinutes = ("0" + data.finish_time.getMinutes()).slice(-2);
            return (
              <List
                key={data.id}
                onClick={() => {
                  setActionName(data.item_name);
                  setStartHours(nowStartHours);
                  setStartMinutes(nowStartMinutes);
                  setFinishHours(nowFinishHours);
                  setFinishMinutes(nowFinishMinutes);
                  setEditId(data.id)
                  setIsOpen(true);
                }}
              >
                <div>{data.item_name}</div>
                <div>{`${nowStartHours}:${nowStartMinutes}〜${nowFinishHours}:${nowFinishMinutes}`}</div>
              </List>
            )
          })
        }
      </Ul>
      <AddButton
        onClick={() => {
          setStartHours('00');
          setStartMinutes('00');
          setFinishHours('00');
          setFinishMinutes('00');
          setAddIsOpen(true);
        }}
      >
        追加＋
      </AddButton>

      <Modal 
        isOpen={modalIsOpen}
        className="editRecordModalContent"
        overlayClassName="editRecordModalOverlay"
      >
        <CloseButton onClick={() => setIsOpen(false)} />
        <ActionName>{actionName}</ActionName>
        <SelectTime
          inpTitle="開始時間"
          hours={startHours}
          changeHours={changeStartHours}
          minutes={startMinutes}
          changeMinutes={changeStartMinutes}
        />
        <SelectTime
          inpTitle="終了時間"
          hours={finishHours}         
          changeHours={changeFinishHours}
          minutes={finishMinutes}
          changeMinutes={changeFinishMinutes}
        />
        <Button onClick={change}>変更</Button>
        <DeleteIcon
          icon={faTrashAlt}
          onClick={() => setDeleteIsOpen(true)}
        >
        </DeleteIcon>
      </Modal>

      <Modal
        isOpen={addModalIsOpen}
        overlayClassName="addRecordModalOverlay"
        className="addRecordModalContent"
      >
        <CloseButton onClick={() => {
          setAddIsOpen(false);
          setFocusKey(undefined);
        }} 
        />
        <AddModalTitle>記録の追加</AddModalTitle>
        <IconContainer>
          <IconGrid
            focusKey={focusKey}
            onClick={onClick}
          />
        </IconContainer>
        <SelectTime
          inpTitle="開始時間"
          hours={startHours}
          changeHours={changeStartHours}
          minutes={startMinutes}
          changeMinutes={changeStartMinutes}
        />
        <SelectTime
          inpTitle="終了時間"
          hours={finishHours}         
          changeHours={changeFinishHours}
          minutes={finishMinutes}
          changeMinutes={changeFinishMinutes}
        />
        <Button onClick={addRecord}>追加</Button>
      </Modal>
      <ChoiceModal
        title="本当に削除しますか？"
        yes="削除"
        no="キャンセル"
        isOpen={deleteModalIsOpen}
        cancel={changeDeleteIsOpen}
        yesEvent={deleteRecord}
      />
    </Container>
  );

}

export default EditTimeRecord;