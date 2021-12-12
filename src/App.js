import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { useState } from "react";
import AddAction from "./pages/timeLogs/AddAction";
import EditActionTop from "./pages/timeLogs/EditActionTop";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TimeLog from "./pages/timeLogs/TimeLog";
import EditAction from "./pages/timeLogs/EditAction";
import './App.css'

function App() {

  const [nowDay, setNowDay] = useState(new Date());
  const changeDay = (key) => {
    let newDate;
    if (key === "prev") {
      newDate = nowDay.getDate() - 1;
      setNowDay(new Date(nowDay.getFullYear(), nowDay.getMonth(), newDate));
    } else if (key === "next") {
      newDate = nowDay.getDate() +1;
      setNowDay(new Date(nowDay.getFullYear(), nowDay.getMonth(), newDate));
    } else {
      setNowDay(new Date(key));
    }
  }

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/time-log"
            render={() => <TimeLog nowDay={nowDay} changeDay={changeDay} />}
          />
          <Route path="/edit-top" exact component={EditActionTop} />
          <Route path="/edit-add" exact component={AddAction} />
          <Route path="/edit-action/:id" exact component={EditAction} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
