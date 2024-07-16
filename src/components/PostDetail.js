import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Button,  Modal, Form } from 'react-bootstrap';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import EditPost from '../components/EditPost';

const fetchPostUrl = (id) => `${process.env.REACT_APP_API_BASE_URL}/posts/getPost/${id}`;

export default function PostDetail() {
    const { user } = useContext(UserContext);
    const { postId } = useParams();

    const [postDetail, setPostDetail] = useState(null);
    const [comments, setComments] = useState([]);
    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState("");

    // useEffect(() => {
    //     if (postId) {
    //         fetch(fetchPostUrl(postId), {
    //             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    //         })
    //             .then(res => res.json())
    //             .then(data => {
    //                 setPostDetail(data.post);
    //                 setComments(data.comments || []);
    //             });
    //     }
    // }, [postId]);

    const fetchData = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/getPost/${postId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.post) {
                setPostDetail(data.post);
                setComments(data.comments || []);
            } else {
                setPostDetail(null);
            }
        });
    };

    useEffect(() => {
        fetchData();
    }, [user.id]);

    const openComment = () => setShowComment(true);
    const closeComment = () => {
        setComment("");
        setShowComment(false);
    };

    const addComment = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/comments/addComment/${postId}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ comment })
        })
        .then(res => res.json())
        .then(data => {
            if (data._id) {
                Swal.fire({
                    title: 'Success!',
                    icon: 'success',
                    text: 'Comment Added'
                });
                closeComment();
                setComments([...comments, { _id: data._id, comment: data.comment, author: data.author }]);
            } else {
                Swal.fire({
                    title: 'Error!',
                    icon: 'error',
                    text: 'Please try again'
                });
                closeComment();
            }
        });
    };

    if (!postDetail) {
        return <Container>Loading...</Container>;
    }

    return (
        <>
            <Container className="mt-5">
                <Card className="cardHighlight mt-3 justify-content-center form-body text-light" border="info">
                    <Card.Body className="text-left">
                        <Card.Title className="pb-2 text-center card-subtitle">{postDetail.title.toUpperCase()}</Card.Title>
                        {
                            user.id === postDetail.author._id ?
                                <div className="d-flex justify-content-end">
                                    <EditPost postDetail={postDetail} fetchData={fetchData}/>
                                    
                                    <Link className="text-danger icon-size"><RiDeleteBin5Line /></Link>
                                </div>
                                
                            :
                                user.isAdmin ?
                                    <div className="d-flex justify-content-end">
                                        <Link className="text-danger icon-size"><RiDeleteBin5Line /></Link>
                                    </div>
                                :
                                    <div className="d-flex justify-content-end"></div>
                        }
                        <Card.Text>{postDetail.content}</Card.Text>
                        <Card.Subtitle className="card-subtitle pt-5">Author:</Card.Subtitle>
                        <Card.Text>{postDetail.author.userName}</Card.Text>
                        <Card.Subtitle className="card-subtitle pt-5">Comments:</Card.Subtitle>
                        {comments.length > 0 ? (
                            comments.map(comment => (
                                <Card key={comment._id} className="my-2">
                                    <Card.Body>
                                        <Card.Text>
                                            <strong>{comment.author.userName}:</strong> 
                                            {comment.comment}
                                            {
                                                user.id === comment.author._id ?
                                                    <div className="d-flex justify-content-end">
                                                        <Link className="text-primary me-3 icon-size"><FaRegEdit /></Link>
                                                        <Link className="text-danger icon-size"><RiDeleteBin5Line /></Link>
                                                    </div>
                                                :
                                                    user.isAdmin ?
                                                        <div className="d-flex justify-content-end">
                                                            <Link className="text-danger icon-size"><RiDeleteBin5Line /></Link>
                                                        </div>
                                                    :
                                                        <div className="d-flex justify-content-end"></div>
                                            }
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <Card.Text>No comments yet.</Card.Text>
                        )}
                        <br />
                        {
                            user.id !== null ?
                                <Button className="d-flex justify-content-center my-3" variant="primary" onClick={openComment}>Add Comment</Button>
                            :
                                <Link className='btn btn-primary mb-3' to="/login">Login to add a comment</Link>
                        }
                        <Link className='btn btn-secondary mb-3' to="/posts">Back</Link>
                    </Card.Body>
                </Card>
            </Container>

            <Modal show={showComment} onHide={closeComment}>
                <Form onSubmit={addComment} className="form-body">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Comment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Comment:</Form.Label>
                            <Form.Control type="text" value={comment} onChange={e => setComment(e.target.value)} required />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeComment}>Close</Button>
                        <Button variant="danger" type="submit">Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}
