// 交易类型

export const transTypeOptions = [
    {
        value: 'S',
        label: '消费'
    }, {
        value: 'R',
        label: '退款'
    }, {
        value: 'P',
        label: '冲正'
    }, {
        value: 'C',
        label: '撤销'
    }

]

export const transStatOptions = [
    {
        value: 'S',
        label: '成功'
    }, {
        value: 'F',
        label: '失败'
    }, {
        value: 'P',
        label: '处理中'
    }

]

export const transType = [
    {
        value: '1000',
        label: '预订单'
    }, {
        value: '1001',
        label: '快捷支付'
    }, {
        value: '1002',
        label: '认证支付'
    }, {
        value: '1003',
        label: '个人网银支付'
    }, {
        value: '1004',
        label: '企业网银支付'
    }, {
        value: '1005',
        label: '平台支付'
    }, {
        value: '1006',
        label: '微信支付'
    }, {
        value: '1007',
        label: '支付宝支付'
    }, {
        value: '1008',
        label: '退款'
    }, {
        value: '1009',
        label: '查询'
    }, {
        value: '1010',
        label: '撤销'
    }, {
        value: '1011',
        label: '接口支付'
    }, {
        value: '1012',
        label: 'POS消费'
    }, {
        value: '1013',
        label: 'POS撤销'
    }, {
        value: '1014',
        label: 'POS余额查询'
    }, {
        value: '1015',
        label: 'POS预授权'
    }, {
        value: '1016',
        label: 'POS预授权完成'
    }, {
        value: '1017',
        label: 'POS冲正'
    }, {
        value: '1018',
        label: 'POS退货'
    }, {
        value: '1019',
        label: '被扫扫码支付'
    }, {
        value: '1020',
        label: '被扫扫码支付查询订单'
    }, {
        value: '1021',
        label: '被扫扫码支付撤销订单'
    }, {
        value: '1022',
        label: '被扫扫码支付申请退款'
    }, {
        value: '1024',
        label: '微信统一下单'
    }, {
        value: '1025',
        label: '电子账户被扫'
    }, {
        value: '1026',
        label: 'POS脚本通知'
    }
]

export const transStat = [
    {
        value: '00',
        label: '支付成功'
    },
    {
        value: '01',
        label: '支付成功（已发生退货，已发生撤销）'
    },
    {
        value: '02',
        label: '交易成功，已完成预授权完成'
    },
    {
        value: '03',
        label: '交易成功,已完成预授权'
    },
    {
        value: '09',
        label: '交易已关闭'
    },
    {
        value: '10',
        label: '等待支付'
    },
    {
        value: '11',
        label: '支付受理成功，请稍后发起交易状态查询，查询处理结果'
    },
    {
        value: '12',
        label: '支付受理成功，已发送主机，主机正在处理中'
    },
    {
        value: '13',
        label: '主机受理支付成功，需稍后发起交易状态查询，查询处理结果'
    },
    {
        value: '14',
        label: '主机受理支付成功，用户正在支付中'
    },
    {
        value: '20',
        label: '主机支付通讯超时'
    },
    {
        value: '99',
        label: '支付失败'
    }
]

 // 正负 交易码
export const transCodePlus = ["1001","1002","1003","1004","1005","1006","1007","1024","1012","1019","1016","1028"]
export const transCodeMinus = ["1008","1018","1022","1017","1010","1013","1021"]
