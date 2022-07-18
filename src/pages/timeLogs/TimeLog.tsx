import { useState, useEffect } from 'react'
import { useHistory, Route } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'
import LogHeader from '../../components/LogHeader'
import TimeChart from '../../components/TimeChart'
import LetAction from '../../components/LetAction'
import StartAction from '../../components/StartAction'
import NowAction from '../../components/NowAction'
import IconGrid from '../../components/IconGrid'
import EditActionTop from './EditActionTop'
import EditAction from './EditAction'
import AddAction from './AddAction'
import StopLog from '../../components/StopLog'

// → styled-components
const Container = styled.div`
  background-color: #fff;
  overflow: hidden;
  @media (min-width: 600px) {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
  }
`
const Content = styled.div`
  width: 100%;
`
const FlexBox = styled.div`
  overflow: scroll;
  padding-top: 40px;
  max-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 50px;
  @media (min-width: 600px) {
    padding-top: 60px;
  }
  @media (min-width: 900px) {
    display: flex;
    padding-top: 180px;
    padding-left: 50px;
    padding-right: 50px;
  }
  @media (min-width: 900px) and (min-height: 1000px) {
    display: block;
  }
  @media (min-width: 600px) and (min-height: 1000px) {
    padding-top: 100px;
  }
`
const ActionContainer = styled.div`
  padding: 0 30px;
  margin-top: 15px;
  text-align: center;
  @media (min-width: 900px) {
    width: 40%;
    margin-top: 100px;
  }
  @media (min-width: 374px) and (min-height: 800px) {
    margin-top: 30px;
  }
  @media (min-width: 600px) {
    margin-top: 10px;
  }
  @media (min-width: 600px) and (min-height: 1000px) {
    width: auto;
    margin-top: 40px;
  }
`
const IconContainer = styled.div`
  position: relative;
  height: 100px;
  margin: 10px 0 0 0;
  @media (min-width: 376px) {
    margin-top: 20px;
  }
  @media (min-width: 420px) {
    height: 160px;
  }
  @media (min-width: 374px) and (min-height: 800px) {
    height: 230px;
  }
  @media (min-width: 374px) and (min-height: 1000px) {
    height: 160px;
  }
`
const GridContainer = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, 50px);
  grid-auto-rows: 50px;
  gap: 10px;
  overflow: scroll;
  z-index: 1;
  height: 100%;
  @media (min-width: 600px) {
    grid-template-columns: repeat(auto-fit, 70px);
    grid-auto-rows: 70px;
  }
`
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
  &:hover {
    background-color: rgba(55, 53, 47, 0.05);
  }
  @media (min-width: 420px) {
    margin-top: 30px;
  }
  @media (min-width: 600px) {
    margin-top: 10px;
  }
  @media (min-width: 900px) {
    width: 170px;
    height: 40px;
    font-size: 15px;
    margin-top: 30px;
  }
`
// ← styled-components

type Props = {
  nowDay: Date
  changeDay: (key: string | Date | null) => void
}

const TimeLog: React.FC<Props> = ({ nowDay, changeDay }) => {
  const history = useHistory()

  const [force, setForce] = useState<boolean>(true)
  const changeForce = () => {
    setForce((prev) => !prev)
  }

  const [isStopLog, setIsStopLog] = useState<boolean>(false)
  const changeIsStopLog = () => {
    setIsStopLog((prev) => !prev)
  }

  const nowTime = () => {
    const startTime = new Date()
    const year = startTime.getFullYear()
    const month = startTime.getMonth()
    const date = startTime.getDate()
    const hours = startTime.getHours()
    const minutes = startTime.getMinutes()
    const newMinutes = minutes + 2 - ((minutes + 2) % 5)
    return new Date(year, month, date, hours, newMinutes)
  }
  const [time, setTime] = useState<Date>(nowTime())

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const changeIsOpen = () => {
    setIsOpen((prev) => !prev)
  }
  const [startAction, setStartAction] = useState('')
  const changeStartAction = (state: string) => {
    setStartAction(state)
  }
  const [startActionColor, setStartActionColor] = useState('')
  const changeStartActionColor = (state: string) => {
    setStartActionColor(state)
  }
  const [isDoing, setIsDoing] = useState<boolean>(false)
  const changeIsDoing = () => {
    setIsDoing((prev: boolean) => !prev)
  }

  useEffect(() => {
    axios
      .get<LoggingData[] & { isInvalid?: boolean }>(
        'http://localhost:3001/logs',
        {
          headers: { accessToken: localStorage.getItem('accessToken') },
        }
      )
      .then((res) => {
        if (res.data.isInvalid) {
          history.push('/login')
        } else if (res.data.length === 0) {
          setIsDoing(false)
        } else {
          setIsDoing(true)
          setStartAction(res.data[0].item_name)
          setStartActionColor(res.data[0].color)
        }
      })
  }, [history])

  const [isToday, setIsToday] = useState<boolean>()
  const today = new Date()
  const todayString = `${today.getFullYear()}/${today.getMonth()}/${today.getDate()}`
  const nowDayString = `${nowDay.getFullYear()}/${nowDay.getMonth()}/${nowDay.getDate()}`
  useEffect(() => {
    if (todayString === nowDayString) {
      setIsToday(true)
    } else {
      setIsToday(false)
    }
  }, [nowDayString, todayString])

  const [isMask, setIsMask] = useState<boolean>()
  useEffect(() => {
    if (isDoing || !isToday) {
      setIsMask(true)
    } else {
      setIsMask(false)
    }
  }, [isDoing, isToday])

  const onClick = (action: ActionData) => {
    setTime(nowTime())
    nowTime()
    setIsOpen(true)
    setStartAction(action.item_name)
    setStartActionColor(action.color)
  }

  return (
    <>
      <Container>
        <Content>
          <LogHeader nowDay={nowDay} changeDay={changeDay} />
          <FlexBox>
            <TimeChart nowDay={nowDay} isDoing={isDoing} />
            <ActionContainer>
              {isDoing ? (
                <NowAction
                  startAction={startAction}
                  color={startActionColor}
                  changeIsStopLog={changeIsStopLog}
                />
              ) : (
                <LetAction />
              )}
              <IconContainer>
                <GridContainer>
                  <IconGrid onClick={onClick} isMask={isMask} force={force} />
                </GridContainer>
              </IconContainer>
              <Button
                onClick={() => history.push('/time-log/edit-actions/top')}
              >
                アクションの編集
              </Button>
            </ActionContainer>
          </FlexBox>
        </Content>
      </Container>
      {isOpen ? (
        <StartAction
          time={time}
          name={startAction}
          color={startActionColor}
          changeIsOpen={changeIsOpen}
          changeIsDoing={changeIsDoing}
          nowDay={nowDay}
          changeStartAction={changeStartAction}
          changeStartActionColor={changeStartActionColor}
        />
      ) : null}
      {isStopLog ? (
        <StopLog
          changeIsDoing={changeIsDoing}
          isStopLog={isStopLog}
          changeIsStopLog={changeIsStopLog}
        />
      ) : null}

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
  )
}

export default TimeLog
