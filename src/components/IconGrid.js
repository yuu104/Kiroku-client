import styled from "styled-components";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ActionIcon from "./ActionIcon";

// styled-components →
const Icon = styled.div`
  position: relative;
  border-radius: 5px;
  height: 50px;
  pointer-events: ${props => (props.isMask) ? 'none' : 'auto'};
  border: ${props => (props.id === props.focusKey) ? "2px solid rgb(55, 53, 47)" : "none"};
  @media (min-width: 600px) {
    height: 70px;
  }
`;
const Mask = styled.div`
  position: absolute;
  top: 0;
  width: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: rgba(0,0,0,0.5);
`;
// ← styled-components

const IconGrid = (props) => {

  let history = useHistory();

  const [actions, setActions] = useState([]);
  useEffect(() => {
    axios.get(
      "https://kiroku-server.herokuapp.com/actions",
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        }
      }
    ).then((res) => {
      if (res.data.isInvalid) {
        history.push("/login");
      } else {
        setActions(res.data);
      }
    });
  }, [history, props.forceRender]);

  return (

    actions.map((action) => {
      return (
        <Icon
          key={action.id}
          id={action.id}
          onClick={() => props.onClick(action)}
          focusKey={props.focusKey}
          isMask={props.isMask}
        >
          <ActionIcon name={action.item_name} color={action.color} />
          {
            (props.isMask) ? (
              <Mask></Mask>
            ) : (
              null
            )
          }
        </Icon>
      )
    })
  );

}

export default IconGrid;