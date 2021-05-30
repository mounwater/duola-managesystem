import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Login from './pages/Login';
import Main from './pages/Main';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/main">
          <Main />
        </Route>
        <Redirect to="/main/maininfo" />
      </Switch>
    </Router>
  );
}

export default App;
