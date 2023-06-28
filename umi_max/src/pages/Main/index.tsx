import { connect, history, Outlet } from '@umijs/max';
import { useEffect, useState } from 'react';
import styles from './index.less';
const MainPage: React.FC = ({ dispatch, authModel }: any) => {
  const [auth, setAuth] = useState(false);
  const [first, setFirst] = useState(0);

  if (first === 0) {
    console.log("Main: authModel/getAuth")
    dispatch({
      type: 'authModel/getAuth',
    });
    setFirst(1);
  }

  useEffect(() => {
    setAuth(authModel.auth);
    console.log('token:', authModel.auth, 'path:', history.location.pathname);
  }, [history.location]);

  return (
    <div className={styles['main-area']}>
      <div className={styles['main-fit']}>
        <Outlet />
      </div>
      {/* {`权限${auth}`} */}
    </div>
  );
};

export default connect((state: any) => state)(MainPage);
