import { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

export default function Register() {

	// creates context hooks to access the user context object and use its properties for user validation
    const { user } = useContext(UserContext);

    const navigate = useNavigate();

	// state hooks that will store the values of the input fields
	const [ userName, setUserName ] = useState("");
	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ confirmPassword, setConfirmPassword ] = useState("");
	// State hook that will determine whether the submit button is clickable or not
	const [ isActive, setIsActive ] = useState(false);


	function registerUser(e) {

		// prevents page refresh when submitting the form
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json"},
			body: JSON.stringify({
				userName: userName,
				email: email,
				password: password
			})
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);

			if(data.message === 'Registered Successfully') {
				setUserName("");
				setEmail("");
				setPassword("");
				setConfirmPassword("");

				Swal.fire({
                    title: 'Registration Successful',
                    icon: 'success',
                })
                navigate("/login");

			} else if(data.error === 'Email invalid') {

				Swal.fire({
                    title: 'Invalid Email Format',
                    icon: 'error',
                    text: 'Please enter a valid email address.'
                })

			} else if(data.error === 'Password must be atleast 8 characters	'){

				Swal.fire({
                    title: 'Password must be atleast 8 characters long',
                    icon: 'error',
                    text: 'Please enter a valid password.'
                })

			} else {

				Swal.fire({
                    title: 'Something went wrong',
                    icon: 'error',
                    text: 'Please try again.'
                })
			}
		})
	}


	useEffect(() => {

		if((userName !== "" && email !== "" && password !== "" && confirmPassword !== "") && (password === confirmPassword)) {

			setIsActive(true)
		} else {
			setIsActive(false)
		}

		// dependency - optional array - the useEffect runs only when there is a change in the inputs
	}, [userName, email, password, confirmPassword])




	return (

		user.id !== null ?
            <Navigate to="/login" />
        :
        	<div className="d-flex justify-content-center align-items-center my-5">
                <div className="border p-4 rounded form-body" style={{ width: '500px' }}>
				<Form onSubmit={e => registerUser(e)}>
					<h1 className="my-3 text-center">Register</h1>
					{/* Two way data binding, the form saves the data to the variable and also retrieves that data from the variable*/}
				    <Form.Group>
				        <Form.Label>Username:</Form.Label>
				        <Form.Control type="text" placeholder="Enter Username" value={userName} onChange={e => {setUserName(e.target.value)}} required/>
				    </Form.Group>

				    <Form.Group>
				        <Form.Label>Email:</Form.Label>
				        <Form.Control type="email" placeholder="Enter Email" value={email} onChange={e => {setEmail(e.target.value)}} required/>
				    </Form.Group>

				    <Form.Group>
				        <Form.Label>Password:</Form.Label>
				        <Form.Control type="password" placeholder="Enter Password" value={password} onChange={e => {setPassword(e.target.value)}} required/>
				    </Form.Group>

				    <Form.Group>
				        <Form.Label>Confirm Password:</Form.Label>
				        <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => {setConfirmPassword(e.target.value)}} required/>
				    </Form.Group>

				    {/* Conditional Rendering of submit button based on the isActive state */}
				    {
				    	isActive ?
				    	<Button variant="primary" type="submit" className='my-5 w-100'>Submit</Button>
				    	:
				    	<Button variant="secondary" type="submit" className='my-5 w-100' disabled>Submit</Button>
				    }
				    
				</Form>
			    	<p className="text-center mt-3">
	                        	Already have an account? <Link to="/login">Click here to login</Link>.
	                    	</p>     
                	</div>
            	</div> 
	)
}