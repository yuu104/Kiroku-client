import styled from "styled-components";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Route } from "react-router-dom";
import axios from "axios";
import EditLog from "./EditLog";
import EditTimeLogTop from "./EditTimeLogTop";
import AddLog from "./AddLog";

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
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  padding: 30px;
  @media(min-width: 600px) {
    width: 500px;
    height: 620px;
    border-radius: 5px;
  }
`;
// ← styled-components

const EditTimeLog = (props) => {

  let history = useHistory();

  const [editId, setEditId] = useState();
  const changeEditId = (newState) => {
    setEditId(newState);
  }

  const filterData =  props.chartData.filter((data) => {
    return data.id !== 'free';
  });

  const [actionName, setActionName] = useState("");
  const changeActionName = (newState) => {
    setActionName(newState);
  }
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

  const changeTime = (sh, sm, fh, fm) => {
    setStartHours(sh);
    setStartMinutes(sm);
    setFinishHours(fh);
    setFinishMinutes(fm);
  }

  const change = () => {
    const newStartDate = new Date(props.nowDay.getFullYear(), props.nowDay.getMonth(), props.nowDay.getDate(), startHours, startMinutes);
    const newFinishDate = new Date(props.nowDay.getFullYear(), props.nowDay.getMonth(), props.nowDay.getDate(), finishHours, finishMinutes);
    let changeable = 'ok';
    for (let i = 0; i < filterData.length; i++) { 
      if (filterData[i].id === editId) continue;
      if (
        (newStartDate >= filterData[i].start_time && newStartDate < filterData[i].finish_time) || (newFinishDate > filterData[i].start_time && newFinishDate <= filterData[i].finish_time)
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
        props.changeForce();
        history.push("/time-log/edit-log/top");
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

  const add = () => {
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
    let isAdd = true;
    for (let i = 0; i < filterData.length; i++) {
      if (filterData[i].id === editId) continue;
      if (
        (newStartDate >= filterData[i].start_time && newStartDate < filterData[i].finish_time) || (newFinishDate > filterData[i].start_time && newFinishDate <= filterData[i].finish_time)
      ) {
        isAdd = false;
        break;
      }
    }
    if (isAdd) {
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
          setFocusKey(undefined);
          props.changeForce();
          history.push("/time-log/edit-log/top");
        }
      });
    } else {
      alert("時刻が他のアクションと重複しているため、追加できません。");
    }
  }

  return (
    <>
      <Overlay>
        <Container>
          <Route
            path="/time-log/edit-log/top"
            render={() => 
              <EditTimeLogTop 
                filterData={filterData}
                changeActionName={changeActionName}
                changeTime={changeTime}
                changeEditId={changeEditId}
              />
            }
          />
          <Route
            path="/time-log/edit-log/edit"
            render={() => 
              <EditLog
                actionName={actionName}
                startHours={startHours}
                finishHours={finishHours}
                changeStartHours={changeStartHours}
                changeFinishHours={changeFinishHours}
                startMinutes={startMinutes}
                finishMinutes={finishMinutes}
                changeStartMinutes={changeStartMinutes}
                changeFinishMinutes={changeFinishMinutes}
                change={change}
                editId={editId}
                changeForce={props.changeForce}
              />}
          />
          <Route
            path="/time-log/edit-log/add"
            render={() => 
              <AddLog
                focusKey={focusKey}
                onClick={onClick}
                startHours={startHours}
                startMinutes={startMinutes}
                finishHours={finishHours}
                finishMinutes={finishMinutes}
                changeStartHours={changeStartHours}
                changeStartMinutes={changeStartMinutes}
                changeFinishHours={changeFinishHours}
                changeFinishMinutes={changeFinishMinutes}
                add={add}
              />
            }
          />
        </Container>
      </Overlay>
    </>
  );
}

export default EditTimeLog;