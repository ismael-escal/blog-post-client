import React from 'react';

// createContext() is used to create a context object
// context object is an object that can be used to store information that can be shared to other components within the app
const UserContext = React.createContext();

// Provider component allows other components to use the context object and supply the necessary information needed to the context object
export const UserProvider = UserContext.Provider;

export default UserContext;