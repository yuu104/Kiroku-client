import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library, IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

library.add(faTimes as IconDefinition)

// styled-components →
const Container = styled.div`
  width: 25px;
  height: 25px;
  margin-left: 92%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.7;
  cursor: pointer;
  &:hover {
    border-radius: 50%;
    background-color: rgb(0, 0, 0, 0.1);
  }
`
const CloseIcon = styled(FontAwesomeIcon)`
  font-size: 17px;
`
// → styled-components

const CloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <Container onClick={onClick}>
    <CloseIcon icon={faTimes as IconDefinition} />
  </Container>
)

export default CloseButton
