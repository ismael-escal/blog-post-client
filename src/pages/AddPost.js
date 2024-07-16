import { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';


export default function AddPost() {

	// creates context hooks to access the user context object and use its properties for user validation
    const { user } = useContext(UserContext);

    const navigate = useNavigate();


	// state hooks that will store the values of the input fields
	const [ title, setTitle ] = useState("");
	const [ content, setContent ] = useState("");
	// State hook that will determine whether the submit button is clickable or not
	const [ isActive, setIsActive ] = useState(false);


	function createPost(e) {

		// prevents page refresh when submitting the form
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/addPost`, {
			method: "POST",
			headers: { 
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				title: title,
				content: content,
				author: user.id
			})
		})
		.then(res => res.json())
		.then(data => {
			// console.log(data);

			if(data.error === 'Failed to save the Post'){

				Swal.fire({
                    title: 'Unsuccessful Blog Creation',
                    icon: 'error',
                    text: 'Please try again'
                })
			} else if(data._id){

				Swal.fire({
                    title: 'Blog Posted Successfully',
                    icon: 'success',
                })
                // Clear input fields after submission
				setTitle('');
			    setContent('');
                navigate("/posts");
			} else {

				Swal.fire({
                    title: 'Unsuccessful Blog Creation.',
                    icon: 'error'
                })
			} 
		})
	};


	useEffect(() => {

		if(title !== "" && content !== "") {

			setIsActive(true)
		} else {
			setIsActive(false)
		}

		// dependency - optional array - the useEffect runs only when there is a change in the inputs
	}, [title, content])




	return (

		user.id === null ?
            <Navigate to="/posts" />
        :	
        	<>
        	<h1 className="my-5 text-center">Create your Blog</h1>
        	<div className="d-flex justify-content-center align-items-center my-5">
                <div className="border p-4 border-info rounded form-body" style={{ width: '500px' }}>
					<Form onSubmit={e => createPost(e)}>
						{/* Two way data binding, the form saves the data to the variable and also retrieves that data from the variable*/}
					    <Form.Group>
					        <Form.Label>Blog Title:</Form.Label>
					        <Form.Control type="text" placeholder="Enter Blog Title" value={title} onChange={e => {setTitle(e.target.value)}} required/>
					    </Form.Group>

					    <Form.Group>
					        <Form.Label>Content:</Form.Label>
					        <Form.Control as="textarea" placeholder="Enter Content" value={content} onChange={e => {setContent(e.target.value)}} required rows="10"/>
					    </Form.Group>

					    <div className="d-flex justify-content-center">
					    {
					    	isActive ?
					    	<Button className="m-3" variant="primary" type="submit">Post Blog</Button>
					    	:
					    	<Button className="m-3" variant="secondary" type="submit" disabled>Post Blog</Button>
					    }
					    <Link className='btn btn-secondary m-3' to="/posts">Back</Link>
					    </div>
				    
			    	</Form>
		    	</div>
    		</div> 
    		</	>
	)
}