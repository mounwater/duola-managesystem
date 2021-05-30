import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  message,
  Input,
  Popconfirm,
  Radio,
  Switch,
} from 'antd';
import {
  EditFilled,
  DeleteFilled,
  LockOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import {
  getUsers,
  modifyUsers,
  delUsers,
  addUsers,
  lockUsers,
} from '../services/users';
import FileUpload from '../components/FileUpload';
import { resetImg } from '../utils/tools';

function Users() {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const [myform] = Form.useForm();
  const [isShow, setIsShow] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [imageUrl, setImgUrl] = useState('');
  // const [isLocked, setIsLocked] = useState(false);
  const [value, setValue] = useState(1);
  const [disable, setDisable] = useState(false);

  const loadData = async () => {
    const res = await getUsers(page);
    console.log(res);
    setList(res.data);
    setTotal(res.total);
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  const columns = [
    {
      title: '序号',
      width: 80,
      align: 'center',
      render(d, r, index) {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'userName',
    },
    {
      title: '昵称',
      align: 'center',
      dataIndex: 'nickName',
    },
    {
      title: '性别',
      align: 'center',
      dataIndex: 'gender',
    },
    {
      title: '生日',
      align: 'center',
      dataIndex: 'birthday',
    },
    {
      title: '年龄',
      align: 'center',
      dataIndex: 'age',
    },
    {
      title: '楼栋信息',
      align: 'center',
      dataIndex: 'area',
    },
    {
      title: '详细地址',
      align: 'center',
      dataIndex: 'address',
    },
    {
      title: '头像',
      align: 'center',
      render(d) {
        return (
          <img
            src={resetImg(d.avatar)}
            alt={d.name}
            style={{ width: '100px' }}
          />
        );
      },
    },
    {
      title: '状态',
      align: 'center',
      render(d) {
        return (
          <>
            {d.isLocked ? (
              <span style={{ color: '#d7a29a' }}>
                <LockOutlined />
              </span>
            ) : (
              <span style={{ fontSize: '16px', color: '#90d749' }}>
                <KeyOutlined />
              </span>
            )}
          </>
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      render(d) {
        return (
          <>
            <Button
              icon={<EditFilled />}
              onClick={() => {
                setIsShow(true);
                // console.log(d.id);
                setCurrentId(d.id); // 设置当前id
                setImgUrl(d.avatar);
                myform.setFieldsValue({
                  userName: d.userName,
                  nickName: d.nickName,
                  age: d.age,
                  area: d.area,
                  address: d.address,
                  birthday: d.birthday,
                  gender: d.gender,
                });
              }}
              type="primary"
            />
            <Popconfirm
              title="是否删除该商品？"
              okText="是"
              cancelText="否"
              onConfirm={async () => {
                await delUsers(d.id);
                message.success('删除成功!');
                loadData();
              }}
            >
              <Button
                type="primary"
                danger
                icon={<DeleteFilled />}
                style={{ marginLeft: '0.8rem' }}
              />
            </Popconfirm>
            <Popconfirm
              title={d.isLocked ? '是否解锁该用户？' : '是否锁定该用户？'}
              okText="是"
              cancelText="否"
              onConfirm={async () => {
                const res = await lockUsers(d.id, Number(!d.isLocked));
                console.log(res);
                message.success('操作成功!');
                loadData();
              }}
            >
              <Button
                type="primary"
                danger
                icon={d.isLocked ? <KeyOutlined /> : <LockOutlined />}
                style={{ marginLeft: '0.8rem' }}
              />
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Card
        title="商品分类管理"
        extra={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {disable ? (
              <Button
                onClick={() => {
                  setIsShow(true);
                  setImgUrl('');
                }}
                // disabled
              >
                新增
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setIsShow(true);
                  setImgUrl('');
                }}
                disabled
              >
                新增
              </Button>
            )}
            <Switch
              size="small"
              checked={disable}
              onChange={() => setDisable(!disable)}
            />
          </div>
        }
      >
        <Table
          bordered
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={{
            onChange: (page) => {
              setPage(page);
            },
            total: total,
            showSizeChanger: false,
          }}
        ></Table>
        <Modal
          title="用户管理"
          visible={isShow}
          destroyOnClose={true}
          okText="保存"
          cancelText="取消"
          onOk={() => {
            myform.submit();
          }}
          onCancel={() => {
            setIsShow(false);
            message.info('已取消操作！');
          }}
        >
          <Form
            preserve={false}
            form={myform}
            onFinish={async (e) => {
              // console.log(e);
              if (currentId) {
                await modifyUsers(currentId, {
                  ...e,
                  avatar: imageUrl,
                });
                message.success('修改成功！');
              } else {
                await addUsers({ ...e, avatar: imageUrl });
                message.success('新增成功！');
              }
              setCurrentId('');
              loadData();
              setIsShow(false);
            }}
          >
            <Form.Item
              label="用户名"
              name="userName"
              rules={[{ required: true, message: '用户名不能为空！' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              label="昵称"
              name="nickName"
              rules={[{ required: true, message: '昵称不能为空！' }]}
            >
              <Input type="text" placeholder="请输入昵称" />
            </Form.Item>
            <Form.Item label="性别" name="gender">
              <Radio.Group onChange={onChange} value={value}>
                <Radio value="男">男</Radio>
                <Radio value="女">女</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="生日"
              name="birthday"
              rules={[{ required: true, message: '生日不能为空！' }]}
            >
              <Input type="text" placeholder="请输入生日" />
            </Form.Item>
            <Form.Item
              label="年龄"
              name="age"
              rules={[{ required: true, message: '年龄不能为空！' }]}
            >
              <Input type="text" placeholder="请输入年龄" />
            </Form.Item>
            <Form.Item
              label="楼栋信息"
              name="area"
              rules={[{ required: true, message: '楼栋信息不能为空！' }]}
            >
              <Input type="text" placeholder="请输入楼栋信息" />
            </Form.Item>
            <Form.Item
              label="详细地址"
              name="address"
              rules={[{ required: true, message: '详细地址不能为空！' }]}
            >
              <Input type="text" placeholder="请输入详细地址" />
            </Form.Item>
            <Form.Item label="头像">
              <FileUpload imageUrl={imageUrl} setImgUrl={setImgUrl} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}

export default Users;
