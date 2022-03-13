import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons";
import IconGrid from "../../components/IconGrid";
import SelectTime from "../../components/SelectTime";

// styled-components →
const BackBtn = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
`;
const BackIcon = styled(FontAwesomeIcon)`
  font-size: 22px;
  color: rgb(55, 53, 47);
`;
const Title = styled.h2`
  text-align: center;
  font-size: 17px;
  margin: 0;
  @media (min-width: 600px) {
    font-size: 25px;
  }
`;
const IconContainer = styled.div`
  position: relative;
  height: 250px;
  margin: 20px 0;
`;
const GridContainer = styled.div`
  height: 100%;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, 50px);
  grid-auto-rows: 50px;
  gap: 10px;
  overflow: scroll;
  z-index: 1;
  @media (min-width: 600px) {
    grid-template-columns: repeat(auto-fit, 70px);
    grid-auto-rows: 70px;
  }
`;
const Button = styled.div`
  background-color: #fff;
  border: 1px solid rgba(55, 53, 47, 0.16);
  border-radius: 5px;
  cursor: pointer;
  width: 100px;
  margin: 20px auto 0 auto;
  text-align: center;
  font-size: 15px;
  padding: 8px 0;
  &:hover {
    background-color: rgba(55, 53, 47, 0.05);
  }
`;
// ← styled-components

const AddLog = (props) => {
  let history = useHistory();

  return (
    <>
      <BackBtn onClick={() => history.goBack()}>
        <BackIcon icon={faAngleDoubleLeft}></BackIcon>
      </BackBtn>
      <Title>記録の追加</Title>
      <IconContainer>
        <GridContainer>
          <IconGrid focusKey={props.focusKey} onClick={props.onClick} />
        </GridContainer>
      </IconContainer>
      <SelectTime
        inpTitle="開始時間"
        hours={props.startHours}
        changeHours={props.changeStartHours}
        minutes={props.sartMinutes}
        changeMinutes={props.changeStartMinutes}
      />
      <SelectTime
        inpTitle="終了時間"
        hours={props.finishHours}
        changeHours={props.changeFinishHours}
        minutes={props.finishMinutes}
        changeMinutes={props.changeFinishMinutes}
      />
      <Button onClick={props.add}>追加</Button>
    </>
  );
};

export default AddLog;
