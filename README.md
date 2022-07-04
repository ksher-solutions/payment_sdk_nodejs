# payment_sdk_nodejs
The Payment SDK for accessing *.vip.ksher.net


## Run from demo code

1. Install [nodejs](https://nodejs.org) on you computer.
2. Check your nodejs working with your computer by using
```shell
node -v
```
3. clone Ksher nodejs repository by
```shell
git clone https://github.com/ksher-solutions/payment_sdk_nodejs
```
4. cd into clone source code and Install dependencies package by
```shell
cd payment_sdk_nodejs
npm install
```
5. Change configuration `host` and `token` by edit at path `/example/setting.json`
```javascript
// Please use you own host address and token...
const setting = {
  "host": "https://sandboxdoc.vip.ksher.net",
  "token": "your token",
}
```
6. Start server by
```shell
npm run serve-example
```

> **Note**
> 
> Demo code is base on [KOA Framework](https://koajs.com/)
> 
> you can learn more from https://github.com/koajs/koa

7. Enter http://localhost:3000/demo.html will display demo website


Alterative way you can call API localhost over postman by

POST over http://localhost:3000/api/redirect/orderCreate

with Request Body
```json
{
            "amount": 100,
            "merchant_order_id": "2022063010481",
            "note": "string",
            "redirect_url": "https://web.site/pass",
            "redirect_url_fail": "https://web.site/fail",
            "timestamp": "2022051900"
}
```

## Advance Config Running Code

### 1. Install only SDK

You can use package manager to install ksher-pay SDK.

#### 1.1. npm

```shell
npm install ksher-pay
```

#### 1.2. yarn

```shell
yarn add ksher-pay
```

### 2. configuration data

### 2.1 Prepare the configuration data

```javascript
// Please use you own host address and token...
const setting = {
  "host": "https://sandboxdoc.vip.ksher.net",
  "token": "your token",
}
```

### 2.2. Import the SDK

```javascript
const PaymentSDK = require("ksher-pay");
const MySDK = new PaymentSDK(setting);
```

### 3. Redirect API
#### 3.1. Redirect API Create new order

initialize redirect SDK

```javascript
// SDK for redirect
const redirectAppSDK = require('ksher-pay/src/redirect')
const MyRedirectAppSDK = new redirectAppSDK(setting);
```

```javascript
const data = {
	note: "Note to this order",
	redirect_url: "http://www.baidu.com",      
	redirect_url_fail: "http://www.baidu.com", 
	timestamp: "1623058159665", 			   // timestamp
    amount: 100, 						       // the unit is cent.
	merchant_order_id: "202106070001"          // this should be uniq 
}

MySDK.orderCreate(data).then(({data})=>{
	console.log(data)             // order created successfully
	console.log(data.reference)   //Here is the payment link
}).catch(err => {
    console.log(err)              //error
})
```

#### 3.2. Redirect API Query order status

```javascript

const order_id = "202106070001"                // order id
const data = {
	timestamp: "1623058159665", 			   // time stamp
}

MySDK.orderQuery(order_id, data).then(({data})=>{
	console.log(data)
}).catch(err => {
    console.log(err)
})
```

#### 3.3. Redirect Refund

```javascript
const order_id = '202106070001'
const data = {
	refund_order_id: "123456789001",		   
	timestamp: "1623058159665", 			   
	refund_amount: 100						  
}

MySDK.orderRefund(order_id, data).then(({data})=>{
	console.log(data)
}).catch(err => {
    console.log(err)
})
```

### 4. alipay miniapp API

#### 4.1. Create new order for alipay miniapp

##### 4.1.1. Get orderStr
```javascript
const data = {
	amount: 100, 							// the unit is cent.
	merchant_order_id: "202106070001",		// this should be uniq 
	timestamp: "1623058159665", 			// timestamp
	note: 'some note for this order',	
	channel: 'alipay',					
	miniapp_openid: 'alipayOpenId',			// alipay user's openid
	miniapp_appid: 'alipayAppid',			// appid of alipay miniapp
}

MyMiniAppSDK.orderCreate(data).then(({data})=>{
	console.log(data)
	console.log(data.reference) // the orderStr
}).catch(err => {
    console.log(err)
})
```

##### 4.1.2.  Pay in alipay miniapp
```javascript
// run in alipay miniapp
my.tradePay({ orderStr: 'the reference value' })
```

### 5. Verify signature

Verify signature from the webhook request

```javascript

// this is a simple webhook
const webhookUrl = 'https://your-host.com/api/webhook'; // you webhook url
const data = {
  type: 'Order',
  instance: '1623817182537',
  code: 'StatusChange',
  message: 'Order Paid',
  signature: '944EFC0C6DB000A28C7BACEC6709AF119586F4E361F908DEAC576DA937A6F746'
}

const valid = MySDK.checkSignature(webhookUrl, data)
if(valid){
  console.log('success')
}
```

## 6. Reference

The source code of the SDK is hosted in github, you are welcome to raise issue and PR.

https://github.com/ksher-solutions/payment_sdk_nodejs
