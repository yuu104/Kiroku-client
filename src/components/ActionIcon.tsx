import styled from 'styled-components'

// styled-component →
const Container = styled.div<{ color?: string }>`
  background-color: ${({ color }) => color};
  color: #fff;
  text-shadow: 1px 0 0 black, 0 1px 0 black, -1px 0 0 black, 0 -1px 0 black;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  height: 100%;
  width: 100%;
  cursor: pointer;
  text-align: center;
  font-size: 12px;
  &:hover {
    opacity: 0.9;
  }
  @media (min-width: 600px) {
    font-size: 15px;
  }
`
// ← styled-component

type Props = {
  color?: string
  name?: string
}

const ActionIcon: React.FC<Props> = ({ color, name }) => (
  <Container color={color}>{name}</Container>
)

export default ActionIcon
