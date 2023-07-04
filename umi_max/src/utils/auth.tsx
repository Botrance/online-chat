import { authToken } from '@/services/apiTest';
import { connect } from '@umijs/max';
import { Outlet, useNavigate } from '@umijs/max';
import React, { useEffect, useState } from 'react';

const authView: React.FC = ({ dispatch, authModel }: any) => {
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [auth, setAuth] = useState(undefined); // 设置初始值为 undefined 不同于 false 和 true 的值

  useEffect(() => {
    setAuth(authModel.auth);
  }, [authModel.auth]);

  useEffect(() => {
    if (auth === false) {
      nav('/login');
    } else {
      if (!show) setShow(true);
    }
  }, [auth]);

  useEffect(() => {
    dispatch({ type: 'authModel/getAuth' });
  }, [dispatch]);

  return <>{show && <Outlet />}</>;
};

export default connect((state: any) => state)(authView);
