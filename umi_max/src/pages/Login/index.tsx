import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { connect, request, useNavigate } from '@umijs/max';
import { Space, Tabs, message } from 'antd';
import type { CSSProperties } from 'react';
import React, { useState } from 'react';

type LoginType = 'phone' | 'account';

const iconStyles: CSSProperties = {
  marginInlineStart: '16px',
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '24px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

const tabItem = [
  { label: '账户密码登录', key: 'account' },
  { label: '手机号登录', key: 'phone' },
];

interface loginParams {
  username: string;
  password: string;
}
interface loginRes {
  code: number;
  msg: string;
  token: string;
  id: string;
}
//需要添加验证码功能
const LoginBox: React.FC = ({ dispatch, authModel,socketModel }: any) => {
  const [loginType, setLoginType] = useState<LoginType>('account');
  const navigate = useNavigate();
  const onSubmit = async (values: loginParams) => {
    request('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        username: values.username,
        password: values.password,
      },
    }).then(async function (response: loginRes) {
      if (response.code === 100) {
        sessionStorage.setItem('username', values.username);
        sessionStorage.setItem('id', response.id);
        sessionStorage.setItem('token', response.token);
        await dispatch({type: 'authModel/loginSuccess'})
        await dispatch({type:'socketModel/loginSuccess'})
        navigate('/chat');
      } else {
        sessionStorage.removeItem('token');
      }
      console.log(response.msg);
    });
  };

  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: 'white' }}>
        <LoginForm
          // logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
          onFinish={onSubmit}
          title="Chat-OL"
          subTitle="网上聊天室"
          actions={
            <Space>
              其他登录方式
              <AlipayCircleOutlined style={iconStyles} />
              <TaobaoCircleOutlined style={iconStyles} />
              <WeiboCircleOutlined style={iconStyles} />
            </Space>
          }
        >
          <Tabs
            centered
            activeKey={loginType}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
            items={tabItem}
          ></Tabs>
          {loginType === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} />,
                }}
                placeholder={'用户名'}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                placeholder={'密码'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </>
          )}
          {loginType === 'phone' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={'prefixIcon'} />,
                }}
                name="mobile"
                placeholder={'手机号'}
                rules={[
                  {
                    required: true,
                    message: '请输入手机号！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！',
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={'请输入验证码'}
                captchaTextRender={(timing: any, count: any) => {
                  if (timing) {
                    return `${count} ${'获取验证码'}`;
                  }
                  return '获取验证码';
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                ]}
                onGetCaptcha={async () => {
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码
            </a>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};

export default connect((state: any) => state)(LoginBox);
