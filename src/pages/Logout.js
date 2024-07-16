import { Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import UserContext from '../UserContext';

export default function Logout(){

	const { setUser, unsetUser } = useContext(UserContext);


	// to clear the contents of localStorage
	//localStorage.clear();
	unsetUser();

	useEffect(() => {
		setUser({ 
			// access: null 
			id: null,
		    userName: null,
		    email: null,
		    isAdmin: null
		});
	})


	// to redirect user to Login page after sign out
	return (

		<Navigate to="/login" />
	)
}