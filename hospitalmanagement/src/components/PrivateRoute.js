import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { HospitalContext } from '../context/HospitalContext';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
    const { isAuthenticated, currentUser, loading } = useContext(HospitalContext);

    // If loading auth state, you might want to show a spinner
    // For now we proceed assuming checks are fast or handled

    if (loading.patients && !isAuthenticated) {
        // simple check if loading initial data
        return <div>Loading...</div>;
    }

    return (
        <Route
            {...rest}
            render={(props) => {
                if (!isAuthenticated) {
                    console.log('PrivateRoute Redirecting: Not Authenticated', { isAuthenticated, currentUser });
                    // Not logged in
                    return <Redirect to="/admin/login" />;
                }

                if (roles && roles.length > 0 && !roles.includes(currentUser?.role)) {
                    console.log('PrivateRoute Redirecting: Role mismatch', { expected: roles, actual: currentUser?.role });
                    // Role not authorized
                    return <Redirect to="/" />;
                }

                // Authorized
                return <Component {...props} />;
            }}
        />
    );
};

export default PrivateRoute;
