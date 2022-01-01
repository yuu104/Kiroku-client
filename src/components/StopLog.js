import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ChoiceModal from "./ChoiceModal";

const StopLog = (props) => {
  console.log('StopLog');
  let history = useHistory();

  const [id, setId] = useState();
  const [name, setName] = useState();
  const [color, setColor] = useState();
  const [startTime, setStartTime] = useState();

  useEffect(() => {
    axios.get("https://kiroku-server.herokuapp.com/logs",
      {
        headers: {accessToken: localStorage.getItem("accessToken")}
      }
    ).then((res) => {
      if (res.data.isInvalid) {
        history.push("/login");
      } else {
        setId(res.data[0].id);
        setName(res.data[0].item_name);
        setColor(res.data[0].color);
        const timeData = res.data[0].start_time.split(',');
        setStartTime(
          new Date(timeData[0], timeData[1]-1, timeData[2], timeData[3], timeData[4])
        );
      }
    });
  }, [history]);

  const stop = () => {
    const stopTime = new Date();
    const year = stopTime.getFullYear();
    const month = stopTime.getMonth()+1;
    const date = stopTime.getDate();
    const hours = stopTime.getHours();
    const minutes = stopTime.getMinutes();
    const newMinutes = minutes+2-(minutes+2)%5;
    const time = `${year},${month},${date},${hours},${newMinutes}`;

    if (new Date(year, month-1, date, hours, newMinutes) - startTime === 0) {
      axios.delete(`https://kiroku-server.herokuapp.com/logs`,
        {
          data: {
            id: id
          }
        }
      ).then((res) => {
        props.changeIsStopLog();
        props.changeIsDoing();
      });
    } else {
      axios.patch(`https://kiroku-server.herokuapp.com/logs/${id}/stop`,
        {
          finish_time: time
        },
        {
          headers: {accessToken: localStorage.getItem("accessToken")}
        }
      ).then((res) => {
        if (res.data.isInvalid) {
          history.push("/login");
        } else {
          props.changeIsDoing();
          props.changeIsStopLog();
        }
      });
    }
  }

  return (
    <ChoiceModal
      isOpen={props.isStopLog}
      title="記録を終了しますか？"
      no="キャンセル"
      yes="終了"
      isIcon={true}
      name={name}
      color={color}
      yesEvent={stop}
      cancel={props.changeIsStopLog}
    />
  );

}

export default StopLog;