import { Link } from "react-router-dom";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Link as Scroll } from "react-scroll";
import pieImg from "../images/pie.png";
import top24h from "../images/top24h.png";
import topTotal from "../images/topTotal.png";
import startAction from "../images/startAction.png";
import nowAction from "../images/nowAction.png";
import editRecord from "../images/editRecord.png";
import editAction from "../images/editAction.png";
import HomeHeader from "../components/HomeHeader";
import Description from "../components/Description";


// styled-components →
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding-bottom: 50px;
`;
const TitleBox = styled.div`
  margin: 100px auto 200px auto;
  width: 90%;
  max-width: 600px;
`;
const Title = styled.h1`
  font-size: 27px;
  text-align: center;
  @media (min-width: 600px) {
    font-size: 32px;
  }
`;
const PieImgContainer = styled.div`
  width: 270px;
  margin: 0 auto;
  @media (min-width: 600px) {
    width: 400px;
  }
`;
const PieImg = styled.img`
  width: 100%;
`;
const SubTitle = styled.p`
  color: rgb(0, 0, 0, 0.5);
  font-size: 16px;
  //font-weight: 600;
  margin-top: 30px;
  @media (min-width: 600px) {
    font-size: 20px;
  }
`;
const ArrowBtnContainer = styled(Scroll)`
  width: 30px;
  height: 30px;
  margin: 40px auto 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;
const ArrowBtn = styled(FontAwesomeIcon)`
  color: rgba(0, 0, 0, 0.5);
`;
const Button = styled(Link)`
  display: flex;
  border: 1px solid black;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  color: black;
  text-decoration: none;
  width: 110px;
  height: 30px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  @media (min-width: 600px) {
    width: 170px;
    height: 40px;
    font-size: 20px;
  }
`;
const DescContainer = styled.div`
  width: 90%;
  margin-bottom: 150px;
  @media (min-width: 600px) {
    margin-bottom: 200px;
  }
`;
// ← styled-components


const Home = () => {

  let history = useHistory();

  useEffect(() => {
    axios.get("https://kiroku-server.herokuapp.com/auth",
      {
        headers: {accessToken: localStorage.getItem("accessToken")}
      }
    ).then((res) => {
      console.log(res.data.isInvalid);
      if (!res.data.isInvalid) history.push("/timeRecord");
    })
  }, [history]);

  return (
    <>
      <HomeHeader />
      <Container>
        {/* <Title>Kiroku</Title> */}
        <TitleBox>
          <Title>毎日の行動を記録しよう</Title>
          <PieImgContainer>
            <PieImg src={pieImg} />
          </PieImgContainer>
          <SubTitle>
            Kirokuは1日の行動を記録し、可視化できるサイトです。日々の行動を振り返り、無駄にした時間に気づくことができます。
          </SubTitle>
          <ArrowBtnContainer to='desc1' smooth={true} duration={600} offset={-70}>
            <ArrowBtn icon={faChevronDown} />
          </ArrowBtnContainer>
        </TitleBox>
        {/* <ButtonContainer>
          <Button to="/login">ログイン</Button>
          <Button to="/signup">サインアップ</Button>
        </ButtonContainer> */}
        <DescContainer id='desc1'>
          <Description
            title="円グラフで行動記録を見やすく"
            img1={top24h}
            img2={topTotal}
            desc="1日の行動記録が円グラフで表示されます。時間を順に表示したグラフと行動ごとに合計時間を自動計算したグラフの2種類で切り替え可能です。"
          />
          <ArrowBtnContainer to='desc2' smooth={true} duration={600} offset={-70}>
            <ArrowBtn icon={faChevronDown} />
          </ArrowBtnContainer>
        </DescContainer>
        <DescContainer id='desc2'>
          <Description
            title="記録方法は簡単です"
            img1={startAction}
            img2={nowAction}
            desc={`画面下側にある、登録されたアクションのアイコンから選択し、開始時間を確認してください。開始ボタンを押すと記録が開始され、現在進行中のアクションが表示されます。\n記録を停止したい場合は「実行中アクション」の右側にある停止アイコンを押してください。`}
          />
          <ArrowBtnContainer to='desc3' smooth={true} duration={600} offset={-70}>
            <ArrowBtn icon={faChevronDown} />
          </ArrowBtnContainer>
        </DescContainer>
        <DescContainer id='desc3'>
          <Description
            title="記録とアクションの編集"
            img1={editRecord}
            img2={editAction}
            desc={`左は1日の行動記録を追加・編集・削除できる画面です。編集または削除を行う際は、該当する項目を選択してください。\n右は登録されているアクションを追加・編集・削除できる画面です。`}
          />
        </DescContainer>
        <Button to="/login">はじめる</Button>
      </Container>
    </>
  );

}

export default Home;