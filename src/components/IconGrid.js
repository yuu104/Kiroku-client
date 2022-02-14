import styled from "styled-components";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useUnmountRef, useSafeState } from "../helper/cleanup";
import ActionIcon from "./ActionIcon";
import Loading from "./Loading";

// styled-components →
const Icon = styled.div`
  position: relative;
  border-radius: 5px;
  pointer-events: ${props => (props.isMask) ? 'none' : 'auto'};
  border: ${props => (props.id === props.focusKey) ? "2px solid rgb(55, 53, 47)" : "none"};
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

  const unmountRef = useUnmountRef();
  const [isLoading, setIsLoading] = useSafeState(unmountRef, true);
  const [actions, setActions] = useSafeState(unmountRef, []);

  useEffect(() => {
    setIsLoading(true);
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
      setIsLoading(false);
    });
  }, [history, props.force, setIsLoading, setActions]);

  return (
    isLoading ? (
      <Loading isLoading={isLoading} />
    ) : (
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
    )
  );
}

export default IconGrid;