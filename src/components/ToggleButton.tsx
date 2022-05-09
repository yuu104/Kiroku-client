import { memo } from 'react'
import styled from 'styled-components'

// styled-components →
const Container = styled.div`
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 5px;
`
const Button = styled.div<{
  display: string
  content: string
  isLeft: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 30px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  color: ${({ content, display }) =>
    content === display ? '#42A5F5' : 'rgba(0, 0, 0, 0.54)'};
  background-color: ${({ content, display }) =>
    content === display ? 'rgba(66,165,245,0.1)' : '#fff'};
  border-radius: ${({ isLeft }) => (isLeft ? '5px 0 0 5px' : '0 5px 5px 0')};
  &:hover {
    background-color: ${({ content, display }) =>
      content === display ? 'rgba(11,114,192,0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
  @media (min-width: 600px) {
    font-size: 12px;
    width: 65px;
    height: 40px;
  }
`
// ← styled-components

type Props = {
  display: string
  leftContent: string
  rightContent: string
  nowContent: string
  changeDisplay: (newState: string) => void
}

const ToggleButton: React.FC<Props> = memo((props) => (
  <Container>
    <Button
      className="border"
      display={props.display}
      content={props.leftContent}
      isLeft
      onClick={() => props.changeDisplay(props.leftContent)}
    >
      {props.leftContent}
    </Button>
    <Button
      display={props.display}
      content={props.rightContent}
      isLeft={false}
      onClick={() => props.changeDisplay(props.rightContent)}
    >
      {props.rightContent}
    </Button>
  </Container>
))

export default ToggleButton
