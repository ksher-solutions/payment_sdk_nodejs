const crypto = require('crypto');

module.exports = class SDK {
  token = ''
  debug = false

  constructor({ token, debug = false }) {
    this.token = token
    this.debug = !!debug
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
    const result = crypto.createHmac('sha256', this.token)
      .update(parameterStr, 'utf8')
      // 5, 将得到的摘要做 HEXDECIMAL 编码, 得到签名值
      .digest('hex')
      .toUpperCase()
    if(this.debug){
      console.log({
        parameterStr,
        result
      });
    }

    return result
  }

  /**
   * 验证签名是否正确
   * @param {string} apiUrl   - 接口地址
   * @param {Object} data     - 请求体
   * @return boolean          - 验签
   */
  checkSignature(apiUrl, data) {
    const {signature, ...obj} = data;
    let sign = this.getSignature(apiUrl, obj)
    return signature === sign
  }
}

