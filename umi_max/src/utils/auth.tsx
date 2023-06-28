import { authToken } from '@/services/apiTest';
import { Outlet, useNavigate } from '@umijs/max';
import React, { useEffect, useState } from 'react';

const authView: React.FC = ({ dispatch, authModel }: any) => {
  const nav = useNavigate();
  const [show, setShow] = useState(false);

  const judge = async () => {
    const auth = await authToken();
    if (!auth) {
      nav('/login');
    } else {
      if (!show) setShow(true);
    }
  };

  judge();
  return <>{show && <Outlet />}</>;
};

export default authView;
