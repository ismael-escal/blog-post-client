import { useState, useEffect, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Login() {

    // creates context hooks to access the user context object and use its properties for user validation
    const { user, setUser} = useContext(UserContext);

	// State hooks to store the values of the input fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // State to determine whether submit button is enabled or not
    const [isActive, setIsActive] = useState(false);

    function authenticate(e) {

        // Prevents page redirection via form submission
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
        	method: 'POST',
        	headers: { "Content-Type": "application/json" },
        	body: JSON.stringify({
           		email: email,
            	password: password
        	})
    	})
    	.then(res => res.json())
    	.then(data => {

            // check if no user info is found
            // typeof operator will return a string of the data type of the variable
	        if(typeof data.access !== "undefined"){

	        	// set the token of the authenticated user in the localStorage
	        	// localStorage.setItem('propertyName', value);
	        	localStorage.setItem('token', data.access);

                // setUser({ access : localStorage.getItem('token') })

                retrieveUserDetails(localStorage.getItem('token'));
                

                Swal.fire({
                    title: 'Login Successful',
                    icon: 'success',
                    text: 'Welcome to Blog Post App!'
                })
                // Clear input fields after submission
			    setEmail('');
			    setPassword('');
	        
	        } else if (data.error === "No Email Found") {

                Swal.fire({
                    title: 'Email not found',
                    icon: 'error',
                    text: 'Email does not exist.'
                })

	        } else if (data.error === "Email and password do not match") {

                Swal.fire({
                    title: 'Incorrect Email or Password',
                    icon: 'error',
                    text: 'Check your login details and try again.'
                })

	        } else {

                Swal.fire({
                    title: 'Something went wrong',
                    icon: 'error',
                    text: 'Check your login details and try again.'
                })
	        }
    	})

    };

    const retrieveUserDetails = (token) => {

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {

            // Changes the global "user" state to store the "id" and the "isAdmin" property of the user which will be used for validation across the whole application
            setUser({
                id: data.user._id,
                isAdmin: data.user.isAdmin,
                userName: data.user.userName,
                email:data.user.email,
            })
        })
    }

    useEffect(() => {

        // Validation to enable submit button when all fields are populated and both passwords match
        if(email !== '' && password !== '') {

            setIsActive(true);

        } else {

            setIsActive(false);
        }

    }, [email, password]);

    return (    
        // Conditional rendering if user is logged in or not
        user.id !== null ?
            <Navigate to="/posts" />
        :
            <div className="d-flex justify-content-center align-items-center my-5">
                <div className="border p-4 rounded form-body" style={{ width: '500px' }}>
                    <Form onSubmit={(e) => authenticate(e)}>
                        <h1 className="my-5 text-center">Login</h1>

                        <Form.Group controlId="userEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        { 
                        	isActive ? 
            	            	<Button variant="primary" type="submit" id="submitBtn" className='my-5 w-100'>Submit</Button>
            	        	: 
            	            	<Button variant="secondary" type="submit" id="submitBtn" className='my-5 w-100' disabled>Submit</Button>
                        }
                    </Form>
                    <p className="text-center mt-3">
                        Don't have an account yet? <Link to="/register">Click here to register</Link>.
                    </p>     
                </div>
            </div>  
    )
}