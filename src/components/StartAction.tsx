import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import CloseButton from './CloseButton'
import SelectTime from './SelectTime'
import Loading from './Loading'

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
`
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
`
const ActionName = styled.h2`
  text-align: center;
`
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
`
// ← styled-components

type Props = {
  time: Date
  name: string
  color: string
  changeIsOpen: () => void
  changeIsDoing: () => void
  nowDay: Date
  changeStartAction: (newState: string) => void
  changeStartActionColor: (newState: string) => void
}

const StartAction: React.FC<Props> = ({
  time,
  name,
  color,
  changeIsDoing,
  changeIsOpen,
  nowDay,
  changeStartAction,
  changeStartActionColor,
}) => {
  const history = useHistory()

  const [isLoading, setIsLoading] = useState(true)
  const [startHours, setStartHours] = useState(time.getHours())
  const changeStartHours = (newState: number) => {
    setStartHours(newState)
  }
  const [startMinutes, setStartMinutes] = useState(time.getMinutes())
  const changeStartMinutes = (newState: number) => {
    setStartMinutes(newState)
  }
  const [finishTimes, setFinishTimes] = useState<Date[]>([])
  const dateString = `${nowDay.getFullYear()},${
    nowDay.getMonth() + 1
  },${nowDay.getDate()}`

  useEffect((): (() => void) => {
    let unmounted = false
    const getData = async () => {
      const getNowLog = axios.get<LoggingData[] & { isInvalid?: boolean }>(
        'https://kiroku-server.herokuapp.com/logs',
        {
          headers: { accessToken: localStorage.getItem('accessToken') },
        }
      )
      const getLogs = axios.get<LogedData[] & { isInvalid?: boolean }>(
        `https://kiroku-server.herokuapp.com/logs/${dateString}`,
        {
          headers: { accessToken: localStorage.getItem('accessToken') },
        }
      )
      const nowLogData = (await getNowLog).data
      const LogsData = (await getLogs).data
      if (nowLogData.isInvalid || LogsData.isInvalid) {
        history.push('/login')
      } else if (nowLogData.length !== 0 && !unmounted) {
        changeIsDoing()
        changeStartAction(nowLogData[0].item_name)
        changeStartActionColor(nowLogData[0].color)
        changeIsOpen()
      } else {
        const tmp: Date[] = []
        LogsData.forEach((data: LogedData) => {
          const finishTimeData = data.finish_time.split(',')
          const finishTime = new Date(
            Number(finishTimeData[0]),
            Number(finishTimeData[1]) - 1,
            Number(finishTimeData[2]),
            Number(finishTimeData[3]),
            Number(finishTimeData[4])
          )
          tmp.push(finishTime)
        })
        if (!unmounted) setFinishTimes(tmp)
      }
      setIsLoading(false)
    }
    getData()
    return () => (unmounted = true)
  }, [
    history,
    dateString,
    changeIsDoing,
    changeIsOpen,
    changeStartAction,
    changeStartActionColor,
  ])

  const start = () => {
    setIsLoading(true)
    const date = `${time.getFullYear()},${
      time.getMonth() + 1
    },${time.getDate()},${startHours},${startMinutes}`
    finishTimes.sort((a, b) => (a < b ? 1 : -1))
    const dates = date.split(',')
    const dateObj = new Date(
      Number(dates[0]),
      Number(dates[1]) - 1,
      Number(dates[2]),
      Number(dates[3]),
      Number(dates[4])
    )
    if (finishTimes[0] > dateObj) {
      alert('この時刻からは開始できません。')
      return
    }
    axios
      .post(
        'https://kiroku-server.herokuapp.com/logs',
        {
          item_name: name,
          color: color,
          start_time: date,
        },
        {
          headers: { accessToken: localStorage.getItem('accessToken') },
        }
      )
      .then((res) => {
        setIsLoading(false)
        if (res.data.isInvalid) {
          history.push('/login')
        } else {
          changeIsOpen()
          changeIsDoing()
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <Overlay>
      <Container>
        {isLoading ? (
          <Loading isLoading={false} />
        ) : (
          <>
            <CloseButton onClick={changeIsOpen} />
            <ActionName>{name}</ActionName>
            <SelectTime
              inpTitle="開始時間"
              hours={startHours}
              changeHours={changeStartHours}
              minutes={startMinutes}
              changeMinutes={changeStartMinutes}
            />
            <Button onClick={start}>開始</Button>
          </>
        )}
      </Container>
    </Overlay>
  )
}

export default StartAction
