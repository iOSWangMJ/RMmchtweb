// 交易类型

export const transTypeOptions = [
    {
        key: 'S',
        value: '消费'
    }, {
        key: 'R',
        value: '退款'
    }, {
        key: 'P',
        value: '冲正'
    }, {
        key: 'C',
        value: '撤销'
    }

]

export const transStatOptions = [
    {
        key: 'S',
        value: '成功'
    }, {
        key: 'F',
        value: '失败'
    }, {
        key: 'P',
        value: '处理中'
    }

]

export const oprFlag=[

]

export const transType = [
    {
        key: '1000',
        value: '预订单'
    }, {
        key: '1001',
        value: '快捷支付'
    }, {
        key: '1002',
        value: '认证支付'
    }, {
        key: '1003',
        value: '个人网银支付'
    }, {
        key: '1004',
        value: '企业网银支付'
    }, {
        key: '1005',
        value: '平台支付'
    }, {
        key: '1006',
        value: '微信支付'
    }, {
        key: '1007',
        value: '支付宝支付'
    }, {
        key: '1008',
        value: '退款'
    }, {
        key: '1009',
        value: '查询'
    }, {
        key: '1010',
        value: '撤销'
    }, {
        key: '1011',
        value: '接口支付'
    }, {
        key: '1012',
        value: 'POS消费'
    }, {
        key: '1013',
        value: 'POS撤销'
    }, {
        key: '1014',
        value: 'POS余额查询'
    }, {
        key: '1015',
        value: 'POS预授权'
    }, {
        key: '1016',
        value: 'POS预授权完成'
    }, {
        key: '1017',
        value: 'POS冲正'
    }, {
        key: '1018',
        value: 'POS退货'
    }, {
        key: '1019',
        value: '被扫扫码支付'
    }, {
        key: '1020',
        value: '被扫扫码支付查询订单'
    }, {
        key: '1021',
        value: '被扫扫码支付撤销订单'
    }, {
        key: '1022',
        value: '被扫扫码支付申请退款'
    }, {
        key: '1024',
        value: '微信统一下单'
    }, {
        key: '1025',
        value: '电子账户被扫'
    }, {
        key: '1026',
        value: 'POS脚本通知'
    }
]

export const transStat = [
    {
        key: '00',
        value: '支付成功'
    },
    {
        key: '01',
        value: '支付成功（已发生退货，已发生撤销）'
    },
    {
        key: '02',
        value: '交易成功，已完成预授权完成'
    },
    {
        key: '03',
        value: '交易成功,已完成预授权'
    },
    {
        key: '09',
        value: '交易已关闭'
    },
    {
        key: '10',
        value: '等待支付'
    },
    {
        key: '11',
        value: '支付受理成功，请稍后发起交易状态查询，查询处理结果'
    },
    {
        key: '12',
        value: '支付受理成功，已发送主机，主机正在处理中'
    },
    {
        key: '13',
        value: '主机受理支付成功，需稍后发起交易状态查询，查询处理结果'
    },
    {
        key: '14',
        value: '主机受理支付成功，用户正在支付中'
    },
    {
        key: '20',
        value: '主机支付通讯超时'
    },
    {
        key: '99',
        value: '支付失败'
    }
]

 // 正负 交易码
export const transCodePlus = ["1001","1002","1003","1004","1005","1006","1007","1024","1012","1019","1016","1028"]
export const transCodeMinus = ["1008","1018","1022","1017","1010","1013","1021"]
