import {Pie} from "react-chartjs-2";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { memo, useEffect, useState, useCallback } from "react";
import { Route } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import "chart.js";
import EditTimeLog from "../pages/timeLogs/EditTimeLog";
import TimeLabel from "./TimeLabel";
import ToggleButton from "./ToggleButton";
import Loading from "./Loading";

// styled-components →
const Container = styled.div`
  position: relative;
  width: 330px;
  height: 330px;
  margin: 40px auto 0 auto;
  @media(min-width: 376px) {
    width: 360px;
    height: 360px;
  }
  @media(min-width: 600px) {
    width: 440px;
    height: 440px;
  }
  @media(min-width: 600px) and (min-height: 1000px) {
    width: 570px;
    height: 570px;
  }
  @media(min-width: 900px) {
    width: 50%;
    max-width: 550px;
    height: auto;
    padding: 0;
    margin-top: 0;
  }
  @media(min-width: 900px) and (min-height: 1000px) {
    width: 750px;
    max-width: 700px;
    height: auto;
    margin: 0 auto;
  }
`;
const TimeLabelContainer = styled.div`
  width: calc(100% + 35px);
  height: calc(100% + 35px);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media (min-width: 600px) and (min-height: 1000px) {
    width: calc(100% + 50px);
    height: calc(100% + 50px);
  }
`;
const EditIcon = styled(FontAwesomeIcon)`
  font-size: 30px;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  z-index: 20;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;
const ToggleBox = styled.div`
  position: absolute;
  top: -10px;
  right: -15px;
  z-index: 20;
  border-radius: 5px;
  @media (min-width: 600px) {
    right: -50px;
  }
`;
const NoDataContainer = styled.div`
  position: relative;
  width: 100%;
  &::before {
    padding-top: 100%;
    content: "";
    display: block;
  }
`;
const NoDataTitle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border: 2px solid rgb(55, 53, 47);
  border-radius: 50%;
`;
// ← styled-components

