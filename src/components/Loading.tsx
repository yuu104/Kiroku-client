import styled from 'styled-components'
import { Ring } from '@uiball/loaders'

// styled-components →
const Container = styled.div<{ isLoading?: boolean }>`
  position: ${({ isLoading }) => (isLoading ? 'absolute' : 'static')};
  top: ${({ isLoading }) => (isLoading ? '0' : 'auto')};
  left: ${({ isLoading }) => (isLoading ? '0' : 'auto')};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`
// ← styled-components

type Props = {
  isLoading: boolean
}

const Loading: React.FC<Props> = ({ isLoading }) => (
  <Container isLoading={isLoading}>
    <Ring size={35} color="rgba(0, 0, 0, 0.4)" lineWeight={5} speed={2} />
  </Container>
)

export default Loading
