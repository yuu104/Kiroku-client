import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'axios'
import EditActionForm from '../../components/EditActionForm'
import ChoiceModal from '../../components/ChoiceModal'

type Props = {
  changeForce: () => void
}

const EditAction: React.FC<Props> = ({ changeForce }) => {
  const history = useHistory()
  const { id } = useParams<{ id: string }>()

  const [name, setName] = useState<string>()
  const [color, setColor] = useState<string>()
  const [focusKey, setFocusKey] = useState<string>()

  const changeName = (newName: string) => {
    setName(newName)
  }
  const changeColor = (newColor: string) => {
    setColor(newColor)
  }
  const changeFocusKey = (newFocusKey: string) => {
    setFocusKey(newFocusKey)
  }

  useEffect(() => {
    axios
      .get<ActionData[]>(`http://localhost:3001/actions/${id}`)
      .then((res) => {
        setName(res.data[0].item_name)
        setColor(res.data[0].color)
        setFocusKey(res.data[0].color)
      })
  }, [id])

  const changeAction = () => {
    if (name === '') {
      alert('アクション名が入力されていません')
    } else if (color === '') {
      alert('カラーが選択されていません')
    } else {
      axios
        .put('http://localhost:3001/actions', {
          id,
          item_name: name,
          color,
        })
        .then(() => {
          changeForce()
          history.push('/time-log/edit-actions/top')
        })
    }
  }

  const deleteAction = () => {
    axios
      .delete('http://localhost:3001/actions', {
        data: {
          id,
        },
      })
      .then(() => {
        changeForce()
        history.push('/time-log/edit-actions/top')
      })
  }

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const changeIsOpen = () => {
    setIsOpen((prev) => !prev)
  }

  const choiceModal = (
    <ChoiceModal
      title="本当に削除しますか？"
      yes="削除"
      no="キャンセル"
      isOpen={isOpen}
      cancel={() => setIsOpen(false)}
      yesEvent={deleteAction}
      isIcon
      name={name}
      color={color}
    />
  )

  return (
    <EditActionForm
      name={name}
      color={color}
      changeForce={changeForce}
      focusKey={focusKey}
      changeName={changeName}
      changeColor={changeColor}
      changeFocusKey={changeFocusKey}
      onClick={changeAction}
      title="アクションの編集"
      buttonName="変更"
      isDeleteBtn
      deleteAction={deleteAction}
      choiceModal={choiceModal}
      changeIsModal={changeIsOpen}
    />
  )
}

export default EditAction
