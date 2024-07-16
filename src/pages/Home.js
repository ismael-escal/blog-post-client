import { Row, Col } from 'react-bootstrap';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Home() {

    const { user } = useContext(UserContext);

	return (
		<>
        <Row className="mt-5">
            <Col className="p-4 text-center">
                <h1>Welcome To Blog Post Application</h1>
                <p>Read Blogs from people across the world and share your thoughts.</p>
                <Link className="btn btn-primary" to={'/posts'}>Check Blogs</Link> 
            </Col>
        </Row>
		</>
	)
}