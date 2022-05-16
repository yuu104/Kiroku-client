import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import TimeLog from './pages/timeLogs/TimeLog'
import './App.css'

const App: React.FC = () => {
  const [nowDay, setNowDay] = useState(new Date())
  const changeDay = (key: string | Date | null) => {
    let newDate
    if (!key) return
    if (key === 'prev') {
      newDate = nowDay.getDate() - 1
      setNowDay(new Date(nowDay.getFullYear(), nowDay.getMonth(), newDate))
    } else if (key === 'next') {
      newDate = nowDay.getDate() + 1
      setNowDay(new Date(nowDay.getFullYear(), nowDay.getMonth(), newDate))
    } else {
      setNowDay(new Date(key))
    }
  }

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route
            path="/time-log"
            render={() => <TimeLog nowDay={nowDay} changeDay={changeDay} />}
          />
        </Switch>
      </Router>
    </div>
  )
}

export default App
