import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { RiDeleteBin5Line } from "react-icons/ri";


export default function DeletePost({postDetail, fetchData}) {

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');


	const [showDelete, setShowDelete] = useState(false);

	const openDelete = (postId) => {


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

		setShowDelete(true);
	}

	const closeDelete = () => {

		setShowDelete(false);

		setTitle('');
		setContent('');
	}


	const deletePost = (e, postId) => {

		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/deletePost/${postId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
		.then(res => res.json())
		.then(data => {

			if(data.message === 'Post and associated comments deleted successfully') {

				Swal.fire({
                    title: 'Deleted!',
                    icon: 'success',
                    text: 'Post Successfully Deleted'
                })

                closeDelete();
                fetchData();

			} else {

				Swal.fire({
                    title: 'Error!',
                    icon: 'error',
                    text: 'Please try again'
                })

                closeDelete();
                fetchData();
			}
		})
	}


	return(
		<>
			<Button className="icon-size" variant="danger" onClick={() => openDelete(postDetail._id)}><RiDeleteBin5Line /></Button>

			<Modal show={showDelete} onHide={closeDelete}>
				<Form onSubmit={e => deletePost(e, postDetail._id)} className="form-body">
					<Modal.Header closeButton>
						<Modal.Title>Are you sure you want to delete this post?</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p><b>Title:</b>  {postDetail.title}</p>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="warning" onClick={() => closeDelete()}>No</Button>
						<Button variant="danger" type="submit">Yes</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	)
}