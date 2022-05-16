import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library, IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons'
import IconGrid from '../../components/IconGrid'
import SelectTime from '../../components/SelectTime'

library.add(faAngleDoubleLeft as IconDefinition)

// styled-components →
const BackBtn = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
`
const BackIcon = styled(FontAwesomeIcon)`
  font-size: 22px;
  color: rgb(55, 53, 47);
`
const Title = styled.h2`
  text-align: center;
  font-size: 17px;
  margin: 0;
  @media (min-width: 600px) {
    font-size: 25px;
  }
`
const IconContainer = styled.div`
  position: relative;
  height: 250px;
  margin: 20px 0;
`
const GridContainer = styled.div`
  height: 100%;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, 50px);
  grid-auto-rows: 50px;
  gap: 10px;
  overflow: scroll;
  z-index: 1;
  @media (min-width: 600px) {
    grid-template-columns: repeat(auto-fit, 70px);
    grid-auto-rows: 70px;
  }
`
const Button = styled.div`
  background-color: #fff;
  border: 1px solid rgba(55, 53, 47, 0.16);
  border-radius: 5px;
  cursor: pointer;
  width: 100px;
  margin: 20px auto 0 auto;
  text-align: center;
  font-size: 15px;
  padding: 8px 0;
  &:hover {
    background-color: rgba(55, 53, 47, 0.05);
  }
`
// ← styled-components

type Props = {
  focusKey?: number
  startHours: number
  startMinutes: number
  finishHours: number
  finishMinutes: number
  onClick: (action: ActionData) => void
  changeStartHours: (newState: number) => void
  changeStartMinutes: (newState: number) => void
  changeFinishHours: (newState: number) => void
  changeFinishMinutes: (newState: number) => void
  add: () => void
}

const AddLog: React.FC<Props> = ({
  focusKey,
  startHours,
  startMinutes,
  finishHours,
  finishMinutes,
  onClick,
  changeStartHours,
  changeStartMinutes,
  changeFinishMinutes,
  changeFinishHours,
  add,
}) => {
  const history = useHistory()

  return (
    <>
      <BackBtn onClick={() => history.goBack()}>
        <BackIcon icon={faAngleDoubleLeft as IconDefinition} />
      </BackBtn>
      <Title>記録の追加</Title>
      <IconContainer>
        <GridContainer>
          <IconGrid focusKey={focusKey} onClick={onClick} />
        </GridContainer>
      </IconContainer>
      <SelectTime
        inpTitle="開始時間"
        hours={startHours}
        changeHours={changeStartHours}
        minutes={startMinutes}
        changeMinutes={changeStartMinutes}
      />
      <SelectTime
        inpTitle="終了時間"
        hours={finishHours}
        changeHours={changeFinishHours}
        minutes={finishMinutes}
        changeMinutes={changeFinishMinutes}
      />
      <Button onClick={add}>追加</Button>
    </>
  )
}

export default AddLog
