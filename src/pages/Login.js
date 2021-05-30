import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Input, message } from 'antd';
import '../assets/css/login.css';
import { managersLogin } from '../services/login';
import { setToken, removeToken } from '../utils/tools';

function Login() {
  const usernameRef = useRef();
  const pwdRef = useRef();
  const history = useHistory();
  useEffect(() => {
    //清空token（每次跳转到登录页即清除token，防止用户回退）
    removeToken();
  }, []);
  const managerLogin = () => {
    // console.log(usernameRef.current.state.value);
    // console.log(pwdRef.current.state.value);
    const userName = usernameRef.current.state.value;
    const password = pwdRef.current.state.value;
    const user = { userName: userName, password: password };
    console.log('success', user);
    managersLogin(user).then((res) => {
      console.log(res);
      if (res.code === 1) {
        // console.log('登录成功！');
        message.success('登录成功！');
        setToken(res.data);
        sessionStorage.setItem('managerName', userName);
        history.push('/main/maininfo');
      } else {
        message.error(res.data);
      }
    });
  };
  return (
    <div>
      <div className="loginBox">
        <h3>哆啦管理员登录</h3>
        <p>
          用户名：
          <Input type="text" ref={usernameRef} />
        </p>
        <p>
          密码：
          {/* admin */}
          <Input type="password" ref={pwdRef} />
        </p>
        <Button onClick={() => managerLogin()} className="loginBtn btn">
          登录
        </Button>
      </div>
    </div>
  );
}

export default Login;
