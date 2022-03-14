import React, { useContext } from "react"
import {
	useNavigate,
	useLocation
} from "react-router-dom";
import { AuthContext, useAuth } from "./Auth";
import { Form, Input, Button, Alert } from 'antd';
function LoginPage() {
	// const [errors, setErrors] = useState(false);
	const context = useContext(AuthContext)
	const navigate = useNavigate();
	const location = useLocation();
	const auth = useAuth();
	const from = location.state?.from?.pathname || "/";
	/** redirect tp base url if logged in */
	// useEffect(() => {
	// 	if(auth) { navigate("/", { replace: true }); }
	// }, []);

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
			<Form
				style={{ minWidth: "350px", border: "1px solid #d9d9d9", padding: "15px 15px 0px 15px" }}
				name="basic"
				layout="vertical"
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				{context.errors ? <Alert onClose={() => context.setErrors(null)} style={{ marginBottom: "15px" }} message={context.errors} type="error" closable showIcon /> : null}
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

export default LoginPage;