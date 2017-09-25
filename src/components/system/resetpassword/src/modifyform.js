/**
 * Created by wwj on 2017/5/17.
 */
/**FORM绑定对象*/



const data = {
    loginPwd:'',
    unUsedPwd:'',
    confirmUnUsedPwd:''
}
/**form vBind对象-对应el-form属性*/
const vBind = {
    inline: false,
    "style":{
        fontSize:'1em',
    },
    "label-width": '120px',
    "label-position":'right',
    "rules": {
        loginPwd: [
            {pattern:/^[a-zA-Z0-9]{6,20}$/,message:'密码长度大于6位小于20位,且不含特殊字符',trigger:'blur'},
            {required: true, message: '请输入原密码', trigger: 'blur'}
        ],
        unUsedPwd: [
            {pattern:/^[a-zA-Z0-9]{6,20}$/,message:'密码长度大于6位小于20位,且不含特殊字符',trigger:'blur'},
            {required: true, message: '请输入新密码', trigger: 'blur'}
        ],
        confirmUnUsedPwd: [
            {pattern:/^[a-zA-Z0-9]{6,20}$/,message:'密码长度大于6位小于20位,且不含特殊字符',trigger:'blur'},
            {required: true, message: '请再次输入新密码', trigger: 'blur'},
            {validator:null,trigger:'blur'}
        ]
    }
}
/**FORM输入配置*/
const inputs = [
    {
        type: 'text',
        name: 'loginPwd',
        label: '原密码',
        vBind:{
            placeholder:'请输入原密码',
            type:'password'
        }
    },
    {
        type: 'text',
        name: 'unUsedPwd',
        label: '新密码',
        vBind:{
            placeholder:'请输入新密码',
            type:'password'
        }
    },
    {
        type: 'text',
        name: 'confirmUnUsedPwd',
        label: '确认新密码',
        vBind:{
            placeholder:'请再次输入新密码',
            type:'password'
        }
    },
]

export default  {data, vBind, inputs}

