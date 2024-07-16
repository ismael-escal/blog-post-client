import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaRegEdit } from "react-icons/fa";


export default function EditPost({postDetail, fetchData}) {

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');

	const [showEdit, setShowEdit] = useState(false);

	const openEdit = (postId) => {


		fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/getPost/${postId}`,{
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
		.then(res => res.json())
		.then(data => {

			//console.log(data);

			setTitle(data.post.title);
			setContent(data.post.content);
		})

		setShowEdit(true);
	}

	const closeEdit = () => {

		setShowEdit(false);

		setTitle('');
		setContent('');
	}

	const editPost = (e, postId) => {

		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/updatePost/${postId}`, {
			method: "PATCH",
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				title,
				content
			})
		})
		.then(res => res.json())
		.then(data => {

			if(data.message === 'Post updated successfully') {

				Swal.fire({
                    title: 'Success!',
                    icon: 'success',
                    text: 'Post Successfully Updated'
                })

                closeEdit();
                fetchData();

			} else {

				Swal.fire({
                    title: 'Error!',
                    icon: 'error',
                    text: 'Please try again'
                })

                closeEdit();
                fetchData();
			}
		})
	}


	return(
		<>
			<Button className="icon-size" variant="primary" onClick={() => openEdit(postDetail._id)}><FaRegEdit /></Button>


			<Modal show={showEdit} onHide={closeEdit}>
				<Form onSubmit={e => editPost(e, postDetail._id)} className="form-body">
					<Modal.Header closeButton>
						<Modal.Title>Edit Blog</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group>
							<Form.Label>Title</Form.Label>
							<Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} required />
						</Form.Group>
						<Form.Group>
							<Form.Label>Content</Form.Label>
							<Form.Control as="textarea" value={content} onChange={e => setContent(e.target.value)} required />
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={() => closeEdit()}>Close</Button>
						<Button variant="primary" type="submit">Update</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	)
}