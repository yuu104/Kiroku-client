import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useState } from 'react'
import axios from 'axios'

// styled-components →
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  @media (min-width: 600px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
const Box = styled.div`
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  @media (min-width: 600px) {
    width: 450px;
    border: 1px solid black;
    border-radius: 10px;
    padding: 15px 50px;
    box-sizing: border-box;
  }
`
const Kiroku = styled.h2`
  margin: 0;
  font-size: 20px;
`
const Title = styled.h2`
  margin: 5px 0 60px 0;
`
const InpBox = styled.div`
  margin-bottom: 60px;
`
const Label = styled.label`
  display: block;
  margin-top: 15px;
`
const Inp = styled.input`
  width: 100%;
  height: 35px;
  box-sizing: border-box;
`
const Span = styled.span`
  display: block;
  font-size: 15px;
  color: red;
`
const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  color: white;
  margin-bottom: 50px;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
  height: 35px;
  &:hover {
    opacity: 0.8;
  }
`
// ← styled-components

const Login: React.FC = () => {
  const history = useHistory()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isUsername, setIsUsername] = useState(true)
  const [isPassword, setIspassword] = useState(true)

  const onSubmit = () => {
    const data = { username, password }
    axios
      .post<LoginData>('http://localhost:3001/users/login', data)
      .then((res) => {
        if (res.data.message) {
          setIsUsername(false)
          setIspassword(true)
        } else if (!res.data.auth) {
          setIsUsername(true)
          setIspassword(false)
        } else if (res.data.auth) {
          localStorage.setItem('accessToken', res.data.token!)
          history.push('/time-log')
        }
      })
      .catch((err) => {
        console.log('err:', err)
      })
  }

  return (
    <Container>
      <Box>
        <Kiroku>Kiroku</Kiroku>
        <Title>ログイン</Title>
        <InpBox>
          <Label>ユーザ名</Label>
          <Inp type="text" onChange={(e) => setUsername(e.target.value)} />
          {!isUsername ? <Span>該当するユーザーが見つかりません</Span> : null}
        </InpBox>
        <InpBox>
          <Label>パスワード</Label>
          <Inp type="password" onChange={(e) => setPassword(e.target.value)} />
          {!isPassword ? <Span>パスワードが正しくありません</Span> : null}
        </InpBox>
        <Button onClick={onSubmit}>ログイン</Button>
      </Box>
    </Container>
  )
}

export default Login
