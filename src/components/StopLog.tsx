import axios from 'axios'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ChoiceModal from './ChoiceModal'

type Props = {
  isStopLog: boolean
  changeIsStopLog: () => void
  changeIsDoing: () => void
}

const StopLog: React.FC<Props> = ({
  isStopLog,
  changeIsStopLog,
  changeIsDoing,
}) => {
  const history = useHistory()

  const [id, setId] = useState<number>()
  const [name, setName] = useState<string>()
  const [color, setColor] = useState<string>()
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)

  useEffect((): (() => void) => {
    let unmounted = false
    const getLogs = async () => {
      setIsLoading(true)
      const res = await axios.get<LoggingData[] & { isInvalid?: boolean }>(
        'http://localhost:3001/logs',
        {
          headers: { accessToken: localStorage.getItem('accessToken') },
        }
      )
      const { data } = res
      if (data.isInvalid) {
        history.push('/login')
      } else if (data.length === 0 && !unmounted) {
        changeIsDoing()
        changeIsStopLog()
      } else if (!unmounted) {
        setId(data[0].id)
        setName(data[0].item_name)
        setColor(data[0].color)
        const timeData = data[0].start_time.split(',')
        setStartTime(
          new Date(
            Number(timeData[0]),
            Number(timeData[1]) - 1,
            Number(timeData[2]),
            Number(timeData[3]),
            Number(timeData[4])
          )
        )
      }
      setIsLoading(false)
    }
    getLogs()
    return () => (unmounted = true)
  }, [history, changeIsDoing, changeIsStopLog])

  const stop = () => {
    setIsLoading(true)
    const nowDate = new Date()
    const year = nowDate.getFullYear()
    const month = nowDate.getMonth() + 1
    const date = nowDate.getDate()
    const hours = nowDate.getHours()
    const minutes = nowDate.getMinutes()
    const newMinutes = minutes + 2 - ((minutes + 2) % 5)
    const stopTimeStr = `${year},${month},${date},${hours},${newMinutes}`
    const stopTime = new Date(year, month - 1, date, hours, newMinutes)

    if (
      stopTime === startTime ||
      stopTime.getDate() - startTime.getDate() > 1
    ) {
      axios
        .delete(`http://localhost:3001/logs`, {
          data: {
            id,
          },
        })
        .then(() => {
          setIsLoading(false)
          changeIsStopLog()
          changeIsDoing()
        })
    } else {
      axios
        .patch(
          `http://localhost:3001/logs/${id!}/stop`,
          {
            finish_time: stopTimeStr,
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
            changeIsStopLog()
            changeIsDoing()
          }
        })
    }
  }

  return (
    <ChoiceModal
      isOpen={isStopLog}
      isLoading={isLoading}
      title="記録を終了しますか？"
      no="キャンセル"
      yes="終了"
      isIcon
      name={name}
      color={color}
      yesEvent={stop}
      cancel={changeIsStopLog}
    />
  )
}

export default StopLog
