import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import EditActionForm from '../../components/EditActionForm'

type Props = {
  changeForce: () => void
}

const AddAction: React.FC<Props> = ({ changeForce }) => {
  const history = useHistory()

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

  const add = () => {
    if (name === '') {
      alert('アクション名が入力されていません。')
    } else if (color === '') {
      alert('カラーが選択されていません。')
    } else {
      axios
        .post(
          'https://kiroku-server.herokuapp.com/actions',
          {
            item_name: name,
            color,
          },
          {
            headers: { accessToken: localStorage.getItem('accessToken') },
          }
        )
        .then((res) => {
          if (res.data.isInvalid) {
            history.push('/login')
          } else {
            changeForce()
            history.push('/time-log/edit-actions/top')
          }
        })
    }
  }

  return (
    <EditActionForm
      focusKey={focusKey}
      onClick={add}
      changeName={changeName}
      changeFocusKey={changeFocusKey}
      changeColor={changeColor}
      title="アクションの新規追加"
      buttonName="追加"
      isDeleteBtn={false}
    />
  )
}

export default AddAction
