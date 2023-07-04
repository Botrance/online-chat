import { connect, history, Outlet } from '@umijs/max';
import { useEffect, useState } from 'react';
import styles from './index.less';
const MainPage: React.FC = ({ dispatch, authModel }: any) => {

  useEffect(() => {
    console.log('token:', authModel.auth, 'path:', history.location.pathname);
  }, [history.location]);

  return (
    <div className={styles['main-area']}>
      <div className={styles['main-fit']}>
        <Outlet />
      </div>
    </div>
  );
};

export default connect((state: any) => state)(MainPage);
