import styled from 'styled-components'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'

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
const Inp = styled(Field)`
  width: 100%;
  height: 35px;
  box-sizing: border-box;
`
const Label = styled.label`
  display: block;
  margin-bottom: 15px;
`
const Error = styled(ErrorMessage as any)`
  color: red;
`
const Span = styled.span`
  display: block;
  font-size: 15px;
  color: red;
`
const Button = styled.button`
  outline: none;
  background-color: black;
  color: white;
  width: 100%;
  height: 35px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  margin-bottom: 50px;
  border-radius: 5px;
  &:hover {
    opacity: 0.8;
  }
`
// ← styled-components

type PostData = {
  username: string
  password: string
}

const Signup: React.FC = () => {
  const history = useHistory()

  const initialValues = {
    username: '',
    password: '',
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(1).max(15).required(),
    password: Yup.string().min(8).max(20).required(),
  })

  const [availability, setAvailability] = useState(true)

  const onSubmit = (data: PostData) => {
    axios
      .post('https://kiroku-server.herokuapp.com/users/signup', data)
      .then((res) => {
        if (res.data) {
          setAvailability(true)
          history.push('/time-log')
        } else {
          setAvailability(false)
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
        <Title>サインアップ</Title>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <InpBox>
              <Label>ユーザ名</Label>
              <Inp
                type="text"
                name="username"
                placeholder="1〜15字で登録してください"
              />
              <Error name="username" component="span" />
              {!availability ? (
                <Span>このユーザー名は使用できません</Span>
              ) : null}
            </InpBox>
            <InpBox>
              <Label>パスワード</Label>
              <Inp
                type="password"
                name="password"
                placeholder="8〜15字で登録してください"
              />
              <Error name="password" component="span" />
            </InpBox>
            <Button type="submit">サインアップ</Button>
          </Form>
        </Formik>
      </Box>
    </Container>
  )
}

export default Signup
