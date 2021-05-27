// 输出 SDK class 接受 token 和 根域名
const crypto = require('crypto');
const axios = require('axios')

class PaySDK {
  static VERSION = '0.0.1'

  static API = '/api/v1/redirect/orders'

  host = ''
  token = ''

  constructor({ token, host }) {
    this.token = token
    this.host = host
  }

  /**
   * 获取签名
   * @param {string} apiUrl   - 要请求的接口地址(相对网站域名的相对路径)
   * @param {Object} data     - 请求参数(不包含 signature)
   * @return string           - 加密后的签名串
   */
  getSignature(apiUrl, data) {
    const obj = {}

    // 1 将请求参数按key值从小到大排序
    Object.keys(data).sort().forEach(key => {
      if (key !== 'signature')
        obj[key] = data[key]
    })

    // 2 将排序后的keyvalue拼接起来
    const keyvalue = Object.entries(obj).map(([key, value]) => key + value).join('')

    // 3 将上面得到的字符串前面再拼接API的URL
    const parameterStr = apiUrl + keyvalue

    // 4, 将拼接好的字符串用 UTF-8 编码后做 HMAC-SHA256摘要
    let result = crypto.createHmac('sha256', this.token)
      .update(parameterStr, 'utf8')
      // 5, 将得到的摘要做 HEXDECIMAL 编码, 得到签名值
      .digest('hex')
      .toUpperCase()

    console.log({
      parameterStr,
      result
    });

    return result
  }

  /**
   * 创建订单
   * @param {Object} data
   * @param {number} data.amount                - 订单金额
   * @param {string} data.merchant_order_id     - 商户后台的唯一的订单id
   * @param {string} data.note                  - 订单备注
   * @param {string} data.redirect_url          - 成功回调地址
   * @param {string} data.redirect_url_fail     - 失败回调地址
   * @param {string} data.timestamp             - 时间戳
   * @param {string} [data.provider]            - 国家或地区
   */
  orderCreate(data) {
    const url = `${ PaySDK.API }/`
    return axios({
      url: this.host + url,
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      data: {
        ...data,
        signature: this.getSignature(url, data)
      }
    })
  }

  /**
   * 查询订单
   * @param {string} order_id           - 要查询的商户订单id
   * @param {Object} params
   * @param {string} params.timestamp   - 时间戳
   */
  orderQuery(order_id, params) {
    const url = `${ PaySDK.API }/${ order_id }`
    return axios({
      url: this.host + url,
      method: 'GET',
      params: {
        ...params,
        signature: this.getSignature(url, params)
      }
    })
  }

  /**
   * 退款订单
   * @param data
   * @param {number} data.refund_amount     - 要退款的金额
   * @param {string} data.timestamp         - 时间戳
   * @param {string} data.refund_order_id   - 要退款的商户订单id
   * @param {string} [data.mid]
   * @param {string} [data.provider]        - 国家或地区
   */
  orderRefund(data) {
    const url = `${ PaySDK.API }/${ data.refund_order_id }`

    return axios({
      url: this.host + url,
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      data: {
        ...data,
        signature: this.getSignature(url, data)
      }
    })
  }

  /**
   * 取消订单
   * @param order_id                        - 要取消的订单
   * @param data
   * @param {string} data.timestamp         - 时间戳
   * @param {string} [data.mid]
   * @param {string} [data.provider]        - 国家或地区
   */
  orderCancel(order_id, data){
    const url = `${ PaySDK.API }/${ order_id }`

    return axios({
      url: this.host + url,
      method: 'DELETE',
      headers: { "Content-Type": "application/json" },
      data: {
        ...data,
        signature: this.getSignature(url, data)
      }
    })
  }
}

module.exports = PaySDK
