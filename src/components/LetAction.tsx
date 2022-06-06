import styled from 'styled-components'

const Element = styled.div`
  display: inline-block;
  border-bottom: 2px solid rgb(55, 53, 47);
  width: 250px;
  font-size: 15px;
  padding-bottom: 5px;
  @media (min-width: 376px) {
    font-size: 17px;
    padding-bottom: 10px;
  }
`

const LetAction: React.FC = () => <Element>今すぐ行動を記録しよう！</Element>

export default LetAction
