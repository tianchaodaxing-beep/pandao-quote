const test=require('node:test'); const assert=require('node:assert/strict'); const B=require('../core.js');
test("逐项合计折扣和税额核对",()=>{const r=B.quote([{name:'货物',quantity:2,price:100},{name:'服务',quantity:1,price:50}],10,6);assert.deepEqual([r.subtotal,r.discount,r.net,r.tax,r.total],[250,25,225,13.5,238.5]);});
test("逐行舍入后再合计",()=>{assert.equal(B.quote([{name:'一',quantity:3,price:.333},{name:'二',quantity:3,price:.333}],0,0).total,2);});
test("全部折扣得到零金额",()=>{assert.equal(B.quote([{name:'服务',quantity:1,price:100}],100,6).total,0);});
test("零价格有效",()=>{assert.equal(B.quote([{name:'赠品',quantity:1,price:0}],0,0).total,0);});
test("空项目列表被拒绝",()=>{assert.throws(()=>B.quote([],0,0));});
test("缺失项目名被拒绝",()=>{assert.throws(()=>B.quote([{name:' ',quantity:1,price:10}],0,0));});
test("负数量和过大折扣被拒绝",()=>{assert.throws(()=>B.quote([{name:'一',quantity:-1,price:10}],0,0));assert.throws(()=>B.quote([{name:'一',quantity:1,price:10}],101,0));});
test("税率非数字被拒绝",()=>{assert.throws(()=>B.quote([{name:'一',quantity:1,price:10}],0,'未知'));});
