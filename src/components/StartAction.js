import styled from "styled-components";
import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom";
import axios from "axios";
import CloseButton from "./CloseButton";
import SelectTime from "./SelectTime";

// styled-components →
const Overlay = styled.div`
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
`;

const Container = styled.div`
  width: 95%;
  height: 300px;
  background-color: #ffff;
  border-radius: 5px;
  padding: 20px;
  box-sizing: border-box;
  @media(min-width: 600px) {
    width: 400px;
  }
`;

const ActionName = styled.h2`
  text-align: center;
`;

const Button = styled.div`
  border: 2px solid #0d0d0d;
  cursor: pointer;
  width: 120px;
  text-align: center;
  font-size: 15px;
  padding: 10px 0;
  margin: 30px auto 0 auto;
  font-weight: 600;
  color: #fff;
  background-color: #0d0d0d;
  &:hover {
    opacity: 0.8;
  }
`;
// ← styled-components

const StartAction = (props) => {

  let history = useHistory();

  const alignment = (num) => {
    if (num > 9) {
      return num;
    } else {
      return `0${num}`;
    }
  }

  const [startHours, setStartHours] = useState(alignment(props.time.getHours()));
  const [startMinutes, setStartMinutes] = useState(alignment(props.time.getMinutes()));

  const [finishTimes, setFinishTimes] = useState([]);

  const dateString = `${props.nowDay.getFullYear()},${props.nowDay.getMonth()+1},${props.nowDay.getDate()}`;

useEffect(() => {
  axios.get(`https://kiroku-server.herokuapp.com/timeLog/timeChart/${dateString}`, 
    {
      headers: {accessToken: localStorage.getItem("accessToken")}
    }
  ).then((res) => {
    if (res.data.isInvalid) {
      history.push("/login");
    } else {
      const tmp = [];
      res.data.forEach((data) => {
        const finishTimeData = data.finish_time.split(",");
        const finishTime = new Date(finishTimeData[0], finishTimeData[1]-1, finishTimeData[2],finishTimeData[3], finishTimeData[4]);
        tmp.push(finishTime);
      });
      setFinishTimes(tmp);
    }
  });
},[history, dateString]);

  const start = () => {
    const date = `${props.time.getFullYear()},${props.time.getMonth()+1},${props.time.getDate()},${startHours},${startMinutes}`

    finishTimes.sort((a, b) => {
      return (a < b ? 1 : -1);
    });
    const dates = date.split(',');
    const nowDate = new Date(dates[0], dates[1]-1, dates[2], dates[3], dates[4]);
    if (finishTimes[0] > nowDate) {
      alert("この時刻からは開始できません。");
      return;
    }
    
    axios.post("https://kiroku-server.herokuapp.com/timeLog/start",
      {
        item_name: props.name,
        color: props.color,
        start_time: date,
      },
      {
        headers: {accessToken: localStorage.getItem("accessToken")}
      }
    ).then((res) => {
      if (res.data.isInvalid) {
        history.push("/login");
      } else {
        props.changeNowId(res.data.insertId);
        props.changeIsOpen();
        props.changeIsDoing();
      }
    });
  }

  return (
    <Overlay>
      <Container>
        <CloseButton onClick={props.changeIsOpen} />
        <ActionName>{props.name}</ActionName>
        <SelectTime
          inpTitle="開始時間"
          hours={startHours}
          changeHours={(e) => setStartHours(e)}
          minutes={startMinutes}
          changeMinutes={(e) => setStartMinutes(e)}
        />
        <Button onClick={start}>開始</Button>
      </Container>
    </Overlay>
  );
}

export default StartAction;