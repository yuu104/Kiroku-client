import styled from "styled-components";
import { Link } from "react-router-dom";

// styled-components →
const Container = styled.div`
  position: fixed;
  top: 0;
  z-index: 30;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  @media (min-width: 600px) {
    height: 70px;
  }
`;
const Title = styled.h1`
  margin: 0;
  margin-left: 30px;
  font-size: 20px;
  @media (min-width: 600px) {
    font-size: 23px;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 20px;
  width: 170px;
  @media (min-width: 600px) {
    width: 210px;
  }
`;
const Button = styled(Link)`
  display: flex;
  border: 1px solid black;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  color: black;
  font-size: 12px;
  width: 80px;
  height: 25px;
  text-decoration: none;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  @media (min-width: 600px) {
    width: 100px;
    height: 30px;
  }
`;
// ← styled-components

const HomeHeader = () => {
  return (
    <Container>
      <Title>Kiroku</Title>
      <ButtonContainer>
        <Button to="/signup">サインアップ</Button>
        <Button to="login">ログイン</Button>
      </ButtonContainer>
    </Container>
  );
};

export default HomeHeader;
