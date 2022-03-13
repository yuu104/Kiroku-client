import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import EditActionForm from "../../components/EditActionForm";

const AddAction = (props) => {
  let history = useHistory();

  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [focusKey, setFocusKey] = useState("");

  const changeName = (newName) => {
    setName(newName);
  };
  const changeColor = (newColor) => {
    setColor(newColor);
  };
  const changeFocusKey = (newFocusKey) => {
    setFocusKey(newFocusKey);
  };

  const add = () => {
    if (name === "") {
      alert("アクション名が入力されていません。");
    } else if (color === "") {
      alert("カラーが選択されていません。");
    } else {
      axios
        .post(
          "https://kiroku-server.herokuapp.com/actions",
          {
            item_name: name,
            color: color,
          },
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        )
        .then((res) => {
          if (res.data.isInvalid) {
            history.push("/login");
          } else {
            props.changeForce();
            history.push("/time-log/edit-actions/top");
          }
        });
    }
  };

  return (
    <EditActionForm
      focusKey={focusKey}
      onClick={add}
      changeName={changeName}
      changeFocusKey={changeFocusKey}
      changeColor={changeColor}
      title="アクションの新規追加"
      buttonName="追加"
      boolean={false}
    />
  );
};

export default AddAction;
