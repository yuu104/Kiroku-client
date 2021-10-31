import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import EditActionAdd from "../components/EditActionAdd";

const EditAction = () => {

  let history = useHistory();
  const {id} = useParams();

  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [focusKey, setFocusKey] = useState("");

  const changeName = (newName) => {
    setName(newName);
  }
  const changeColor = (newColor) => {
    setColor(newColor);
  }
  const changeFocusKey = (newFocusKey) => {
    setFocusKey(newFocusKey);
  }

  const changeAction = () => {
    if (name === "") {
      alert("アクション名が入力されていません");
    } else if (color === "") {
      alert("カラーが選択されていません");
    } else {
      axios.post(
        "http://localhost:3001/actions/update",
        {
          id: id,
          item_name: name,
          color: color,
        }
      ).then((res) => {
        history.push("/EditTop");
      });
    }
  }

  useEffect(() => {
    axios.get(`http://localhost:3001/actions/edit/${id}`).then((res) => {
      setName(res.data[0].item_name);
      setColor(res.data[0].color);
      setFocusKey(res.data[0].color);
    })
  }, [id]);

  return (
    <EditActionAdd
      id={id}
      name={name}
      color={color}
      focusKey={focusKey}
      changeName={changeName}
      changeColor={changeColor}
      changeFocusKey={changeFocusKey}
      onClick={changeAction}
      title="アクションの編集"
      buttonName="変更"
      boolean={true}
      isOpen={false}
    />
  );

}

export default EditAction;