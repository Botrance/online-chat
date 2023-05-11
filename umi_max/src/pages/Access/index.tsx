import { testToken } from '@/services/apiTest';
import { PageContainer } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useState } from 'react';

let authenticate = () => {
  // 获取页面中存储的token
  let token = sessionStorage.getItem('token');
  // 根据是否存在token,返回不同的值
  return token ? true : false
}

const AccessPage: React.FC = () => {
  const [loginState,setLoginState]=useState(false);
  testToken();
  return (
    <PageContainer
      ghost
      header={{
        title: '权限示例',
      }}
    >
      <Button>只有 Admin 可以看到这个按钮</Button>
    </PageContainer>
  );
};

export default AccessPage;
