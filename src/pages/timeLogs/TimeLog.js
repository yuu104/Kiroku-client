import { useState, useEffect } from "react";
import {useHistory} from "react-router-dom";
import { Route } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import LogHeader from "../../components/LogHeader";
import TimeChart from "../../components/TimeChart";
import LetAction from "../../components/LetAction";
import StartAction from "../../components/StartAction";
import NowAction from "../../components/NowAction";
import IconGrid from "../../components/IconGrid";
import EditActionTop from "./EditActionTop";
import EditAction from "./EditAction";
import AddAction from "./AddAction";

// → styled-components
const Container = styled.div`
  background-color: #fff;
  overflow: hidden;
  @media(min-width: 600px) {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
  }
`;
const Content = styled.div`
  width: 100%;
`;
const FlexBox =styled.div`
  overflow: scroll;
  padding-top: 40px;
  max-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 50px;
  @media(min-width: 600px) {
    padding-top: 60px;
  }
  @media(min-width: 900px) {
    display: flex;
    padding-top: 200px;
    padding-left: 50px;
    padding-right: 50px;
  }
  @media(min-width: 900px) and (min-height: 1000px) {
    display: block;
  }
  @media(min-width: 600px) and (min-height: 1000px) {
    padding-top: 100px;
  }
`;
const ActionContainer  = styled.div`
  padding: 0 30px;
  margin-top: 15px;
  text-align: center;
  @media(min-width: 900px) {
    width: 50%;
    margin-top: 100px;
  }
  @media(min-width: 374px) and (min-height: 800px) {
    margin-top: 30px;
  }
  @media(min-width: 600px) {
    margin-top: 10px;
  }
  @media(min-width: 600px) and (min-height: 1000px) {
    width: auto;
    margin-top: 40px;
  }
`;
const IconContainer = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, 50px);
  gap: 10px;
  margin: 0;
  margin-top: 10px;
  overflow: scroll;
  z-index: 1;
  max-height: 100px;
  @media(min-width: 376px) {
    margin-top: 20px;
  }
  @media(min-width: 420px) {
    max-height: 160px;
  }
  @media(min-width: 600px) {
    grid-template-columns: repeat(auto-fit, 70px);
  }
  @media(min-width: 374px) and (min-height: 800px) {
    max-height: 230px;
  }
  @media(min-width: 374px) and (min-height: 1000px) {
    max-height: 160px;
  }
`;
const Button = styled.div`
  background-color: #fff;
  border: 1px solid rgba(55, 53, 47, 0.16);
  border-radius: 5px;
  width: 140px;
  height: 35px;
  font-size: 13px;
  margin: 0px auto;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover{
    background-color: rgba(55, 53, 47, 0.05);
  }
  @media(min-width: 420px) {
    margin-top: 30px;
  }
  @media(min-width: 600px) {
    margin-top: 10px;
  }
  @media(min-width: 900px) {
    width: 170px;
    height: 40px;
    font-size: 15px;
    margin-top: 30px;
  }
`;
// ← styled-components

const TimeLog = (props) => {

  let history = useHistory();

  const [force, setForce] = useState(true);
  const changeForce = () => {
    setForce(!force);
  }

  const [time, setTime] = useState();
  const nowTime = () => {
    const startTime = new Date();
    const year = startTime.getFullYear();
    const month = startTime.getMonth();
    const date = startTime.getDate();
    const hours = startTime.getHours();
    const minutes = startTime.getMinutes();
    const newMinutes = minutes+2-(minutes+2)%5;
    setTime(new Date(year, month, date, hours, newMinutes));
  }

  const [isOpen, setIsOpen] = useState(false);
  const changeIsOpen = () => {
    setIsOpen(!isOpen);
  }
  const [startAction, setStartAction] = useState("");
  const [startActionColor, setStartActionColor] = useState("");

  const [isDoing, setIsDoing] = useState();
  const changeIsDoing = () => {
    setIsDoing(!isDoing);
  }

  const [nowId, setNowId] = useState();
  const changeNowId = (id) => {
    setNowId(id);
  }
  
  useEffect(() => {
    axios.get("https://kiroku-server.herokuapp.com/logs",
      {
        headers: {accessToken: localStorage.getItem("accessToken")}
      }
    ).then((res) => {
      if (res.data.isInvalid) {
        history.push("/login");
      } else {
        if (res.data.length === 0) {
          setIsDoing(false);
        } else {
          setIsDoing(true);
          setStartAction(res.data[0].item_name);
          setNowId(res.data[0].id);
          setStartActionColor(res.data[0].color);
        }
      }
    });
  },[history]);


  const [isToday, setIsToday] = useState();
  const today = new Date();
  const todayString = `${today.getFullYear()}/${today.getMonth()}/${today.getDate()}`;
  const nowDayString = `${props.nowDay.getFullYear()}/${props.nowDay.getMonth()}/${props.nowDay.getDate()}`;
  useEffect(() => {
    if (todayString === nowDayString) {
      setIsToday(true);
    } else {
      setIsToday(false);
    }
  }, [nowDayString, todayString]);

  const [isMask, setIsMask] = useState()
  useEffect(() => {
    if (isDoing || !isToday) {
      setIsMask(true);
    } else {
      setIsMask(false);
    }
  }, [isDoing, isToday]);

  const onClick = (action) => {
    nowTime();
    setIsOpen(!isOpen);
    setStartAction(action.item_name);
    setStartActionColor(action.color);
  }

  return (
    <>
      <Container>
        <Content>
          <LogHeader nowDay={props.nowDay} changeDay={props.changeDay} />
          <FlexBox>
            <TimeChart
              nowDay={props.nowDay}
              isDoing={isDoing}
              changeRecordData={props.changeRecordData}
            />
            <ActionContainer>
              {
                isDoing ? (
                  <NowAction
                    startAction={startAction}
                    changeIsDoing={changeIsDoing}
                    nowId={nowId}
                    color={startActionColor}
                  />
                ) : (
                  <LetAction />
                )
              }
              <IconContainer>
                <IconGrid 
                  onClick={onClick} 
                  isMask={isMask} 
                  force={force} 
                />
              </IconContainer>
              <Button onClick={() => history.push("/time-log/edit-actions/top")}>アクションの編集</Button>
            </ActionContainer>
          </FlexBox>
        </Content>
        {
          isOpen ? (
            <StartAction
              time={time}
              name={startAction}
              color={startActionColor}
              changeIsOpen={changeIsOpen}
              changeIsDoing={changeIsDoing}
              changeNowId={changeNowId}
              nowDay={props.nowDay}
            />
          ) : (
            null
          )
        }
      </Container>

      <Route path="/time-log/edit-actions/top" component={EditActionTop} />
      <Route 
        path="/time-log/edit-actions/edit/:id" 
        render={() => <EditAction changeForce={changeForce} />}
      />
      <Route 
        path="/time-log/edit-actions/add" 
        render={() => <AddAction changeForce={changeForce} />}
      />
    </>
  );

}

export default TimeLog;