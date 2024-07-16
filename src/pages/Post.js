import { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';


const fetchPostsUrl = `${process.env.REACT_APP_API_BASE_URL}/posts/getPosts`;


export default function Posts() {
    const { user } = useContext(UserContext);
    const { postId } = useParams();

    const [posts, setPosts] = useState([]);
    const [postDetail, setPostDetail] = useState(null);
    const [comments, setComments] = useState([]);


    useEffect(() => {
        fetch(fetchPostsUrl)
            .then(res => res.json())
            .then(data => setPosts(data.posts || []));
    }, []);

    useEffect(() => {
        if (postId) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/getPost/${postId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
                .then(res => res.json())
                .then(data => {
                    setPostDetail(data.post);
                    setComments(data.comments || []);
                });
        }
    }, [postId]);


    const truncateContent = (content) => {
        if (content.length > 40) {
            return content.substring(0, 100) + "...";
        }
        return content;
    };

    return (
        <Container>
        	<div className="d-flex justify-content-end align-items-center my-4">
        		{
        			user.id !== null ?
            			<Link className="btn btn-warning mx-2" to="/addPost">Post a Blog</Link>
            		:
            			<span></span>
        		}
            </div>
            <Row>
                {posts.map(post => (
                    <Col xs={12} md={4} key={post._id} className="mt-3">
                        <Card className="cardHighlight form-body text-light">
                            <Card.Body>
                                <Card.Title>{post.title}</Card.Title>
                                <Card.Text>{truncateContent(post.content)}</Card.Text>
                                <Link to={`/posts/${post._id}`} className="btn btn-primary">Read More</Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
