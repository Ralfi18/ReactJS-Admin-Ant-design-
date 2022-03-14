import React, { useContext, useState } from "react"
import { Table, Space, Modal, Form, Input, InputNumber } from 'antd';
// import { SET_SOCKET, UPDATE_INVENTORY } from "./store/types";
import { AuthContext } from "../Auth";
// import { connect } from 'react-redux';

const Inventory = ({ inventory, dispatch }) => {

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
					<a onClick={() => deleteInventory(record)}>Delete</a>
				</Space>
			),
		},	
	];
	const showModal = (record) => {
		setSelectedInventory(record);
		setIsModalVisible(true);
	};

	const handleOk = () => {
		console.log(selectedInventory)
		/** TODO: check if there is connection and if no then store in que for latter */
		context.socket.emit("updateProduct", { token: context.user.data.token, product: selectedInventory });
		// dispatch({ type: UPDATE_INVENTORY, payload: selectedInventory });
		setSelectedInventory(null);
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setSelectedInventory(null);
		setIsModalVisible(false);
	};

	const deleteInventory = () => {

	}

	const changeHandler = (value, name) => {
		console.log(value, name)
		console.log(value)
		let tmpPrd
		if(name == 'price') {
			tmpPrd = { ...selectedInventory, price: value } 
		} else if (name == 'name') {
			tmpPrd = { ...selectedInventory, name: value } 
		}
		setSelectedInventory(tmpPrd);
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
								<Input name="name" onChange={(e) => changeHandler(e.target.value, 'name')}  value={selectedInventory.name} />
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

export default Inventory;