import styled from 'styled-components'
import ActionIcon from './ActionIcon'
import Loading from './Loading'

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
const Container = styled.div<{ isIcon?: boolean }>`
  width: 300px;
  height: ${({ isIcon }) => (isIcon ? '224px' : 'auto')};
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
`
const Title = styled.h3`
  font-size: 18px;
  text-align: center;
  margin-bottom: 30px;
`
const Icon = styled.div`
  width: 70px;
  height: 70px;
  margin: 0 auto;
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
`
const Button = styled.div`
  width: 95px;
  height: 35px;
  font-size: 15px;
  border: 2px solid rgb(55, 53, 47);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`
// ← styled-components

type Props = {
  isOpen: boolean
  title: string
  yes: string
  no: string
  yesEvent: () => void
  cancel: () => void
  isIcon?: boolean
  name?: string
  color?: string
  isLoading?: boolean
}

const ChoiceModal: React.FC<Props> = ({
  isOpen,
  title,
  yes,
  no,
  yesEvent,
  cancel,
  isIcon,
  name,
  color,
  isLoading,
}) =>
  isOpen ? (
    <Overlay>
      <Container isIcon={isIcon}>
        {isLoading ? (
          <Loading isLoading={false} />
        ) : (
          <>
            <Title>{title}</Title>
            {isIcon ? (
              <Icon>
                <ActionIcon name={name} color={color} />
              </Icon>
            ) : null}
            <ButtonContainer>
              <Button onClick={cancel}>{no}</Button>
              <Button onClick={yesEvent}>{yes}</Button>
            </ButtonContainer>
          </>
        )}
      </Container>
    </Overlay>
  ) : null

export default ChoiceModal
