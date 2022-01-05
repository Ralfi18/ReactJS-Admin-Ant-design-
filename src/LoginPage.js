import React, { useContext, useState } from "react"
import {
    useNavigate,
    useLocation
} from "react-router-dom";
import { AuthContext, useAuth } from "./Auth";
import { Form, Input, Button, Checkbox, Alert } from 'antd';
export default function LoginPage() {
    const [errors, setErrors] = useState(false);
    const context = useContext(AuthContext)
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();
    const from = location.state?.from?.pathname || "/";
    // function handleSubmit(event) {
    //     event.preventDefault();
    //     const formData = new FormData(event.currentTarget);
    //     const username = formData.get("username");
    //     const password = formData.get("password");
    //     auth.signIn(username, password, () => {
    //         navigate(from, { replace: true });
    //     });
    // }
      const onFinish = (values) => {

        auth.signIn(values.username, values.password, () => {
            navigate(from, { replace: true });
        });
      };

      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    return (
        <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
{/*            <p>You must log in to view the page at {from}</p>
            { context.errors ? <span>{context.errors}</span> : null }
            <form onSubmit={handleSubmit}>
                <label>
                    Username: <input name="username" type="text" />
                </label>
                <label>
                    Password: <input name="password" type="text" />
                </label>
                <button type="submit">Login</button>
            </form>*/}


            <Form
                style={{ minWidth: "500px", border: "1px solid #d9d9d9", padding: "15px 15px 0px 15px" }}
                name="basic"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                { context.errors ? <Alert onClose={ () => context.setErrors(null) } style={{ marginBottom: "15px" }} message={context.errors} type="error" closable showIcon /> : null }
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your username!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>


              <Form.Item style={{ textAlign: "right" }} >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>

        </div>
    );
}
