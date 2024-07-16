import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { RiDeleteBin5Line } from "react-icons/ri";


export default function DeleteComment({commentId, fetchData}) {

	const [comment, setComment] = useState('');

	const [showDelete, setShowDelete] = useState(false);

	const openDelete = (commentId) => {


		fetch(`${process.env.REACT_APP_API_BASE_URL}/comments/getComment/${commentId}`,{
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
		.then(res => res.json())
		.then(data => {

			//console.log(data);
			setComment(data.comment.comment);
		})

		setShowDelete(true);
	}

	const closeDelete = () => {

		setShowDelete(false);

		setComment('');
	}


	const deleteComment = (e, commentId) => {

		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_BASE_URL}/comments/deleteComment/${commentId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
		.then(res => res.json())
		.then(data => {

			if(data.message === 'Comment deleted successfully') {

				Swal.fire({
                    title: 'Deleted!',
                    icon: 'success',
                    text: 'Comment Successfully Deleted'
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
			<Button className="icon-size" variant="danger" onClick={() => openDelete(commentId)}><RiDeleteBin5Line /></Button>

			<Modal show={showDelete} onHide={closeDelete}>
				<Form onSubmit={e => deleteComment(e, commentId)} className="form-body">
					<Modal.Header closeButton>
						<Modal.Title>Are you sure you want to delete this comment?</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p><b>Comment:</b>  {comment}</p>
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