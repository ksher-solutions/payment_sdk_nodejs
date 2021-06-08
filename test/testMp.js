const PaySDK = require('../src/miniapp')

const { token, host, mp_alipay_appid, mp_alipay_openid } = require('./setting.json')

const sdk = new PaySDK({ token, host });

;(() => {

  const order_id = getTime();

  testCreateOrder(100, order_id)

  // 测试创建订单
  testCreateOrder(100, order_id).then(() => {
    // 测试订单退款
    testOrderRefund(order_id, 10).then(() => {
    })
    // 测试查询订单
    testQueryOrder(order_id).then(() => {
      // 测试订单退款
      testOrderRefund(order_id, 10).then(() => {
      })

      // 测试取消订单
      // testOrderCancel(order_id).then(() => {
      // })
    })
  })
})()


// 获取时间戳
function getTime() {
  return (+new Date).toString()
}

// 测试创建订单
async function testCreateOrder(amount, order_id = getTime()) {
  console.log('');
  console.log(`------------------测试创建订单-----------------------`);

  const data = {
    "amount": amount,
    "merchant_order_id": order_id,
    "note": "some note for this order",
    "timestamp": getTime(),
    "channel": "alipay",
    "miniapp_openid": mp_alipay_openid,
    "miniapp_appid": mp_alipay_appid,
  }

  console.log(data);

  return sdk.orderCreate(data).then(res => {
    console.log('------------------创建订单成功!-----------------------');
    console.log(res.data);
    console.log('');

  }).catch(err => {
    console.log('------------------创建订单失败!!!-----------------------');
    console.log(err);
    console.log('');
    return Promise.reject()
  })
}

// 测试查询订单
async function testQueryOrder(order_id) {
  console.log('');
  console.log(`测试查询订单:  订单id: ${ order_id }`);

  return sdk.orderQuery(order_id, { timestamp: getTime() }).then(res => {
    console.log('');
    console.log('------------------查询订单成功!-----------------------');
    console.log(res.data);
    console.log('');
  }).catch(err => {
    console.log('');
    console.log('------------------查询订单失败!!!-----------------------');
    console.log(err);
    console.log('');
    return Promise.reject()
  })

}

// 测试退款订单
async function testOrderRefund(order_id, refund_amount) {
  console.log('');
  console.log(`------------------测试退款订单-----------------------`);

  const data = {
    "refund_amount": refund_amount,
    "timestamp": getTime(),
    "refund_order_id": order_id
  }

  console.log(data);
  return sdk.orderRefund(data).then(res => {
    console.log('');
    console.log('------------------退款订单成功!-----------------------');
    console.log(res.data);
    console.log('');
  }).catch(err => {
    console.log('');
    console.log('------------------退款订单失败!!!-----------------------');
    console.log(err);
    console.log('');
    return Promise.reject()
  })

}

// 测试取消订单
async function testOrderCancel(order_id) {
  console.log('');
  console.log(`------------------测试取消订单-----------------------`);

  const data = {
    "timestamp": getTime(),
  }

  console.log(data);
  return sdk.orderCancel(order_id, data).then(res => {
    console.log('');
    console.log('------------------取消订单成功!-----------------------');
    console.log(res.data);
    console.log('');
  }).catch(err => {
    console.log('');
    console.log('------------------取消订单失败!!!-----------------------');
    console.log(err);
    console.log('');
    return Promise.reject()
  })

}

