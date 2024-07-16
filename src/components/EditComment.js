import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaRegEdit } from "react-icons/fa";


export default function EditComment({commentId, fetchData}) {

	const [comment, setComment] = useState('');

	const [showEdit, setShowEdit] = useState(false);

	const openEdit = (commentId) => {


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

		setShowEdit(true);
	}

	const closeEdit = () => {

		setShowEdit(false);

		setComment('');
	}

	const editComment = (e, commentId) => {

		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_BASE_URL}/comments/updateComment/${commentId}`, {
			method: "PATCH",
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				comment
			})
		})
		.then(res => res.json())
		.then(data => {

			if(data.message === 'Comment updated successfully') {

				Swal.fire({
                    title: 'Success!',
                    icon: 'success',
                    text: 'Comment Successfully Updated'
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
			<Button className="icon-size mx-2" variant="primary" onClick={() => openEdit(commentId)}><FaRegEdit /></Button>


			<Modal show={showEdit} onHide={closeEdit}>
				<Form onSubmit={e => editComment(e, commentId)} className="form-body">
					<Modal.Header closeButton>
						<Modal.Title>Edit Comment</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group>
							<Form.Label>Comment</Form.Label>
							<Form.Control type="text" value={comment} onChange={e => setComment(e.target.value)} required />
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