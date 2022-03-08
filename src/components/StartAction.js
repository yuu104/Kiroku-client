import styled from "styled-components";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import CloseButton from "./CloseButton";
import SelectTime from "./SelectTime";
import Loading from "./Loading";

// styled-components →
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
  @media (min-width: 600px) {
    width: 400px;
  }
`;

const ActionName = styled.h2`
  text-align: center;
`;

const Button = styled.div`
  border: 1px solid rgba(55, 53, 47, 0.16);
  border-radius: 5px;
  cursor: pointer;
  width: 120px;
  text-align: center;
  font-size: 15px;
  padding: 10px 0;
  margin: 30px auto 0 auto;
  background-color: #fff;
  &:hover {
    background-color: rgba(55, 53, 47, 0.16);
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
  };

  const [isLoading, setIsLoading] = useState(true);
  const [startHours, setStartHours] = useState(
    alignment(props.time.getHours())
  );
  const [startMinutes, setStartMinutes] = useState(
    alignment(props.time.getMinutes())
  );
  const [finishTimes, setFinishTimes] = useState([]);
  const dateString = `${props.nowDay.getFullYear()},${
    props.nowDay.getMonth() + 1
  },${props.nowDay.getDate()}`;
  useEffect(() => {
    let unmounted = false;
    const getData = async () => {
      const getNowLog = axios.get("https://kiroku-server.herokuapp.com/logs", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      });
      const getLogs = axios.get(
        `https://kiroku-server.herokuapp.com/logs/${dateString}`,
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );
      const nowLogData = await getNowLog;
      const LogsData = await getLogs;
      if (nowLogData.data.isInvalid || LogsData.data.isInvalid) {
        history.push("/login");
      } else if (nowLogData.data.length !== 0 && !unmounted) {
        props.changeIsDoing();
        props.changeStartAction(nowLogData.data[0].item_name);
        props.changeStartActionColor(nowLogData.data[0].color);
        props.changeIsOpen();
      } else {
        const tmp = [];
        LogsData.data.forEach((data) => {
          const finishTimeData = data.finish_time.split(",");
          const finishTime = new Date(
            finishTimeData[0],
            finishTimeData[1] - 1,
            finishTimeData[2],
            finishTimeData[3],
            finishTimeData[4]
          );
          tmp.push(finishTime);
        });
        if (!unmounted) setFinishTimes(tmp);
      }
      setIsLoading(false);
    };
    getData();
    return () => (unmounted = true);
  }, [history, props, dateString]);

  const start = () => {
    setIsLoading(true);
    const date = `${props.time.getFullYear()},${
      props.time.getMonth() + 1
    },${props.time.getDate()},${startHours},${startMinutes}`;
    finishTimes.sort((a, b) => {
      return a < b ? 1 : -1;
    });
    const dates = date.split(",");
    const nowDate = new Date(
      dates[0],
      dates[1] - 1,
      dates[2],
      dates[3],
      dates[4]
    );
    if (finishTimes[0] > nowDate) {
      alert("この時刻からは開始できません。");
      return;
    }
    axios
      .post(
        "https://kiroku-server.herokuapp.com/logs",
        {
          item_name: props.name,
          color: props.color,
          start_time: date,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((res) => {
        setIsLoading(false);
        if (res.data.isInvalid) {
          history.push("/login");
        } else {
          props.changeIsOpen();
          props.changeIsDoing();
        }
      });
  };

  return (
    <Overlay>
      <Container>
        {isLoading ? (
          <Loading />
        ) : (
          <>
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
          </>
        )}
      </Container>
    </Overlay>
  );
};

export default StartAction;
