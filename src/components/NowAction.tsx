import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library, IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faStopCircle } from '@fortawesome/free-regular-svg-icons'

library.add(faStopCircle as IconDefinition)

// styled-components →
const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  @media (min-width: 600px) {
    width: 370px;
  }
`

const Desc = styled.div`
  font-size: 13px;
  text-align: left;
  opacity: 0.5;
  @media (min-width: 900px) {
    padding-left: 50px;
  }
`

const Action = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  border-bottom: 2px solid;
  border-color: ${(props) => props.color};
  @media (min-width: 900px) {
    margin: 0 50px;
  }
`

const Mark = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: ${(props) => props.color};
`

const Name = styled.p`
  margin: 0;
  font-size: 20px;
`

const StopBox = styled.div`
  margin-left: auto;
  margin-right: 10px;
`

const Stop = styled(FontAwesomeIcon)`
  font-size: 25px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`
// ← styled-components

type Props = {
  startAction: string
  color: string
  changeIsStopLog: () => void
}

const NowAction: React.FC<Props> = ({
  startAction,
  color,
  changeIsStopLog,
}) => (
  <Container>
    <Desc>実行中のアクション</Desc>
    <Action color={color}>
      <Mark color={color} />
      <Name>{startAction}</Name>
      <StopBox onClick={changeIsStopLog}>
        <Stop icon={faStopCircle as IconDefinition} />
      </StopBox>
    </Action>
  </Container>
)

export default NowAction
