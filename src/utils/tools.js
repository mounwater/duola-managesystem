export const serverUrl = 'http://localhost:1337';

export const uploadUrl = serverUrl + '/api/v1/common/upload_file';

export const setToken = (token) => sessionStorage.setItem('token', token);

export const getToken = () => sessionStorage.getItem('token');

export const removeToken = () => sessionStorage.removeItem('token');

export const isLogined = () => (getToken() ? true : false);

export const resetImg = (url) => {
  if (url) {
    if (url.startsWith('http')) {
      return url;
    }
    return serverUrl + url;
  }
  return 'https://img1.baidu.com/it/u=1792091187,3204342473&fm=26&fmt=auto&gp=0.jpg';
};
