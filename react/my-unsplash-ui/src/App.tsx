import  NavBar  from './components/NavBar'
import LikedPhotos from './pages/LikedPhotos'
import Home from './pages/Home'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import './index.css'

function App() {

  return (
    <Router>
    <div className="App">
      <NavBar/>
      <div className="page">
        <Switch>
          <Route path='/' exact>
            <Home/>
          </Route>
          <Route path='/MyLikedPhotos'>
            <LikedPhotos/>
          </Route>
        </Switch>
      </div>
    </div>
    </Router>
  )
}

export default App
