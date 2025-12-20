import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function ProtectedRoute({ children }) {
    const isLoggedIn = Cookies.get('loggedIn') === 'true';
    const user = Cookies.get('user');

    useEffect(() => {
        // Nếu chưa đăng nhập, đảm bảo xóa các cookie cũ
        if (!isLoggedIn || !user) {
            Cookies.remove('loggedIn');
            Cookies.remove('user');
            Cookies.remove('name');
        }
    }, [isLoggedIn, user]);

    if (!isLoggedIn || !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

