import { useState } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { uploadUrl, resetImg } from '../utils/tools';

// function getBase64(img, callback) {
//   // FileReader是js中的一个api可以用来解析文件，把文件转换为base64
//   const reader = new FileReader();
//   reader.addEventListener("load", () => callback(reader.result));
//   reader.readAsDataURL(img);
// }

// 上传之前做验证
function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

function FileUpload(props) {
  const [loading, setLoading] = useState(false);
  const { imageUrl, setImgUrl } = props;

  // 文件上传的时候触发
  const handleChange = (info) => {
    // info.file.status 表示上传状态
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      // getBase64(info.file.originFileObj, (imageUrl) => {
      //   setLoading(false);
      //   setImgUrl(imageUrl);
      // });
      setLoading(false);
      console.log(info);
      setImgUrl(info.file.response.data);
    }
  };

  // 按钮
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      name="file"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      // action 表示文件上传路径
      action={uploadUrl}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img
          src={resetImg(imageUrl)}
          alt="avatar"
          style={{ maxWidth: '100%', maxHeight: '100px' }}
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
}

export default FileUpload;
