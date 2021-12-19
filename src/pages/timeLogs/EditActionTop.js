import styled from "styled-components";
import { useHistory } from "react-router-dom";
import CloseButton from "../../components/CloseButton";
import IconGrid from "../../components/IconGrid";

// styled-components → 
const Overlay = styled.div`
  position: fixed;
  top: 0;
  z-index: 40;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.4);
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffff;
  padding: 60px 20px;
  box-sizing: border-box;
  @media(min-width: 600px) {
    width: 400px;
    height: 600px;
    border-radius: 5px;
    padding: 30px;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
`;

const IconContainer = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, 50px);
  gap: 10px;
  margin: 0;
  margin-top: 20px;
  overflow: scroll;
  z-index: 1;
  max-height: 300px;
  @media(min-width: 600px) {
    grid-template-columns: repeat(auto-fit, 70px);
  }
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  padding: 10px 0;
  background-color: #fff;
  border: 1px solid rgba(55, 53, 47, 0.16);
  border-radius: 5px;
  margin: 40px auto 0 auto;
  cursor: pointer;
  &:hover {
    background-color: rgba(55, 53, 47, 0.05);
  }
`;
// ← styled-components

const EditActionTop = (props) => {

  let history = useHistory();

  return (
    <Overlay>
      <Container>
        <CloseButton onClick={() => history.push("/time-log")} />
        <Title>アクションの編集</Title>
        <IconContainer>
          <IconGrid onClick={(action) => history.push(`/time-log/edit-actions/edit/${action.id}`)} />
        </IconContainer>
        <Button onClick={() => history.push("/time-log/edit-actions/add")}> ＋ 新規アクション追加</Button>
      </Container>
    </Overlay>
  );

}

export default EditActionTop;