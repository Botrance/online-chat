import { ProForm } from '@ant-design/pro-components';
import { connect, history, request } from '@umijs/max';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import React from 'react';
import './index.less'
const { Option } = Select;

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();

  const onSubmit = async (values: { userName: any; password: any }) => {
    request('/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        userName: values.userName,
        password: values.password,
      },
    }).then(async function (response) {
      console.log(response.msg);
      history.push('/login');
    });
  };

  const prefixSelector = (
    <ProForm.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </ProForm.Item>
  );

  return (
    <div className='register-page'>
      <ProForm
        form={form}
        labelCol={{ span: 16,offset:3}}
        wrapperCol={{ span: 18,offset:3 }}
        name="register"
        onFinish={onSubmit}
        initialValues={{ prefix: '86' }}
        style={{ maxWidth: 600,minWidth:400 }}
        scrollToFirstError
        submitter={false}
      >
        <ProForm.Item
          name="userName"
          label="用户名"
          rules={[
            { required: true, message: '请输入用户名', whitespace: true },
          ]}
        >
          <Input />
        </ProForm.Item>

        <ProForm.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: '请输入您的密码!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </ProForm.Item>

        <ProForm.Item
          name="confirm"
          label="确认密码"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请确认您的密码!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </ProForm.Item>

        <ProForm.Item
          name="email"
          label="邮箱"
          rules={[
            {
              type: 'email',
              message: '输入的邮箱不合法!',
            },
            {
              required: false,
            },
          ]}
        >
          <Input />
        </ProForm.Item>

        <ProForm.Item
          name="phone"
          label="手机号"
          rules={[{ required: false, message: '请输入手机号!' }]}
        >
          <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
        </ProForm.Item>

        {/* 
      <ProForm.Item label="Captcha" extra="We must make sure that your are a human.">
        <Row gutter={8}>
          <Col span={12}>
            <ProForm.Item
              name="captcha"
              noStyle
              rules={[{ required: true, message: 'Please input the captcha you got!' }]}
            >
              <Input />
            </ProForm.Item>
          </Col>
          <Col span={12}>
            <Button>Get captcha</Button>
          </Col>
        </Row>
      </ProForm.Item> */}

        <ProForm.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('请同意用户协议')),
            },
          ]}
        >
          <Checkbox>
            我已阅读并同意 <a href="">协议</a>
          </Checkbox>
        </ProForm.Item>
        <ProForm.Item style={{paddingLeft:"25%"}}>
          <Button style={{width:"150px"}} type="primary" htmlType="submit">
            注册
          </Button>
        </ProForm.Item>


      </ProForm>
    </div>
  );
};

export default connect((state: any) => state)(RegisterPage);
