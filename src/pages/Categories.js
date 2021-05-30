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
} from 'antd';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import {
  getCategories,
  addCategories,
  modifyCategories,
  delCategories,
} from '../services/categories';
import FileUpload from '../components/FileUpload';
import { resetImg } from '../utils/tools';

function Categories() {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const [myform] = Form.useForm();
  const [isShow, setIsShow] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [imageUrl, setImgUrl] = useState('');
  const loadData = async () => {
    const res = await getCategories(page);
    console.log(res);
    setList(res.data);
    setTotal(res.total);
  };
  useEffect(() => {
    loadData();
  }, [page]);

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
      title: '分类名',
      dataIndex: 'name',
    },
    {
      title: '主图',
      render(d) {
        return (
          <img
            src={resetImg(d.coverImage)}
            alt={d.name}
            style={{ width: '100px' }}
          />
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '操作',
      render(d) {
        return (
          <>
            <Button
              icon={<EditFilled />}
              onClick={() => {
                setIsShow(true);
                // console.log(d.id);
                setCurrentId(d.id); // 设置当前id
                setImgUrl(d.coverImage);
                myform.setFieldsValue({
                  name: d.name,
                  desc: d.desc,
                });
              }}
              type="primary"
            />
            <Popconfirm
              title="是否删除该商品？"
              okText="是"
              cancelText="否"
              onConfirm={async () => {
                await delCategories(d.id);
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
          <Button
            onClick={() => {
              setIsShow(true);
              setImgUrl('');
            }}
          >
            新增
          </Button>
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
          title="商品分类管理"
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
              console.log(e);
              if (currentId) {
                await modifyCategories(currentId, {
                  ...e,
                  coverImage: imageUrl,
                });
                message.success('修改成功！');
              } else {
                await addCategories({ ...e, coverImage: imageUrl });
                message.success('新增成功！');
              }
              setCurrentId('');
              loadData();
              setIsShow(false);
            }}
          >
            <Form.Item
              label="分类名"
              name="name"
              rules={[{ required: true, message: '分类名不能为空！' }]}
            >
              <Input placeholder="请输入分类名" />
            </Form.Item>
            <Form.Item label="图片">
              <FileUpload imageUrl={imageUrl} setImgUrl={setImgUrl} />
            </Form.Item>
            <Form.Item
              label="描述"
              name="desc"
              rules={[{ required: true, message: '描述信息不能为空！' }]}
            >
              <Input type="text" placeholder="请输入描述信息" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}

export default Categories;
