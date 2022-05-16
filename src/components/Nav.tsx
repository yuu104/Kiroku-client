import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  bottom: 0;
  height: 50px;
  width: 100%;
  //background-color: rgb(242, 245, 254);

  @media (min-width: 600px) {
    position: static;
    width: 70px;
    min-width: 70px;
    border-top: none;
    height: 100vh;
  }
  /* @media(min-width: 1200px) {
    width: 250px;
  } */
`

const Nav: React.FC = () => <Container />

export default Nav
