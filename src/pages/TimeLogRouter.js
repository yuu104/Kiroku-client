import { Route } from "react-router-dom";
import { useState } from "react";
import TimeLog from "./timeLogs/TimeLog";
import EditActionTop from "./timeLogs/EditActionTop";
import EditAction from "./timeLogs/EditAction";
import AddAction from "./timeLogs/AddAction";

const TimeLogRouter = (props) => {

  const [forceRender, setForceRender] = useState(true);
  const changeForceRender = () => {
    setForceRender(!forceRender);
  }

  return (
    <>
      <Route
        path="/time-log"
        render={() => 
          <TimeLog 
            nowDay={props.nowDay} 
            changeDay={props.changeDay} 
            forceRender={forceRender} 
          />
        }
      />
      <Route path="/time-log/edit-actions/top" component={EditActionTop} />
      <Route 
        path="/time-log/edit-actions/edit/:id" 
        render={() => <EditAction changeForceRender={changeForceRender} />}
      />
      <Route 
        path="/time-log/edit-actions/add" 
        render={() => <AddAction changeForceRender={changeForceRender} />}
      />
    </>
  );
}

export default TimeLogRouter;