import { useState } from "react";
import {useHistory} from "react-router-dom"
import axios from "axios";
import EditActionAdd from "../components/EditActionAdd";

const EditAdd = () => {

  let history = useHistory();

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


  const AddAction = () => {
    if (name === "") {
      alert("アクション名が入力されていません。");
    } else if (color === "") {
      alert("カラーが選択されていません。")
    } else {
      axios.post(
        "https://kiroku-server.herokuapp.com/actions",
        {
          item_name: name,
          color: color,
        },
        {
          headers: {accessToken: localStorage.getItem("accessToken")}
        }
      ).then((res) => {
        if (res.data.isInvalid) {
          history.push("/login");
        } else {
          history.push("/EditTop");
        }
      });
    }
  }

  return (
    <EditActionAdd
      focusKey={focusKey}
      onClick={AddAction}
      changeName={changeName}
      changeFocusKey={changeFocusKey}
      changeColor={changeColor}
      title="アクションの新規追加"
      buttonName="追加"
      boolean={false}
    />
  );

}

export default EditAdd;