const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const koaStatic = require('koa-static')
const cors = require('koa-cors');
const koaBody = require('koa-body')
const KsherRedirectSDK = require('../src/redirect')
const KsherMiniappSDK = require('../src/miniapp')
const KsherCscanbSDK = require('../src/cscanb')

// 配置信息
// configuration information
const { token, host, port } = require('./setting.json');

const $miniapp_openid = ""
const $miniapp_appid = ""

// 本地服务
// local service
const app = new Koa()

// sdk 初始化
// sdk initialization
const ksherRedirect = new KsherRedirectSDK({ token, host });
const ksherMiniapp = new KsherMiniappSDK({ token, host });
const ksherCscanb = new KsherCscanbSDK({ token, host });

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
    console.log('request data', ctx.request.body)
    const data = ctx.request.body
    if (!data.amount || !data.merchant_order_id || !data.redirect_url || !data.redirect_url_fail) {
      ctx.body = { code: 0, message: '参数不足' }
      return next()
    }

    if (!data.timestamp || (data.timestamp == '')){
      data.timestamp = getTime()
    }

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
    console.log('request data', ctx.request.body)
    const data = ctx.request.body
    if (!data.order_id) {
      ctx.body = { code: 0, message: '参数不全' }
      return next()
    }

    if (!data.timestamp || (data.timestamp == '')){
      data.timestamp = getTime()
    }
    const order_id = data.order_id;
    delete data.order_id
    
    ctx.body = await ksherRedirect.orderQuery(order_id, data)
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
    console.log('request data', ctx.request.body)
    const data = ctx.request.body
    if (!data.order_id || !data.refund_amount) {
      ctx.body = { code: 0, message: '参数不全' }
      return next()
    }

    if (!data.timestamp || (data.timestamp == '')){
      data.timestamp = getTime()
    }
    const order_id = data.order_id
    if (!data.refund_order_id || (data.refund_order_id == '')){

        data.refund_order_id = order_id +"_"+ getTime()
    }
    
    delete data.order_id
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
    console.log('request data', ctx.request.body)
    const data = ctx.request.body
    if (!data.amount || !data.merchant_order_id || !data.miniapp_openid || !data.miniapp_appid) {
      ctx.body = { code: 0, message: '参数不足' }
      return next()
    }

    if (!data.timestamp || (data.timestamp == '')){
      data.timestamp = getTime()
    }

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
    console.log('request data', ctx.request.body)
    const data = ctx.request.body
    if (!data.order_id) {
      ctx.body = { code: 0, message: '参数不全' }
      return next()
    }

    if (!data.timestamp || (data.timestamp == '')){
      data.timestamp = getTime()
    }
    const order_id = data.order_id;
    delete data.order_id

    ctx.body = await ksherMiniapp.orderQuery(order_id, data)
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
    console.log('request data', ctx.request.body)
    const data = ctx.request.body
    if (!data.order_id || !data.refund_amount) {
      ctx.body = { code: 0, message: '参数不全' }
      return next()
    }

    if (!data.timestamp || (data.timestamp == '')){
      data.timestamp = getTime()
    }
    const order_id = data.order_id
    if (!data.refund_order_id || (data.refund_order_id == '')){

        data.refund_order_id = order_id +"_"+ getTime()
    }

    delete data.order_id
    ctx.body = await ksherMiniapp.orderRefund(order_id, data)
      .then(({ data }) => ({ code: 1, data }))
      .catch(data => {
        console.log('------------------error-----------------------', data);
        return { code: 0, data: { msg: 'error' } }
      })

    return next();
  })

      // 创建订单接口
  // Create order interface
  router.post('/api/cscanb/orderCreate', async (ctx, next) => {
    console.log('request data', ctx.request.body)
    const data = ctx.request.body
    if (!data.amount || !data.merchant_order_id || !data.channel) {
      ctx.body = { code: 0, message: '参数不足' }
      return next()
    }

    if (!data.timestamp || (data.timestamp == '')){
      data.timestamp = getTime()
    }

    ctx.body = await ksherCscanb.orderCreate(data)
      .then(({ data }) => ({ code: 1, data }))
      .catch(data => {
        console.log('------------------error-----------------------', data);
        return { code: 0, data: { msg: 'error' } }
      })

    return next();
  })

  // 查询订单接口
  // Query order interface
  router.post('/api/cscanb/orderQuery', async (ctx, next) => {
    console.log('request data', ctx.request.body)
    const data = ctx.request.body
    if (!data.order_id) {
      ctx.body = { code: 0, message: '参数不全' }
      return next()
    }
    if (!data.timestamp || (data.timestamp == '')){
      data.timestamp = getTime()
    }
    const order_id = data.order_id;
    delete data.order_id

    ctx.body = await ksherCscanb.orderQuery(order_id, data)
      .then(({ data }) => ({ code: 1, data }))
      .catch(data => {
        console.log('------------------error-----------------------', data);
        return { code: 0, data: { msg: 'error' } }
      })

    return next();
  })

  // 订单退款接口
  // Order refund interface
  router.post('/api/cscanb/orderRefund', async (ctx, next) => {
    console.log('request data', ctx.request.body)
    const data = ctx.request.body
    if (!data.order_id || !data.refund_amount) {
      ctx.body = { code: 0, message: '参数不全' }
      return next()
    }

    if (!data.timestamp || (data.timestamp == '')){
      data.timestamp = getTime()
    }
    const order_id = data.order_id
    if (!data.refund_order_id || (data.refund_order_id == '')){

        data.refund_order_id = order_id +"_"+ getTime()
    }
    
    delete data.order_id
    ctx.body = await ksherCscanb.orderRefund(order_id, data)
      .then(({ data }) => ({ code: 1, data }))
      .catch(data => {
        console.log('------------------error-----------------------', data);
        return { code: 0, data: { msg: 'error' } }
      })

    return next();
  })

  return router
}
