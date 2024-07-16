import './App.css';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Post from './pages/Post';
import PostDetail from './components/PostDetail';
import AddPost from './pages/AddPost';



import { UserProvider } from './UserContext';

function App() {

  //Add a global user state
  const [user, setUser] = useState({
    id: null,
    userName: null,
    email: null,
    isAdmin: null
  });


  const unsetUser = () => {
    localStorage.clear();
  }

  useEffect(() => {

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${ localStorage.getItem('token') }`
      }
    })
    .then(res => res.json())
    .then(data => {
      // console.log(data)

      if(data.auth === 'Failed'){
        setUser({
          id: null,
          isAdmin: null,
          userName: null,
          email:null
        })
      } else if(data.user.hasOwnProperty("_id")) {
        setUser({
          id: data.user._id,
          isAdmin: data.user.isAdmin,
          userName: data.user.userName,
          email:data.user.email
        })

      } else {
        setUser({
          id: null,
          isAdmin: null,
          userName: null,
          email:null
        })
      }

    })

    }, []);



  return (
    <UserProvider value={{user, setUser, unsetUser}}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/logout" element={<Logout/>} />
            <Route path="/posts" element={<Post />} />
            <Route path="/posts/:postId" element={<PostDetail />} />
            <Route path="/addPost" element={<AddPost />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
