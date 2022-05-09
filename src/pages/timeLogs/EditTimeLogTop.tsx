import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import CloseButton from '../../components/CloseButton'

// styled-components →
const Title = styled.h2`
  text-align: center;
  font-size: 17px;
  margin: 0;
  @media (min-width: 600px) {
    font-size: 25px;
  }
`
const Ul = styled.ul`
  padding: 0;
  overflow: scroll;
  margin: 20px 0;
  height: 70%;
`
const List = styled.li`
  list-style: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 10px 10px;
  margin-bottom: 5px;
  margin: 5px;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid rgba(55, 53, 47, 0.16);
  &:hover {
    background-color: rgba(55, 53, 47, 0.05);
  }
`
const AddButton = styled.div`
  background-color: #fff;
  border: 1px solid rgba(55, 53, 47, 0.16);
  width: 60px;
  text-align: center;
  padding: 7px 0;
  border-radius: 5px;
  margin: 8px 0 0 auto;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    background-color: rgba(55, 53, 47, 0.05);
  }
`
// ← styled-components

type Props = {
  filterData: ChartLogedData[]
  changeActionName: (newState: string) => void
  changeTime: (sh: number, sm: number, fh: number, fm: number) => void
  changeEditId: (newState: number) => void
}

const EditTimeLogTop: React.FC<Props> = ({
  filterData,
  changeActionName,
  changeTime,
  changeEditId,
}) => {
  const history = useHistory()

  return (
    <>
      <CloseButton onClick={() => history.push('/time-log')} />
      <Title>記録の編集</Title>
      <Ul>
        {filterData.map((data) => {
          const nowStartHours = `0${data.start_time.getHours()}`.slice(-2)
          const nowStartMinutes = `0${data.start_time.getMinutes()}`.slice(-2)
          const nowFinishHours = `0${data.finish_time.getHours()}`.slice(-2)
          const nowFinishMinutes = `0${data.finish_time.getMinutes()}`.slice(-2)
          return (
            <List
              key={data.id}
              onClick={() => {
                changeActionName(data.item_name)
                changeTime(
                  data.start_time.getHours(),
                  data.start_time.getMinutes(),
                  data.finish_time.getHours(),
                  data.finish_time.getMinutes()
                )
                changeEditId(data.id!)
                history.push('/time-log/edit-log/edit')
              }}
            >
              <div>{data.item_name}</div>
              <div>{`${nowStartHours}:${nowStartMinutes}〜${nowFinishHours}:${nowFinishMinutes}`}</div>
            </List>
          )
        })}
      </Ul>
      <AddButton
        onClick={() => {
          changeTime(0, 0, 0, 0)
          history.push('/time-log/edit-log/add')
        }}
      >
        追加＋
      </AddButton>
    </>
  )
}

export default EditTimeLogTop
