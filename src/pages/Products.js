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
  Select,
  Radio,
} from 'antd';
import {
  EditFilled,
  DeleteFilled,
  CheckOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  loadProducts,
  addProduct,
  modifyProduct,
  delProduct,
} from '../services/products';
import { getCategories } from '../services/categories';
import FileUpload from '../components/FileUpload';
import { resetImg } from '../utils/tools';

function Products() {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const [myform] = Form.useForm();
  const [isShow, setIsShow] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [imageUrl, setImgUrl] = useState('');
  const [category, setCategory] = useState([]);
  const [value, setValue] = useState(1);
  const loadData = async () => {
    const res = await loadProducts(page);
    console.log(res);
    setList(res.data);
    setTotal(res.total);
  };
  useEffect(() => {
    loadData();
    getCategories().then((res) => {
      // console.log(res);
      setCategory(res.data);
    });
  }, [page]);
  const onChange = (e) => {
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
      title: '名字',
      dataIndex: 'name',
    },
    {
      title: '分类',
      render(d) {
        return <>{d.category ? d.category.name : '暂无分类'}</>;
      },
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
      title: '价格',
      dataIndex: 'price',
    },
    {
      title: '是否在售',
      render(d) {
        return (
          <>
            {d.onSale ? (
              <span style={{ fontSize: '16px', color: '#90d749' }}>
                <CheckOutlined />
                在售中
              </span>
            ) : (
              <span style={{ color: '#d7a29a' }}>
                <ExclamationCircleOutlined />
                已下架
              </span>
            )}
          </>
        );
      },
    },
    {
      title: '库存',
      dataIndex: 'amount',
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
                setCurrentId(d.id); // 设置当前id
                setImgUrl(d.coverImage);
                myform.setFieldsValue({
                  name: d.name,
                  price: d.price,
                  amount: d.amount,
                  desc: d.desc,
                  content: d.content,
                  category: d.category.id,
                  onSale: d.onSale,
                });
              }}
              type="primary"
            />
            <Popconfirm
              title="是否删除该商品？"
              okText="是"
              cancelText="否"
              onConfirm={async () => {
                await delProduct(d.id);
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
    <Card
      title="商品管理"
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
        title="商品管理"
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
              await modifyProduct(currentId, { ...e, coverImage: imageUrl });
              message.success('修改成功！');
            } else {
              await addProduct({ ...e, coverImage: imageUrl });
              message.success('新增成功！');
            }
            setCurrentId('');
            loadData();
            setIsShow(false);
          }}
        >
          <Form.Item
            label="名字"
            name="name"
            rules={[{ required: true, message: '名字不能为空！' }]}
          >
            <Input placeholder="请输入商品名" />
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
          <Form.Item
            label="价格"
            name="price"
            rules={[{ required: true, message: '价格不能为空！' }]}
          >
            <Input placeholder="请输入价格" />
          </Form.Item>
          <Form.Item label="分类" name="category">
            <Select>
              {category.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="库存"
            name="amount"
            rules={[{ required: true, message: '库存不能为空！' }]}
          >
            <Input placeholder="请输入库存" />
          </Form.Item>
          <Form.Item label="状态" name="onSale">
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={0}>下架</Radio>
              <Radio value={1}>在售</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

export default Products;
