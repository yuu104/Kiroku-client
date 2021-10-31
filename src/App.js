import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { useState } from "react";
import EditAdd from "./pages/EditAdd";
import EditTop from "./pages/EditTop";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TimeRecord from "./pages/TimeRecord";
import EditAction from "./pages/EditAction";
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
          <Route path="/timeRecord" 
            render={() => <TimeRecord nowDay={nowDay} changeDay={changeDay} />}
          />
          <Route path="/EditTop" exact component={EditTop} />
          <Route path="/EditAdd" exact component={EditAdd} />
          <Route path="/EditAction/:id" exact component={EditAction} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
