import {Pie} from "react-chartjs-2";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import "chart.js";
import EditTimeLog from "../pages/timeLogs/EditTimeLog";
import TimeLabel from "./TimeLabel";

// styled-components →
const Container = styled.div`
  position: relative;
  width: 330px;
  margin: 40px auto 0 auto;
  @media(min-width: 376px) {
    width: 360px;
  }
  @media(min-width: 600px) {
    width: 440px;
  }
  @media(min-width: 600px) and (min-height: 1000px) {
    width: 570px;
  }
  @media(min-width: 900px) {
    width: 50%;
    max-width: 550px;
    padding: 0;
    margin-top: 0;
  }
  @media(min-width: 900px) and (min-height: 1000px) {
    width: 750px;
    max-width: 700px;
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
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  z-index: 20;
  @media (min-width: 600px) {
    right: -50px;
  }
`;
const ToggleButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 30px;
  font-size: 10px;
  font-weight: 600;
  color: ${props => props.content === props.display ? '#42A5F5' : 'rgba(0, 0, 0, 0.54)'};
  background-color: ${props => props.content === props.display ? 'rgba(66,165,245,0.1)' : '#fff'};
  text-align: center;
  cursor: pointer;
  border-radius: ${props => props.content === '24h' ? '5px 0 0 5px' : '0 5px 5px 0'};
  &:hover {
    background-color: ${props => props.content === props.display ? 'rgba(11,114,192,0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
  @media (min-width: 600px) {
    font-size: 12px;
    width: 65px;
    height: 40px;
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

const TimeChart = (props) => {

  let history = useHistory();

  const [force, setForce] = useState(true);
  const changeForce = () => {
    setForce(!force);
  }

  const [display, setDisplay] = useState('24h');

  let dateString = `${props.nowDay.getFullYear()},${props.nowDay.getMonth()+1},${props.nowDay.getDate()}`;

  const [chartData, setChartData] = useState([]);
  useEffect(() => {
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
    });
  }, [dateString, force, props.isDoing, history]);

  const totalChartData = [];

  if (chartData.length !== 0) {
    chartData.sort((a, b) => a.start_time - b.start_time);

    // アクションの開始日と終了日が異なっているときの処理 →
    if (
      chartData[0].start_time.getDate() !== chartData[0].finish_time.getDate()
    ) {
      let tmp = chartData;
      const newDate = chartData[0].start_time.getDate()+1;
      tmp[0].start_time = new Date(chartData[0].start_time.getFullYear(), chartData[0].start_time.getMonth(), newDate);
      setChartData(tmp);
    }
    if (
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
  }

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
          times.length !== 0 ? (
            display === '24h' ? (
              <>
                <Pie
                  data={data}
                  plugins={[ChartDataLabels]}
                  options={options}
                  className="chart24"
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
                    className="border"
                    display={display}
                    content="24h"
                    onClick={() => setDisplay('24h')}
                  >
                    24h
                  </ToggleButton>
                  <ToggleButton
                    display={display}
                    content="TOTAL"
                    onClick={() => setDisplay('TOTAL')}
                  >
                    TOTAL
                  </ToggleButton>
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
                    className="border"
                    display={display}
                    content="24h"
                    onClick={() => setDisplay('24h')}
                  >
                    24h
                  </ToggleButton>
                  <ToggleButton
                    display={display}
                    content="TOTAL"
                    onClick={() => setDisplay('TOTAL')}
                  >
                    TOTAL
                  </ToggleButton>
                </ToggleBox>
              </>
            )
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
  );
}

export default TimeChart;