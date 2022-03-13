import styled from "styled-components";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleLeft,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import DateFnsUtils from "@date-io/date-fns";
import { memo, useState } from "react";
import { useHistory } from "react-router-dom";
import ChoiceModal from "./ChoiceModal";

// styled-components →
const Container = styled.div`
  position: fixed;
  top: 0;
  z-index: 30;
  width: 100%;
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  @media (min-width: 600px) {
    height: 70px;
  }
`;
const FlexContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  margin-right: ${(props) => (props.direction === "next" ? "20px" : "10px")};
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;
const ArrowIcon = styled(FontAwesomeIcon)`
  font-size: 30px;
  color: rgba(0, 0, 0, 0.6);
`;
const MyPicker = styled(KeyboardDatePicker)`
  width: 170px;
`;
const LogoutIconContainer = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 10px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  @media (min-width: 600px) {
    right: 100px;
    width: 40px;
    height: 40px;
  }
`;
const LogoutIcon = styled(FontAwesomeIcon)`
  font-size: 20px;
  color: rgba(0, 0, 0, 0.5);
  @media (min-width: 600px) {
    font-size: 25px;
  }
`;
// ← styled-components

const LogHeader = memo((props) => {
  let history = useHistory();

  const date = `${props.nowDay.getFullYear()}/${
    props.nowDay.getMonth() + 1
  }/${props.nowDay.getDate()}`;

  const [isOpen, setIsOpen] = useState(false);
  const changeIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const logOut = () => {
    localStorage.removeItem("accessToken");
    setIsOpen(false);
    history.push("/");
  };

  return (
    <>
      <Container>
        <FlexContainer>
          <IconContainer onClick={() => props.changeDay("prev")}>
            <ArrowIcon icon={faAngleLeft} />
          </IconContainer>
          <IconContainer
            direction="next"
            onClick={() => props.changeDay("next")}
          >
            <ArrowIcon icon={faAngleRight} />
          </IconContainer>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <MyPicker
              autoOk
              variant="inline"
              format="yyyy/MM/dd"
              disableToolbar
              InputProps={{
                disableUnderline: true,
                style: { fontSize: "20px" },
              }}
              value={date}
              onChange={(date) => props.changeDay(date)}
            />
          </MuiPickersUtilsProvider>
          <LogoutIconContainer onClick={() => setIsOpen(true)}>
            <LogoutIcon icon={faSignOutAlt} />
          </LogoutIconContainer>
        </FlexContainer>
      </Container>
      <ChoiceModal
        title="本当にログアウトしますか？"
        yes="ログアウト"
        no="キャンセル"
        isOpen={isOpen}
        cancel={changeIsOpen}
        yesEvent={logOut}
      />
    </>
  );
});

export default LogHeader;
