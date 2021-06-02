const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const koaStatic = require('koa-static')
const cors = require('koa-cors');
const koaBody = require('koa-body')
const PaySDK = require('../index')

// 配置信息
const { token, host, port } = require('./setting.json')
const $redirect_url = "http://www.baidu.com"
const $redirect_url_fail = "http://www.baidu.com"

// 本地服务
const app = new Koa()

// sdk 初始化
const ksherPaymentSDK = new PaySDK({ token, host });


// 静态 demo
app.use(koaStatic(path.join(__dirname, './static')))

// cors跨域设置
app.use(cors());

// bodyparser
app.use(koaBody())

// 挂载路由
const router = getRouter()
app
  .use(router.routes())
  .use(router.allowedMethods())

// 启动服务
app.listen(port, async () => {
  console.log(`app started at port ${ port }`)
});

// 获取时间戳
function getTime() {
  return (+new Date).toString()
}

// 接口路由
function getRouter() {
  // 接口
  const router = new Router()

  // 创建订单接口
  router.post('/api/orderCreate', async (ctx, next) => {
    const {
      note = "some note for this order",
      provider = 'Ksher',
      redirect_url = $redirect_url,
      redirect_url_fail = $redirect_url_fail,
      timestamp = getTime(),
      amount,
      merchant_order_id,
    } = ctx.request.body

    if (!amount || !merchant_order_id) {
      ctx.body = { code: 0, message: '参数不足' }
      return next()
    }

    const data = { note, provider, redirect_url, redirect_url_fail, timestamp, amount, merchant_order_id }

    ctx.body = await ksherPaymentSDK.orderCreate(data)
      .then(({ data }) => ({ code: 1, data }))
      .catch(data => {
        console.log('------------------error-----------------------', data);
        return { code: 0, data: { msg: 'error' } }
      })

    return next();
  })

  // 查询订单接口
  router.post('/api/orderQuery', async (ctx, next) => {
    const {
      order_id,
      timestamp = getTime()
    } = ctx.request.body

    if (!order_id) {
      ctx.body = { code: 0, message: '参数不全' }
      return next()
    }

    ctx.body = await ksherPaymentSDK.orderQuery(order_id, { timestamp })
      .then(({ data }) => ({ code: 1, data }))
      .catch(data => {
        console.log('------------------error-----------------------', data);
        return { code: 0, data: { msg: 'error' } }
      })

    return next();
  })

  // 订单退款接口
  router.post('/api/orderRefund', async (ctx, next) => {
    const { order_id, refund_amount, timestamp = getTime() } = ctx.request.body
    if (!order_id || !refund_amount) {
      ctx.body = { code: 0, message: '参数不全' }
      return next()
    }

    const data = {
      refund_amount,
      timestamp,
      refund_order_id: order_id,
    }

    ctx.body = await ksherPaymentSDK.orderRefund(data)
      .then(({ data }) => ({ code: 1, data }))
      .catch(data => {
        console.log('------------------error-----------------------', data);
        return { code: 0, data: { msg: 'error' } }
      })

    return next();
  })

  // todo 取消订单接口 暂未支持

  // 成功回调
  router.get('/api/redirect/success', async (ctx, next) => {
    console.log('------------------get success callback-----------------------');
    console.log(ctx.query);
    console.log(ctx.request.body);
    ctx.body = {}
    return next()
  })

  // 失败回调
  router.get('/api/redirect/fail', async (ctx, next) => {
    console.log('------------------get fail callback-----------------------');
    console.log(ctx.query);
    console.log(ctx.request.body);
    ctx.body = {}
    return next()
  })

  // 成功回调
  router.post('/api/redirect/success', async (ctx, next) => {
    console.log('------------------post success callback-----------------------');
    console.log(ctx.query);
    console.log(ctx.request.body);
    ctx.body = {}
    return next()
  })

  // 失败回调
  router.post('/api/redirect/fail', async (ctx, next) => {
    console.log('------------------post fail callback-----------------------');
    console.log(ctx.query);
    console.log(ctx.request.body);
    ctx.body = {}
    return next()
  })

  return router
}
