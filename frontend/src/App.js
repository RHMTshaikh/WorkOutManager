import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

//pages and componenets
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import GoogleAuthPage from "./pages/GoogleAuthPage";

function App() { // name of the component must be in strat with capoital 
  const { user } = useAuthContext()
  
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
        <div className="pages">
          <Routes>
            <Route path = {`/`}       element={ user ? <Home/>   : <Navigate to={`/login`} />} />
            <Route path = {`/login`}  element={!user ? <Login/>  : <Navigate to={`/`}     /> } />
            <Route path = {`/signup`} element={!user ? <Signup/> : <Navigate to={`/`}     /> } />
            <Route path = {`/aftergoogleauthpagesignup`} element={<GoogleAuthPage SignupOrLoginProp={{'type':"signup"}}/> }       />
            <Route path = {`/aftergoogleauthpagelogin`} element={<GoogleAuthPage SignupOrLoginProp={{'type':"login"}}/>  }         />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;