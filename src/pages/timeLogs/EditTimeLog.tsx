import styled from 'styled-components'
import { useState } from 'react'
import { useHistory, Route } from 'react-router-dom'
import axios from 'axios'
import EditLog from './EditLog'
import EditTimeLogTop from './EditTimeLogTop'
import AddLog from './AddLog'

// styled-components →
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 40;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
`
const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  padding: 30px;
  @media (min-width: 600px) {
    width: 500px;
    height: 620px;
    border-radius: 5px;
  }
`
// ← styled-components
type Props = {
  chartData: ChartLogedData[]
  nowDay: Date
  changeForce: () => void
}

const EditTimeLog: React.FC<Props> = ({ chartData, nowDay, changeForce }) => {
  const history = useHistory()

  const [editId, setEditId] = useState<number>()
  const changeEditId = (newState: number) => {
    setEditId(newState)
  }

  const filterData = chartData.filter((data) => data.id !== undefined)

  const [actionName, setActionName] = useState<string>()
  const changeActionName = (newState: string) => {
    setActionName(newState)
  }
  const [startHours, setStartHours] = useState<number>(0)
  const changeStartHours = (newState: number) => {
    setStartHours(newState)
  }
  const [startMinutes, setStartMinutes] = useState<number>(0)
  const changeStartMinutes = (newState: number) => {
    setStartMinutes(newState)
  }
  const [finishHours, setFinishHours] = useState<number>(0)
  const changeFinishHours = (newState: number) => {
    setFinishHours(newState)
  }
  const [finishMinutes, setFinishMinutes] = useState<number>(0)
  const changeFinishMinutes = (newState: number) => {
    setFinishMinutes(newState)
  }

  const changeTime = (sh: number, sm: number, fh: number, fm: number) => {
    setStartHours(sh)
    setStartMinutes(sm)
    setFinishHours(fh)
    setFinishMinutes(fm)
  }

  const change = () => {
    const newStartDate = new Date(
      nowDay.getFullYear(),
      nowDay.getMonth(),
      nowDay.getDate(),
      startHours,
      startMinutes
    )
    const newFinishDate = new Date(
      nowDay.getFullYear(),
      nowDay.getMonth(),
      nowDay.getDate(),
      finishHours,
      finishMinutes
    )
    let changeable = 'ok'
    for (let i = 0; i < filterData.length; i++) {
      if (filterData[i].id === editId) continue
      if (
        (newStartDate >= filterData[i].start_time &&
          newStartDate < filterData[i].finish_time) ||
        (newFinishDate > filterData[i].start_time &&
          newFinishDate <= filterData[i].finish_time)
      ) {
        changeable = 'duplicate'
        break
      }
    }
    if (newStartDate > new Date() || newFinishDate > new Date())
      changeable = 'fast'
    if (changeable === 'ok') {
      axios
        .patch(`https://kiroku-server.herokuapp.com/logs/${editId!}/edit`, {
          start_time: `${nowDay.getFullYear()},${
            nowDay.getMonth() + 1
          },${nowDay.getDate()},${startHours},${startMinutes}`,
          finish_time: `${nowDay.getFullYear()},${
            nowDay.getMonth() + 1
          },${nowDay.getDate()},${finishHours},${finishMinutes}`,
        })
        .then(() => {
          changeForce()
          history.push('/time-log/edit-log/top')
        })
    } else if (changeable === 'duplicate') {
      alert('時刻が他のアクションと重複しているため、変更できません。')
    } else if (changeable === 'fast') {
      alert('現在よりも後の時刻は記録することができません。')
    }
  }

  const [focusKey, setFocusKey] = useState<number>()
  const [itemNamem, setItemName] = useState<string>()
  const [color, setColor] = useState<string>()
  const onClick = (action: {
    id: number
    item_name: string
    color: string
  }) => {
    setFocusKey(action.id)
    setItemName(action.item_name)
    setColor(action.color)
  }

  const add = () => {
    const newStartDate = new Date(
      nowDay.getFullYear(),
      nowDay.getMonth(),
      nowDay.getDate(),
      startHours,
      startMinutes
    )
    const newFinishDate = new Date(
      nowDay.getFullYear(),
      nowDay.getMonth(),
      nowDay.getDate(),
      finishHours,
      finishMinutes
    )
    if (focusKey === undefined) {
      alert('アクションが選択されていません。')
      return
    }
    if (newFinishDate.getTime() - newStartDate.getTime() <= 0) {
      alert('時刻設定が正しくないため、追加できません。')
      return
    }
    if (newStartDate > new Date() || newFinishDate > new Date()) {
      alert('現在よりも後の時刻は記録することができません。')
      return
    }
    let isAdd = true
    for (let i = 0; i < filterData.length; i++) {
      if (filterData[i].id === editId) continue
      if (
        (newStartDate >= filterData[i].start_time &&
          newStartDate < filterData[i].finish_time) ||
        (newFinishDate > filterData[i].start_time &&
          newFinishDate <= filterData[i].finish_time)
      ) {
        isAdd = false
        break
      }
    }
    if (isAdd) {
      axios
        .post(
          'https://kiroku-server.herokuapp.com/logs',
          {
            item_name: itemNamem,
            color,
            start_time: `${nowDay.getFullYear()},${
              nowDay.getMonth() + 1
            },${nowDay.getDate()},${startHours},${startMinutes}`,
            finish_time: `${nowDay.getFullYear()},${
              nowDay.getMonth() + 1
            },${nowDay.getDate()},${finishHours},${finishMinutes}`,
          },
          {
            headers: { accessToken: localStorage.getItem('accessToken') },
          }
        )
        .then((res) => {
          if (res.data.isInvalid) {
            history.push('/login')
          } else {
            setFocusKey(undefined)
            changeForce()
            history.push('/time-log/edit-log/top')
          }
        })
    } else {
      alert('時刻が他のアクションと重複しているため、追加できません。')
    }
  }

  return (
    <Overlay>
      <Container>
        <Route
          path="/time-log/edit-log/top"
          render={() => (
            <EditTimeLogTop
              filterData={filterData}
              changeActionName={changeActionName}
              changeTime={changeTime}
              changeEditId={changeEditId}
            />
          )}
        />
        <Route
          path="/time-log/edit-log/edit"
          render={() => (
            <EditLog
              actionName={actionName!}
              startHours={startHours}
              finishHours={finishHours}
              changeStartHours={changeStartHours}
              changeFinishHours={changeFinishHours}
              startMinutes={startMinutes}
              finishMinutes={finishMinutes}
              changeStartMinutes={changeStartMinutes}
              changeFinishMinutes={changeFinishMinutes}
              change={change}
              editId={editId!}
              changeForce={changeForce}
            />
          )}
        />
        <Route
          path="/time-log/edit-log/add"
          render={() => (
            <AddLog
              focusKey={focusKey}
              onClick={onClick}
              startHours={startHours}
              startMinutes={startMinutes}
              finishHours={finishHours}
              finishMinutes={finishMinutes}
              changeStartHours={changeStartHours}
              changeStartMinutes={changeStartMinutes}
              changeFinishHours={changeFinishHours}
              changeFinishMinutes={changeFinishMinutes}
              add={add}
            />
          )}
        />
      </Container>
    </Overlay>
  )
}

export default EditTimeLog
