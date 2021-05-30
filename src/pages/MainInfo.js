import React, { useState, useEffect } from 'react';
// import { render } from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
/* import { getCategories } from '../services/categories';
import { loadProducts } from '../services/products'; */
import { getUsers } from '../services/users';

function MainInfo() {
  const [userList, setUserList] = useState([]);
  const getData = async () => {
    /*  const categories = await getCategories();
    const products = await loadProducts(); */
    const users = await getUsers();
    console.group('用户数据');
    console.log(
      /* categories.data.length,
      products.data.length, */
      users.data.length,
      users.data
    );
    console.groupEnd('');
    const userAge = [];
    users.data.map((item) => {
      return userAge.push(item.age);
    });
    // console.log(userAge);
    let userAgeData = [];
    let hash = [];
    userAge.forEach((item) => {
      //根据年龄去重
      if (hash.indexOf(item) === -1) {
        hash.push(item);
        userAgeData.push({
          name: item + '岁',
          y: userAge.filter((age) => age === item).length,
        });
      }
      return userAgeData;
    });
    console.log(userAgeData);
    setUserList([...userAgeData]);
  };
  useEffect(() => {
    getData();
  }, []);
  const userAgeOptions = {
    title: {
      text: '用户年龄一览',
    },
    series: [
      {
        name: 'Brands',
        type: 'pie',
        colorByPoint: true,
        data: userList,
      },
    ],
  };
  return (
    <div>
      <h1>数据看板</h1>
      <div className="userAge">
        <HighchartsReact
          highcharts={Highcharts}
          options={userAgeOptions}
          containerProps={{ className: 'chartContainer' }}
        />
      </div>
    </div>
  );
}

export default MainInfo;
