import { connect, history, Outlet } from '@umijs/max';
import { useEffect, useState } from 'react';
import styles from './index.less';
const MainPage: React.FC = ({ dispatch, authModel }: any) => {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    setAuth(authModel.auth);
    console.log(authModel.auth);
    console.log(history.location);
  });

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
