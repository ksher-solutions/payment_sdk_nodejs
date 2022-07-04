const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const koaStatic = require('koa-static')
const cors = require('koa-cors');
const koaBody = require('koa-body')
const KsherRedirectSDK = require('../src/redirect')
const KsherMiniappSDK = require('../src/miniapp')

// 配置信息
// configuration information
const { token, host, port } = require('./setting.json')
const $redirect_url = "http://www.baidu.com"
const $redirect_url_fail = "http://www.baidu.com"

const $miniapp_openid = ""
const $miniapp_appid = ""

// 本地服务
// local service
const app = new Koa()

// sdk 初始化
// sdk initialization
const ksherRedirect = new KsherRedirectSDK({ token, host });
const ksherMiniapp = new KsherMiniappSDK({ token, host });

// 静态 demo
// static demo
app.use(koaStatic(path.join(__dirname, './static')))

// cors跨域设置
// cors domain settings
app.use(cors());

// bodyparser
app.use(koaBody())

// 挂载路由
// mount the route
const router = getRouter()
app
  .use(router.routes())
  .use(router.allowedMethods())

// 启动服务
// start the service
app.listen(port, async () => {
  console.log(`app started at port ${ port }`)
});

// 获取时间戳
// get timestamp
function getTime() {
  return (+new Date).toString()
}

// 接口路由
// interface routing
function getRouter() {
  // 接口
  // interface
  const router = new Router()

  // 创建订单接口
  // Create order interface
  router.post('/api/redirect/orderCreate', async (ctx, next) => {
    const {
      note = "some note for this order",
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

    const data = { note, redirect_url, redirect_url_fail, timestamp, amount, merchant_order_id }

    ctx.body = await ksherRedirect.orderCreate(data)
      .then(({ data }) => ({ code: 1, data }))
      .catch(data => {
        console.log('------------------error-----------------------', data);
        return { code: 0, data: { msg: 'error' } }
      })

    return next();
  })

  // 查询订单接口
  // Query order interface
  router.post('/api/redirect/orderQuery', async (ctx, next) => {
    const {
      order_id,
      timestamp = getTime()
    } = ctx.request.body

    if (!order_id) {
      ctx.body = { code: 0, message: '参数不全' }
      return next()
    }

    ctx.body = await ksherRedirect.orderQuery(order_id, { timestamp })
      .then(({ data }) => ({ code: 1, data }))
      .catch(data => {
        console.log('------------------error-----------------------', data);
        return { code: 0, data: { msg: 'error' } }
      })

    return next();
  })

  // 订单退款接口
  // Order refund interface
  router.post('/api/redirect/orderRefund', async (ctx, next) => {
    const { order_id, refund_amount, timestamp = getTime() } = ctx.request.body
    if (!order_id || !refund_amount) {
      ctx.body = { code: 0, message: '参数不全' }
      return next()
    }

    const data = {
      refund_amount,
      timestamp,
      refund_order_id: order_id +"_"+ getTime()
    }

    ctx.body = await ksherRedirect.orderRefund(order_id, data)
      .then(({ data }) => ({ code: 1, data }))
      .catch(data => {
        console.log('------------------error-----------------------', data);
        return { code: 0, data: { msg: 'error' } }
      })

    return next();
  })

  // todo 取消订单接口 暂未支持
  // Cancel order interface Not supported yet

  // 成功回调
  // success callback
  router.get('/api/redirect/success', async (ctx, next) => {
    console.log('------------------get success callback-----------------------');
    console.log(ctx.query);
    console.log(ctx.request.body);
    ctx.body = {}
    return next()
  })

  // 失败回调
  // failure callback
  router.get('/api/redirect/fail', async (ctx, next) => {
    console.log('------------------get fail callback-----------------------');
    console.log(ctx.query);
    console.log(ctx.request.body);
    ctx.body = {}
    return next()
  })

  // 成功回调
  // success callback
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

    // 创建订单接口
  // Create order interface
  router.post('/api/miniapp/orderCreate', async (ctx, next) => {
    const {
      note = "some note for this order",
      miniapp_openid = $miniapp_openid,
      miniapp_appid = $miniapp_appid,
      timestamp = getTime(),
      amount,
      merchant_order_id,
    } = ctx.request.body

    if (!amount || !merchant_order_id) {
      ctx.body = { code: 0, message: '参数不足' }
      return next()
    }

    const data = { note, miniapp_openid, miniapp_appid, timestamp, amount, merchant_order_id }

    ctx.body = await ksherMiniapp.orderCreate(data)
      .then(({ data }) => ({ code: 1, data }))
      .catch(data => {
        console.log('------------------error-----------------------', data);
        return { code: 0, data: { msg: 'error' } }
      })

    return next();
  })

  // 查询订单接口
  // Query order interface
  router.post('/api/miniapp/orderQuery', async (ctx, next) => {
    const {
      order_id,
      timestamp = getTime()
    } = ctx.request.body

    if (!order_id) {
      ctx.body = { code: 0, message: '参数不全' }
      return next()
    }

    ctx.body = await ksherMiniapp.orderQuery(order_id, { timestamp })
      .then(({ data }) => ({ code: 1, data }))
      .catch(data => {
        console.log('------------------error-----------------------', data);
        return { code: 0, data: { msg: 'error' } }
      })

    return next();
  })

  // 订单退款接口
  // Order refund interface
  router.post('/api/miniapp/orderRefund', async (ctx, next) => {
    const { order_id, refund_amount, timestamp = getTime() } = ctx.request.body
    if (!order_id || !refund_amount) {
      ctx.body = { code: 0, message: '参数不全' }
      return next()
    }

    const data = {
      refund_amount,
      timestamp,
      refund_order_id: order_id +"_"+ getTime()
    }

    ctx.body = await ksherMiniapp.orderRefund(order_id, data)
      .then(({ data }) => ({ code: 1, data }))
      .catch(data => {
        console.log('------------------error-----------------------', data);
        return { code: 0, data: { msg: 'error' } }
      })

    return next();
  })

  return router
}
