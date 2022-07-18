import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import ActionIcon from './ActionIcon'
import Loading from './Loading'

// styled-components →
const Icon = styled.div<{ nowId: number; isMask?: boolean; focusKey?: number }>`
  position: relative;
  border-radius: 5px;
  pointer-events: ${({ isMask }) => (isMask ? 'none' : 'auto')};
  border: ${({ nowId, focusKey }) =>
    nowId === focusKey ? '2px solid rgb(55, 53, 47)' : 'none'};
`
const Mask = styled.div`
  position: absolute;
  top: 0;
  width: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.5);
`
// ← styled-components

type Props = {
  onClick: (action: ActionData) => void
  focusKey?: number
  isMask?: boolean
  force?: boolean
}

const IconGrid: React.FC<Props> = ({ onClick, focusKey, isMask, force }) => {
  const history = useHistory()

  const [isLoading, setIsLoading] = useState(true)
  const [actions, setActions] = useState<ActionData[]>([])

  useEffect(() => {
    setIsLoading(true)
    axios
      .get<ActionData[] & { isInvalid?: boolean }>(
        'http://localhost:3001/actions',
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        }
      )
      .then((res) => {
        if (res.data.isInvalid) {
          history.push('/login')
        } else {
          setActions(res.data)
        }
        setIsLoading(false)
      })
  }, [history, force, setIsLoading, setActions])

  return isLoading ? (
    <Loading isLoading={isLoading} />
  ) : (
    <>
      {actions.map((action: ActionData) => (
        <Icon
          key={action.id}
          nowId={action.id}
          onClick={() => onClick(action)}
          focusKey={focusKey}
          isMask={isMask}
        >
          <ActionIcon name={action.item_name} color={action.color} />
          {isMask ? <Mask /> : null}
        </Icon>
      ))}
    </>
  )
}

export default IconGrid
