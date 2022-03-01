import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ChoiceModal from "./ChoiceModal";

const StopLog = (props) => {

  let history = useHistory();

  const [id, setId] = useState();
  const [name, setName] = useState();
  const [color, setColor] = useState();
  const [startTime, setStartTime] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unmounted = false;
    const getLogs = async () => {
      setIsLoading(true);
      const res = await axios.get(
        'https://kiroku-server.herokuapp.com/logs', 
        { headers: {accessToken: localStorage.getItem("accessToken")} }
      );
      if (res.data.isInvalid) {
        history.push("/login");
      } else if (res.data.length === 0 && !unmounted) {
        props.changeIsDoing();
        props.changeIsStopLog();
      } else if (!unmounted) {
        setId(res.data[0].id);
        setName(res.data[0].item_name);
        setColor(res.data[0].color);
        const timeData = res.data[0].start_time.split(',');
        setStartTime(
          new Date(timeData[0], timeData[1]-1, timeData[2], timeData[3], timeData[4])
        );
      }
      setIsLoading(false);
    }
    getLogs();
    return () => unmounted = true;
  }, [history, props]);

  const stop = () => {
    setIsLoading(true);
    const stopTime = new Date();
    const year = stopTime.getFullYear();
    const month = stopTime.getMonth()+1;
    const date = stopTime.getDate();
    const hours = stopTime.getHours();
    const minutes = stopTime.getMinutes();
    const newMinutes = minutes+2-(minutes+2)%5;
    const time = `${year},${month},${date},${hours},${newMinutes}`;
    const timeDate = new Date(year, month-1, date, hours, newMinutes);

    if (timeDate - startTime === 0 || timeDate.getDate() - startTime.getDate() > 1) {
      axios.delete(`https://kiroku-server.herokuapp.com/logs`,
        {
          data: {
            id: id
          }
        }
      ).then((res) => {
        setIsLoading(false);
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
        setIsLoading(false);
        if (res.data.isInvalid) {
          history.push("/login");
        } else {
          props.changeIsStopLog();
          props.changeIsDoing();
        }
      });
    }
  }

  return (
    <ChoiceModal
      isOpen={props.isStopLog}
      isLoading={isLoading}
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