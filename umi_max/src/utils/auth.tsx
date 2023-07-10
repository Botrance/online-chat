import { AuthModelState } from '@/models/authModel';
import { Dispatch, Outlet, connect, useNavigate } from '@umijs/max';
import React, { useEffect, useState } from 'react';

interface AuthViewProps {
  dispatch: Dispatch;
  authModel: AuthModelState;
}

const AuthView: React.FC<AuthViewProps> = ({ dispatch, authModel }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  console.log('authView now check the token');
  useEffect(() => {
    const auth = authModel.auth;
    if (auth === undefined) {
      dispatch({ type: 'authModel/getAuth' });
    } else if (auth === false) {
      navigate('/login');
    } else {
      if (!show) setShow(true);
    }
  }, [dispatch, authModel.auth, navigate, show]);

  return <>{show && <Outlet />}</>;
};

export default connect((state: any) => state)(AuthView);