const TimeChart = memo((props) => {

  let history = useHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [force, setForce] = useState(true);
  const changeForce = () => {
    setForce(prev => !prev);
  }
  const [display, setDisplay] = useState('24h');
  const changeDisplay = useCallback((newDisplay) => {
      setDisplay(newDisplay);
    },[]);

  let dateString = `${props.nowDay.getFullYear()},${props.nowDay.getMonth()+1},${props.nowDay.getDate()}`;

  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    axios.get(`https://kiroku-server.herokuapp.com/logs/${dateString}`,
      {
        headers: {accessToken: localStorage.getItem("accessToken")}
      }
    ).then((res) => {
      if (res.data.isInvalid) {
        history.push("/login");
      } else {
        const tmp = [];
        res.data.forEach((data) => {
          const startTimeData = data.start_time.split(",");
          const startTime = new Date(startTimeData[0], startTimeData[1]-1, startTimeData[2], startTimeData[3], startTimeData[4]);
          const finishTimeData = data.finish_time.split(",");
          const finishTime = new Date(finishTimeData[0], finishTimeData[1]-1, finishTimeData[2],finishTimeData[3], finishTimeData[4]);
          data.start_time = startTime;
          data.finish_time = finishTime;
          if (finishTime - startTime > 0) tmp.push(data);
        });
        setChartData(tmp);
      }
      setIsLoading(false);
    });
  }, [dateString, force, props.isDoing, history]);

  const noData = (
    <>
      <Container>
        {
          isLoading ? (
            <Loading />
          ) : (
            <NoDataContainer>
                <NoDataTitle>データがありません</NoDataTitle>
                <EditIcon
                  icon={faEdit}
                  onClick={() => history.push("/time-log/edit-log/top")}
                >
                </EditIcon>
            </NoDataContainer>
          )
        }
      </Container>
      <Route
        path="/time-log/edit-log"
        render={() => 
          <EditTimeLog
            chartData={chartData}
            nowDay={props.nowDay}
            changeForce={changeForce}
          />
        }
      />
    </>
  )

  if (chartData.length === 0) return noData;

  chartData.sort((a, b) => a.start_time - b.start_time);
  // アクションの開始日と終了日が異なっているときの処理 →
  if (
    chartData[0].start_time.getDate() !== props.nowDay.getDate() &&
    chartData[0].start_time.getDate() !== chartData[0].finish_time.getDate()
  ) {
    let tmp = chartData;
    const newDate = chartData[0].start_time.getDate()+1;
    tmp[0].start_time = new Date(chartData[0].start_time.getFullYear(), chartData[0].start_time.getMonth(), newDate);
    if (tmp[0].start_time - tmp[0].finish_time === 0) tmp.shift();
    if (tmp.length === 0) return noData;
    setChartData(tmp);
  }
  if (
    chartData[chartData.length-1].start_time.getDate() === props.nowDay.getDate() &&
    chartData[chartData.length-1].start_time.getDate() !== chartData[chartData.length-1].finish_time.getDate()
  ) {
    let tmp = chartData;
    const newDate = chartData[chartData.length-1].finish_time.getDate()-1;
    tmp[chartData.length-1].finish_time = new Date(chartData[chartData.length-1].finish_time.getFullYear(), chartData[chartData.length-1].finish_time.getMonth(), newDate, 23, 59);
    setChartData(tmp);
  }
  // ← アクションの開始日と終了日が異なっているときの処理

  // 空き時間を追加する処理 → 
  const makeFree = (start_time, finish_time) => {
    return {
      id: 'free',
      item_name: "空き時間",
      start_time: start_time,
      finish_time: finish_time,
      color: '#d5d5d5'
    }
  }
  const ts = chartData[0].start_time;
  if (ts - new Date(ts.getFullYear(), ts.getMonth(), ts.getDate()) > 0) {
    const free = makeFree(new Date(ts.getFullYear(), ts.getMonth(), ts.getDate()), ts);
    setChartData([...chartData, free]);
  }
  const tf = chartData[chartData.length -1].finish_time;
  if (new Date(tf.getFullYear(), tf.getMonth(), tf.getDate(), 23, 59) - tf > 4*6000) {
    const free = makeFree(tf, new Date(tf.getFullYear(), tf.getMonth(), tf.getDate(), 23, 59));
    setChartData([...chartData, free]);
  }
  for (let i = 0; i < chartData.length-1; i++) {
    const timeLog = chartData[i+1].start_time - chartData[i].finish_time;
    if (timeLog > 4) {
      const free = makeFree(chartData[i].finish_time, chartData[i+1].start_time);
      setChartData([...chartData, free]);
    }
  }
  // ← 空き時間を追加する処理

  // 合計時間を算出する処理 →
  const totalChartData = [];
  chartData.forEach((data) => {
    let time = (data.finish_time - data.start_time) / (60 * 1000);
    if (chartData[chartData.length-1] === data) time += 1;
    totalChartData.push({
      id: data.id,
      item_name: data.item_name,
      color: data.color,
      time: time
    });
  });
  loop:
  for (let i = 0; i < totalChartData.length; i++) {
    for (let j = i+1; j < totalChartData.length; j++) {
      if (
        totalChartData[i].color === totalChartData[j].color && 
        totalChartData[i].item_name === totalChartData[j].item_name
      ) {
        totalChartData[i].time += totalChartData[j].time;
        totalChartData.splice(j, 1);
        i -= 1;
        continue loop;
      }
    }
  }
  totalChartData.sort((a, b) => {
    if (a.time > b.time) return -1;
    if (a.time < b.time) return 1;
    return 0;
  });
  // ← 合計時間を算出する処理

  const times = [];
  const labels = [];
  const backgroundColors = [];
  chartData.forEach((data) => {
    let time = (data.finish_time - data.start_time) / (60 * 1000);
    if (chartData[chartData.length-1] === data) time += 1;
    times.push(time);
    labels.push(data.item_name);
    backgroundColors.push(data.color);
  });
  const data = {
    labels: labels,
    datasets: [{
      data: times,
      backgroundColor: backgroundColors,
      borderWidth: 0,
      datalabels: {
        labels: {
          data: {
            align: 'start',
            formatter: (value, context) => {
              const label = context.chart.data.labels[context.dataIndex];
              let hour = ~~(value / 60);
              const tmp = hour * 60;
              let minutes = value - tmp;
              if (hour === 0 && minutes <= 15) return null;
              hour = ("0" + hour).slice(-2);
              minutes = ("0" + minutes).slice(-2);
              if (label === "空き時間") return null;
              return `${label}\n   ${hour}:${minutes}`;
            },
          },
        }
      }
    }]
  }

  const totalLabels = [];
  const totalTimes = [];
  const totalBackgroundColors = [];
  totalChartData.forEach((data) => {
    totalLabels.push(data.item_name);
    totalTimes.push(data.time);
    totalBackgroundColors.push(data.color);
  });
  const totalData = {
    labels: totalLabels,
    datasets: [{
      data: totalTimes,
      backgroundColor: totalBackgroundColors,
      borderWidth: 0,
      datalabels: {
        labels: {
          data: {
            align: 'start',
            formatter: (value, context) => {
              const label = context.chart.data.labels[context.dataIndex];
              let hour = ~~(value / 60);
              const tmp = hour * 60;
              let minutes = value - tmp;
              hour = ("0" + hour).slice(-2);
              minutes = ("0" + minutes).slice(-2);
              return `${label}\n   ${hour}:${minutes}`;
            },
          },
        }
      }
    }]
  }

  const options = {
    plugins: {
      datalabels: {
        color: '#fff',
        textShadowBlur: 10,
        textShadowColor: 'black',
        anchor: 'end',
        font: {
          size: 10,
        },
        clamp: true,
      },
      legend: {
        display: false
      },
    }
  }

  return (
    <>
      <Container>
        {
          isLoading ? (
            <Loading />
          ) : (
            display === '24h' ? (
              <>
                <Pie
                  data={data}
                  plugins={[ChartDataLabels]}
                  options={options}
                  //className="chart24"
                />
                <TimeLabelContainer>
                  <TimeLabel />
                </TimeLabelContainer>
                <EditIcon
                  icon={faEdit} 
                  onClick={() => history.push("/time-log/edit-log/top")}
                >
                </EditIcon>
                <ToggleBox>
                  <ToggleButton
                    display={display}
                    leftContent='24h'
                    rightContent='TOTAL'
                    nowContent='24h'
                    changeDisplay={changeDisplay}
                  />
                </ToggleBox>
              </>
            ) : (
              <>
                <Pie
                  data={totalData}
                  plugins={[ChartDataLabels]}
                  options={options}
                />
                <EditIcon
                  icon={faEdit} 
                  onClick={() => history.push("/time-log/edit-log/top")}
                >
                </EditIcon>
                <ToggleBox>
                  <ToggleButton
                    display={display}
                    leftContent='24h'
                    rightContent='TOTAL'
                    nowContent='TOTAL'
                    changeDisplay={changeDisplay}
                  />
                </ToggleBox>
              </>
            )
          )
        }
      </Container>
      <Route
        path="/time-log/edit-log"
        render={() => 
          <EditTimeLog
            chartData={chartData}
            nowDay={props.nowDay}
            changeForce={changeForce}
          />
        }
      />
    </>
  );
});

export default TimeChart;