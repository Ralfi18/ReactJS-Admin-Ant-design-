import React, { useEffect, useState, useContext } from "react"
import { Link, Outlet } from "react-router-dom"
import { connect } from 'react-redux';
import './App.css';
import { AuthContext } from "./Auth";
import {
	useNavigate,
	useLocation
} from "react-router-dom";
import { Layout, Menu, Button } from 'antd';
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	UserOutlined,
	VideoCameraOutlined,
	UploadOutlined,
} from '@ant-design/icons';
import { LOGOUT_USER, DELETE_SOCKET, CLEAR_INVENTORY } from "./store/types";

const { Header, Sider, Content } = Layout;
function MainLayout({ dispatch }) {
	const [collapsed, setCollapsed] = useState(false);
	const context = useContext(AuthContext)
	const navigate = useNavigate();
	const location = useLocation();
	return <Layout style={{ minHeight: '100vh' }}>
		<Sider collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} >
			<div className="logo" />
			<Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
				<Menu.Item key="1" icon={<UserOutlined />}>
					<Link to="/">Home Page</Link>
				</Menu.Item>
				<Menu.Item key="2" icon={<VideoCameraOutlined />}>
					<Link to="/inventory">Inventory</Link>
				</Menu.Item>
				<Menu.Item key="3" icon={<VideoCameraOutlined />} onClick={() => {
					// Logout
					context.setErrors(null);
					context.signOut(() => {
						dispatch({ type: LOGOUT_USER, payload: null });
						dispatch({ type: DELETE_SOCKET, payload: null });
						dispatch({ type: CLEAR_INVENTORY, payload: null });
						navigate("login", { replace: true });
					});
				}} >
					Logout
				</Menu.Item>
			</Menu>
		</Sider>
		<Layout className="site-layout">
			<Header className="site-layout-background" style={{ padding: 0 }}></Header>
			<Content
				className="site-layout-background"
				style={{
					margin: '24px 16px',
					padding: 24,
					minHeight: 280,
				}}
			>
				<Outlet />
			</Content>
		</Layout>

	</Layout>
}
const mapStateToProps = (state) => {
	return { user: state.userReducer.user };
}

const mapDispatchToProps = (dispatch) => {
	return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);