import { connect, history, Outlet } from '@umijs/max';
import { useEffect, useState } from 'react';
import styles from './index.less';
import '@/global/global.less'
import { Dispatch } from '@umijs/max';
import { AuthModelState } from '@/models/authModel';

interface MainPageProps {
  dispatch: Dispatch;
  authModel: AuthModelState;
}

const MainPage: React.FC<MainPageProps> = ({ dispatch, authModel }) => {

  useEffect(() => {
    console.log('token:', authModel.auth, 'path:', history.location.pathname);
    
  }, [history.location]);

  useEffect(() => {
    const handlePopstate = (event: { preventDefault: () => void; }) => {
      const auth = authModel.auth;

      // 在这里执行权限检测逻辑
      if (!auth) {
        // 如果没有权限，则阻止用户继续执行前进和后退操作
        event.preventDefault();
      }
    };

    // 添加popstate监听器
    window.addEventListener('popstate', handlePopstate);

    // 在useEffect的返回函数中删除popstate监听器
    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);


  return (
    <div className={styles['main-area']}>
      <div className={styles['main-fit']}>
        <Outlet />
      </div>
    </div>
  );
};

export default connect((state: any) => state)(MainPage);
