import styled from "styled-components";

// styled-components →
const Title = styled.h2`
  font-size: 17px;
  @media (min-width: 600px) {
    font-size: 32px;
  }
`;
const ImgContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  background-color: #f9f5f1;
  padding: 20px 0;
`;
const Img = styled.img`
  width: 130px;
  box-shadow: 0 2px 8px rgb(84 70 35 / 15%), 0 1px 3px rgb(84 70 35 / 15%);
  @media (min-width: 600px) {
    width: 250px;
  }
`;
const Desc = styled.div`
  font-size: 15px;
  //font-weight: 600;
  margin-top: 10px;
  color: rgba(0, 0, 0, 0.5);
  white-space: pre-line;
  @media (min-width: 600px) {
    font-size: 20px;
  }
`;
// ← styled-components

const Description = (props) => {
  return (
    <>
      <Title>{props.title}</Title>
      <ImgContainer>
        <Img src={props.img1} />
        <Img src={props.img2} />
      </ImgContainer>
      <Desc>{props.desc}</Desc>
    </>
  );
};

export default Description;
