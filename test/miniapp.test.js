// noinspection DuplicatedCode

const chalk = require('chalk')

const PaySDK = require('../src/miniapp')
const {
  token,
  host,
  mp_alipay_appid,
  mp_alipay_openid,
  mp_wechat_openid,
  mp_wechat_appid,
} = require('./setting.json')


const sdk = new PaySDK({ token, host });
const getTime = () => '' + +new Date()

describe("测试支付宝小程序", () => {
  const amount = 100
  const order_id = getTime()
  const note = 'some note for this order'
  const timestamp = getTime()
  const params = {
    "amount": amount,
    "merchant_order_id": order_id,
    "note": note,
    "provider": "Ksher",
    "channel": 'alipay',
    "miniapp_openid": mp_alipay_openid,
    "miniapp_appid": mp_alipay_appid,
    "timestamp": timestamp,
  }

  test('创建支付宝订单', async () => {
    const { status, data } = await sdk.orderCreate(params)
    expect(status).toBe(200)

    // expect(data.amount).toBe(amount)
    // expect(data.merchant_order_id).toBe(order_id)
    // expect(data.note).toBe(note)
    // expect(data.timestamp).toBe(timestamp)
    // expect(data.status).toBe('Available')
    // expect(data.error_code).toBe('SUCCESS')
    // expect(data.api_name).toBe('Redirect')

    console.log(chalk.bgGreen('  '), chalk.green.bold('创建订单结果'), data);
    console.log(`orderStr:"${ chalk.green(data.reference) }"`);
  });

  test('查询订单', async () => {
    const timestamp = getTime()
    const { status, data } = await sdk.orderQuery(order_id, { timestamp })
    expect(status).toBe(200)

    // expect(data.merchant_order_id).toBe(order_id)
    // expect(data.timestamp).toBe(timestamp)
    // expect(data.api_name).toBe('Redirect')

    console.log(chalk.bgGreen('  '), chalk.green.bold('查询订单结果'), data);
  })

  test('退款订单', async () => {
    const timestamp = getTime()

    const refund_amount = 100

    const params = {
      "refund_amount": refund_amount,
      "timestamp": timestamp,
      "refund_order_id": order_id
    }

    const { status, data } = await sdk.orderRefund(order_id, params)
    expect(status).toBe(200)

    console.log(chalk.bgGreen('  '), chalk.green.bold('订单退款结果'), data);
  })
})


describe("测试微信小程序", () => {
  const amount = 100
  const order_id = getTime()
  const note = 'some note for this order'
  const timestamp = getTime()
  const params = {
    "amount": amount,
    "merchant_order_id": order_id,
    "note": note,
    "provider": "Ksher",
    "channel": 'wechat',
    "miniapp_openid": mp_wechat_openid,
    "miniapp_appid": mp_wechat_appid,
    "timestamp": timestamp,
  }

  test('创建微信订单', async () => {
    const { status, data } = await sdk.orderCreate(params)
    expect(status).toBe(200)

    // expect(data.amount).toBe(amount)
    // expect(data.merchant_order_id).toBe(order_id)
    // expect(data.note).toBe(note)
    // expect(data.timestamp).toBe(timestamp)
    // expect(data.status).toBe('Available')
    // expect(data.error_code).toBe('SUCCESS')
    // expect(data.api_name).toBe('Redirect')

    console.log(chalk.bgGreen('  '), chalk.green.bold('创建订单结果'), data);

    const {
      reference,
      paySign,
      signType,
      timestamp: timeStamp,
      nonceStr
    } = data
    const payData = {
      timeStamp,
      nonceStr,
      package: `prepay_id=${ reference }`,
      signType,
      paySign,
    }
    console.log(`支付参数: ${ chalk.green(JSON.stringify(payData, null, ' ')) }`);
  });

  test('查询订单', async () => {
    const timestamp = getTime()
    const { status, data } = await sdk.orderQuery(order_id, { timestamp })
    expect(status).toBe(200)

    // expect(data.merchant_order_id).toBe(order_id)
    // expect(data.timestamp).toBe(timestamp)
    // expect(data.api_name).toBe('Redirect')

    console.log(chalk.bgGreen('  '), chalk.green.bold('查询订单结果'), data);
  })

  test('退款订单', async () => {
    const timestamp = getTime()

    const refund_amount = 100

    const params = {
      "refund_amount": refund_amount,
      "timestamp": timestamp,
      "refund_order_id": order_id
    }

    const { status, data } = await sdk.orderRefund(order_id, params)
    expect(status).toBe(200)

    console.log(chalk.bgGreen('  '), chalk.green.bold('订单退款结果'), data);
  })
})
