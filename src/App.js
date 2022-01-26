import React, { useContext, useState, useEffect } from "react"
import { Routes, BrowserRouter as Router, Route, Link, Outlet } from "react-router-dom";
import io from "socket.io-client";
import { AuthProvider, RequireAuth, RequireNotAuth } from "./Auth";
import LoginPage from "./LoginPage";
import MainLayout from "./Layout";
import { connect } from 'react-redux';
import { SET_SOCKET, UPDATE_INVENTORY } from "./store/types";
import { AuthContext, useAuth } from "./Auth";
import { Table, Space, Modal, Form, Input, InputNumber } from 'antd';

function Home({ user }) {
	const [message, setMessage] = useState("");
	const context = useContext(AuthContext)
	function handleSubmit(e) {
		e.preventDefault();
		context.socket.emit("message", { token: user.data.token, msg: message });
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<input type="text" onChange={(event) => setMessage(event.target.value)} />
				<input type="submit" value="Submit" />
			</form>
		</>
	)
}

const Inventory = ({ inventory, dispatch }) => {
	// console.log(inventory)
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedInventory, setSelectedInventory] = useState(null);
	const context = useContext(AuthContext);
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			// render: text => <a>{text}</a>
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
			render: value => {
				const prc = parseFloat(value).toLocaleString('gb-GB', { style: 'currency', currency: 'GBP' }); 

				return <span><b>{prc}</b></span>;
			}
		},	
		{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<Space size="middle">
					<a onClick={() => showModal(record)}>Edit</a>
					<a>Delete</a>
				</Space>
			),
		},	
	];
	const showModal = (record) => {
		setSelectedInventory(record);
		setIsModalVisible(true);
	};

	const handleOk = () => {
		context.socket.emit("udapteProduct", { token: context.user.data.token, product: selectedInventory });
		// dispatch({ type: UPDATE_INVENTORY, payload: selectedInventory });
		setSelectedInventory(null);
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setSelectedInventory(null);
		setIsModalVisible(false);
	};

	const changeHandler = (value, name) => {
		console.log(value, name)
		console.log(value)
	}; 

	const pagination = {
      // current: 1,
      pageSize: 10,
    };
	return (
		<>
			<h1>Inventory Page</h1>
			<Table pagination={pagination} columns={columns} dataSource={inventory.data} rowKey={(record) => record.code } />
			<Modal title="Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
				{
					selectedInventory ?
					<>
						<Form
							labelCol={{span: 4}}
							wrapperCol={{span: 14}}
							layout="vertical"			
						>
							<Form.Item label="Product name">
								<Input name="name" onChange={(e) => changeHandler(e.target.value, 'name')} defaultValue="" value={selectedInventory.name} />
							</Form.Item>
							<Form.Item label="Price">
								<InputNumber 
									name="price" 
									onChange={(value) => changeHandler(value, 'price')} 
									onStep={(value, info) => {
								
										const price = info.type == "up" ? parseFloat((selectedInventory.price + 0.01).toFixed(2)) : parseFloat((selectedInventory.price - 0.01).toFixed(2));
										const tmpInv = {...selectedInventory, price}
										setSelectedInventory(tmpInv)
									}}
									defaultValue="" 
									value={selectedInventory.price} 
								/>
							</Form.Item>
						</Form>
					</>
					:
					<>No inventory selected</>
				}
			</Modal>
		</>
	)
};

function App({ user, inventory, dispatch }) {
	return (
		<div className="App">
			<AuthProvider loggedUser={user} dispatch={dispatch} >
				<Router>
					<Routes>
						<Route element={<RequireAuth><MainLayout /></RequireAuth>}>
							<Route path="/" element={<Home user={user} />} />
							<Route path="/inventory" element={<Inventory inventory={inventory} dispatch={dispatch} />} />
						</Route>
						<Route path="/login" element={<RequireNotAuth><LoginPage /></RequireNotAuth>} />
					</Routes>
				</Router>
			</AuthProvider>
		</div>
	);
}

const mapStateToProps = (state) => {
	return { 
		user: state.userReducer.user,
		inventory: state.inventory
	};
}

const mapDispatchToProps = (dispatch) => {
	return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
