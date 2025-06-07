import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';

export const Logout = () => {
  const navigate = useNavigate();
  const { setUserToken } = useUser();

  useEffect(() => {
    localStorage.removeItem('userToken');

    setUserToken(null);

    navigate('/login');
  }, [navigate, setUserToken]);

  return null;
};
