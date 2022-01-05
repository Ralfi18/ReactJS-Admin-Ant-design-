import React, { useEffect, useState, useContext } from "react"
import { Link, Outlet } from "react-router-dom"
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

const { Header, Sider, Content } = Layout;


const MainLayout = () => {
	const [collapsed, setCollapsed] = useState(false);
	const context = useContext(AuthContext)
    const navigate = useNavigate();
    const location = useLocation();
	return <Layout style={{ minHeight: '100vh' }}>
{/* onCollapse={() => setCollapsed(!collapsed)} */}
		<Sider collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} >
			<div className="logo" />
			<Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
				<Menu.Item key="1" icon={<UserOutlined />}>
				  	<Link to="/">Home Page</Link>
				</Menu.Item>
				<Menu.Item key="2" icon={<VideoCameraOutlined />}>
				 	<Link to="/about">About Page</Link>
				</Menu.Item>
				<Menu.Item key="3" icon={<VideoCameraOutlined />} onClick={() => { 
					// Logout
					context.setErrors(null);
					navigate("login", { replace: true }); 
				}} >
				    Logout
				</Menu.Item>
			</Menu>
		</Sider>

		<Layout className="site-layout">
		  <Header className="site-layout-background" style={{ padding: 0 }}>
{/*		    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
		      className: 'trigger',
		      onClick: () => setCollapsed(!collapsed),
		    })}*/}
		  </Header>
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


export default MainLayout;