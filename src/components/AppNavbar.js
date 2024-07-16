import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { Link, NavLink } from 'react-router-dom';

import UserContext from '../UserContext';

export default function AppNavbar() {

    const { user } = useContext(UserContext);

	return(
		<Navbar bg="dark" variant="dark" expand="lg">
			<Container fluid>
			    <Navbar.Brand as={Link} to="/" className="text-light">Blog Post</Navbar.Brand>
			    <Navbar.Toggle aria-controls="basic-navbar-nav" />
			    <Navbar.Collapse id="basic-navbar-nav">
				    <Nav className="ms-auto">
				        <Nav.Link as={NavLink} to="/" exact="true" className="text-light">Home</Nav.Link>
                        {
                            user.id
                            ?
                            <>	
                            	<Nav.Link as={Link} to="/posts" className="text-light">Blogs</Nav.Link>
                                <Nav.Link as={Link} to="/logout" className="text-light">Logout</Nav.Link>
                            </>
                            :
                            <>
                            	<Nav.Link as={Link} to="/posts" className="text-light">Blogs</Nav.Link>
                                <Nav.Link as={Link} to="/login" className="text-light">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register" className="text-light">Register</Nav.Link>
                            </>

                        }
				    </Nav>
			    </Navbar.Collapse>
			</Container>
		</Navbar>
		)
}