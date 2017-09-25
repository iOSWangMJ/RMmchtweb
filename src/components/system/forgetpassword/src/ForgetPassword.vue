<template>
    <el-row class="bg-container">
        <el-row class="reset-pwd-container">
            <div class="forget-pwd-title">
                <span class="green-line"></span>
                <span>忘记密码</span>
            </div>
            <el-row class="steps">
                <el-row class="steps-imgs">
                    <el-col :span="10">
                        <img class="first-img img-selected" v-if="carouselIndex == 0" src="../../../../assets/identity@2x.png" alt="">
                        <img class="first-img img-not-selected" v-else-if="carouselIndex > 0" src="../../../../assets/identity2@2x.png" alt="">
                    </el-col>
                    <el-col :span="4">
                        <img class="second-img img-selected" v-if="carouselIndex == 1" src="../../../../assets/Sign in2@2x.png" alt="">
                        <img class="second-img img-not-selected" v-else-if="carouselIndex < 1" src="../../../../assets/Sign in@2x.png" alt="">
                        <img class="second-img img-not-selected" v-else-if="carouselIndex > 1" src="../../../../assets/Sign in3@2x.png" alt="">
                    </el-col>
                    <el-col :span="10">
                        <img class="third-img img-selected" v-if="carouselIndex >= 2" src="../../../../assets/Reset2@2x.png" alt="">
                        <img class="third-img img-not-selected" v-else-if="carouselIndex < 2" src="../../../../assets/Reset@2x.png" alt="">
                    </el-col>
                    <span class="step-line"></span>
                </el-row>
                <el-row class="steps-text">
                    <el-col class="steps-text-active" :span="10">
                        身份信息验证
                    </el-col>
                    <el-col v-bind:class="{'steps-text-active':(carouselIndex>=1)}" :span="4">
                        登录密码重置
                    </el-col>
                    <el-col v-bind:class="{'steps-text-active':(carouselIndex>=2)}" :span="10">
                        重置结果
                    </el-col>
                </el-row>
            </el-row>
            <el-carousel class="form-carousel" ref="forgetPwdCarousel" arrow="never" :autoplay="false" indicator-position="none">
                <el-carousel-item style="height: 100%">
                    <el-form v-show="carouselIndex == 0"  class="firstForm" :model="firstForm" ref="firstForm" :rules="firstRules" label-width="120px">
                        <el-form-item label="登录手机号" prop="phoneNumber">
                            <el-input @change="handleQueryUserInfo" :maxlength="11" placeholder="请输入手机号" v-model="firstForm.phoneNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="法人证件类型" prop="IDType">
                            <el-select @change="handleIDTypeChange" ref="IDType" v-model="firstForm.IDType">
                                <el-option label="身份证" value = "00"></el-option>
                                <el-option label="护照" value = "01"></el-option>
                                <el-option label="户口本" value = "02"></el-option>
                                <el-option label="其他" value ="03"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="法人证件号" prop="IDNumber">
                            <el-input :maxlength="30" ref="IDNumber" placeholder="请输入证件号" v-model="firstForm.IDNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="结算账号" prop="bankAccountNumber">
                            <el-input :maxlength="30" placeholder="请输入账号" v-model="firstForm.bankAccountNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="短信验证码" prop="validateCode" >
                            <el-input style="width: 188px;" :maxlength="6" placeholder="验证码" class="validate-input" v-model="firstForm.validateCode"></el-input>
                            <span class="validate-code" @click="handleClickGetPhoneValidateCode">
                                <span :style="countNum != 0 ? disableGetSMSCodeStyle : ''" class="validate-text">获取验证码<span v-if="countNum!=0"> ({{countNum}}s)</span></span>
                            </span>
                        </el-form-item>
                        <el-form-item label-width="120px" class="button-item">
                            <el-button class="public-button-style public-button" @click="handleNext">下一步</el-button>
                            <el-button class="public-button-style public-button" @click="handleBack">返回</el-button>
                        </el-form-item>
                    </el-form>
                </el-carousel-item>
                <el-carousel-item>
                    <el-form v-show="carouselIndex == 1" label-position="left" class="secondForm" :model="secondForm" ref="secondForm" :rules="secondRules"  label-width="120px">
                        <el-form-item label="登录密码" prop="password">
                            <el-input type="password" placeholder="请输入密码" v-model="secondForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="确认登录密码" prop="confirmPassword">
                            <el-input type="password" placeholder="请再次输入密码" v-model="secondForm.confirmPassword"></el-input>
                        </el-form-item>
                        <el-form-item label-width="120px" class="button-item">
                            <el-button class="public-button-style public-button" @click="handleConfirmPassword">下一步</el-button>
                            <el-button class="public-button-style public-button" @click="handleBackConfirmUserInfo">返回</el-button>
                        </el-form-item>
                    </el-form>
                </el-carousel-item>
                <el-carousel-item>
                    <el-row style="margin-top: 20px;text-align: center" v-if="carouselIndex == 2">
                        <el-row style="margin-bottom: 20px;">
                            <img width="80" src="../../../../assets/Success@2x.png" alt="">
                        </el-row>
                        <el-row style="font-size: 1.42em;color: #333;">
                            密码重置成功!
                        </el-row>
                        <el-row>
                            <el-button @click="handleClickComplete" style="margin: 26px 0 0;width: 200px;" class="public-button-style public-button public-green">
                                进入首页
                            </el-button>
                        </el-row>
                    </el-row>
                </el-carousel-item>
            </el-carousel>
        </el-row>
        <!--<el-dialog-->
            <!--style="font-size: 18px;"-->
            <!--class="reset-error-dialog"-->
            <!--top="30%"-->
            <!--:visible.sync="dialogVisible"-->
            <!--:show-close = false-->
            <!--&gt;-->
            <!--<p>-->
                <!--无法重置密码-->
            <!--</p>-->
            <!--<p style="margin-top: 5px;">-->
                <!--需联系店长进行密码重置-->
            <!--</p>-->
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button class="public-button-style public-button public-green" @click="handleConfirmReset">确 定</el-button>-->
            <!--</span>-->
        <!--</el-dialog>-->
    </el-row>
</template>

<style lang="scss">
    $bg-color:#ebf1f5;
    $public-green:#009C42;
    $input-border-color:#e7e8ea;
    $el-button-width:120px;
    $steps-text-active-color:#202020;
    $el-button-first:#009C42;
    $el-button-second:#999999;
    .green-line{
        position: relative;
        top: 3px;
        margin-right: 3px;
        display: inline-block;
        width: 6px;
        height: 100%;
        background: $public-green;
    }
    .forget-pwd-title{
        height: 20px;
        font-size: 1.42em;
        color: #333;
        font-weight: bold;
    }
    .reset-error-dialog p{
        margin: 0;
    }
    .reset-error-dialog .el-dialog__footer,.reset-error-dialog .el-dialog__header{
        padding: 0;
        text-align: center;
    }
    .reset-error-dialog .el-dialog__body{
        padding: 36px 0 28px;
    }
    .reset-error-dialog>.el-dialog{
        text-align: center;
        border-radius: 10px;
        width: 374px;
    }
    .dialog-footer>.el-button:hover,.dialog-footer>.el-button:focus{
        background: $el-button-first;
    }
    .dialog-footer>.el-button{
        background: $el-button-first;
        margin-bottom: 27px;
    }
    .button-item .el-button:nth-child(2){
        background: $el-button-second;
    }
    .button-item .el-button:first-child{
        margin-right: 19px;
        background: $el-button-first;
    }
    .public-button-style.el-button{
        padding: 6px 0;
        height: 34px;
        font-size: 1.14em;
        width: $el-button-width;
        border: none;
    }
    .button-item{
        margin-top: 42px;
    }
    .validate-code{
        display: inline-block;
        margin-left: 20px;
        text-align: center;
        border-radius: 2px;
        background: $public-green;
        width: 142px;
        height: 34px;
    }
    .validate-text{
        cursor: pointer;
        padding: 0 20px;
        color: white;
    }
    .secondForm .el-form-item,.firstForm .el-form-item{
        margin-bottom: 20px;
    }
    .secondForm .el-input__inner,.firstForm .el-input__inner{
        height: 34px;
    }
    .form-carousel .el-form-item__error{
        margin-left: 16px;
    }
    .form-carousel .el-input{
        margin-left: 16px;
        width: 356px;
    }
    .form-carousel{
        height: calc(100% - 166px);
    }
    .form-carousel .el-carousel__container{
        width: 66%;
        height: 100%;
        margin-left: 50%;
        transform: translate(-50%,0);
    }
    .firstForm{
        height: 100%;
        overflow-y: auto;
    }
    .steps-text-active{
        color:$steps-text-active-color;
    }
    .steps-text{
        color: $el-button-second;
        color: #333;
        font-size: 0.85em;
        margin-top: 5px;
        text-align: center;
    }
    .step-line{
        position: absolute;
        top: 22px;
        left: 0;
        z-index: -1;
        width: 100%;
        background: $el-button-second;
        display: inline-block;
        height: 2px;
    }
    .img-selected{
      width: 46px;
    },
    .img-not-selected{
        width: 30px;
    }
    .steps-imgs .el-col{
        height: 46px;
        line-height: 46px;
        text-align: center;
    }
    .steps{
        overflow: hidden;
        margin-top: 22px;
        margin-bottom: 50px;
    }
    .bg-container{
        height: calc(100% - 94px);
        font-size: 14px;
        background: $bg-color;
        padding : 55px 0 49px;
    }
    .reset-pwd-container{
        box-sizing: border-box;
        height: 100%;
        padding: 30px 85px 48px;
        width: 1066px;
        margin-left: 50%;
        transform: translate(-50%,0);
        background: white;
    }
</style>

<script>
    import * as requestUrl from './requestUrl'
    import {encrypt} from '../../../../jslib/md5/md5'
    export default {
        name: 'forgetPassword',
        data () {
            let _this = this;
            let validatePass = (rule, value, callback) => {
                let IDCardReg = new RegExp(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,'i');
                let passport1 = new RegExp(/^[a-zA-Z]{5,17}$/,'');
                let passport2 = new RegExp(/^[a-zA-Z0-9]{5,17}$/,'');
                let IDType = _this.$refs.IDType.value;
                let registeredPermanentResidence = new RegExp(/^[a-zA-Z0-9]{3,21}$/,'');
                if (IDType === '01' && !IDCardReg.test(value)) {
                    callback(new Error('请输入正确的身份证'));
                } else if(IDType === '02' && !(passport1.test(value) || passport2.test(value))){
                    callback(new Error('请输入正确的护照号'));
                } else if(IDType === '03' && !(registeredPermanentResidence.test(value))){
                    callback(new Error('请输入正确的户口号'));
                } else {
                    callback();
                }
            };
            let validateCheckPassword = (rule,value,callback) =>{
              if (this.secondForm.password !== value){
                  callback(new Error('两次输入密码不一致!'));
              }else{
                  callback();
              }
            }
          return{
              isExist:'',
              userType:'',
              userStat:'',
              userId:'',
              disableGetSMSCodeStyle:{
                  cursor: 'default',
                  color: '#cccccc'
              },
              countNum:0,
              isGetSMS:false,
              isCheckSMS:false,
              active: 0,
              carouselIndex:0,
//              dialogVisible: false,
              firstForm:{
                  phoneNumber:'',
                  IDType:'00',
                  IDNumber:'',
                  bankAccountNumber:''
              },
              secondForm:{
                  password:'',
                  confirmPassword:''
              },
              firstRules:{
                  phoneNumber:[
                      { required: true, message: '请输入登录手机号', trigger: 'blur' },
                      { pattern:/^(13\d|14[579]|15\d|17[01235678]|18\d)\d{8}$/, message:'请输入正确的手机号',trigger:'blur'},
                      {validator : null,trigger:'blur'}
                  ],
                  IDType:[
                      {required:true}
                  ],
                  IDNumber:[
                      { required: true, message: '请输入法人证件号', trigger: 'blur'},
                      { validator: validatePass, trigger: 'blur' }
                  ],
                  bankAccountNumber: [
                      { required: true, message: '请输入结算账号', trigger: 'blur'}
                  ],
                  validateCode: [
                      { required: true, message: '请输入验证码', trigger: 'blur'},
                      { pattern:/^[0-9]{6}$/, message: '请输入6位短信验证码', trigger:'blur'}
                  ]
              },
              secondRules:{
                  password:[
                      { required:true, message:'请输入密码', trigger: 'blur'},
                      { pattern:/[a-zA-z0-9]{6,20}/, message:'请输入6-20位数字、字母或数字字母组合',trigger:'blur'}
                  ],
                  confirmPassword:[
                      { required:true, message:'请再次输入密码', trigger: 'blur'},
                      { pattern:/[a-zA-z0-9]{6,20}/, message:'请输入6-20位数字、字母或数字字母组合',trigger:'blur'},
                      { validator: validateCheckPassword, trigger:'blur'}
                  ]
              }
          }
        },
        methods:{
            handleBack(){
              this.$emit('setForgetPwd',false);
            },
            handleQueryUserInfo(){
                  if(/^(13\d|14[579]|15\d|17[01235678]|18\d)\d{8}$/.test(this.firstForm.phoneNumber)){
                      this.$ajaxPromise(requestUrl.queryUserInfo,{chkAcct:this.firstForm.phoneNumber},"POST",true).then((res)=>{
                        console.log(res);
                        console.log('调用接口')
//                          this.userId = res.userId;
                          let validatePhoneNumber = (rule, value, callback) => {
                            console.log(res);

                            if (res.isExist != '0'){
                              console.log('走着');
                                  callback(new Error('该账户不存在'));
                            }
                            if (res.userStat === '01'){
                              callback(new Error('该账户已停用,请联系管理员'))
                            }
                            if (res.userType === '1'){
                                callback(new Error('店员用户请联系店长重置密码'))
                            }
                            callback();
                          };
                          console.log(this.firstRules.phoneNumber);
                          console.log(1111);
                          this.firstRules.phoneNumber[2].validator = validatePhoneNumber
//                          this.userStat = res.userStat;
//                          this.userType = res.userType;
//                          this.isExist = res.isExist;
                      }).catch((error)=>{

                      })
                  }
            },
            handleNext(){
                this.$refs.firstForm.validate((validate)=>{
                    if (validate && !this.isCheckSMS) {
                      let checkData = {
                          mchtArtifType:this.firstForm.IDType,
                          mchtArtifId:this.firstForm.IDNumber,
                          setlAcctNo:this.firstForm.bankAccountNumber,
                          phoneNo:this.firstForm.phoneNumber
                      }
                        this.$ajaxPromise(requestUrl.checkIdentity, checkData, "POST", true).then((res) => {
                        console.log(res);
                        console.log('这是身份验证');
                            this.userId = res.userId;
                            let smsId = localStorage.getItem("smsId")
                            let data = {
                                smsId: smsId,
                                chkAcct: this.firstForm.phoneNumber,
                                vrfyCode: this.firstForm.validateCode,
                                chkFlag: '01',
                                chkChnl: '00'
                            }
                            this.isCheckSMS = true;
                            this.$ajaxPromise(requestUrl.checkSMSVerification, data, "POST", true).then((res) => {
                                this.$refs.forgetPwdCarousel.next();
                                this.carouselIndex++;
                                this.isCheckSMS = false;
                            }).catch((error) => {
                                this.isCheckSMS = false;
//                        this.dialogVisible = true
                            })
                        }).catch((error)=>{

                        })
                    }
                });
            },
            handleBackConfirmUserInfo(){
                this.$refs.forgetPwdCarousel.prev();
                if (this.carouselIndex===1){
                    this.$refs.secondForm.resetFields();
                }
                this.carouselIndex--;
            },
            handleConfirmPassword(){
              this.$refs.secondForm.validate((validate)=>{
                if (validate){
                    if (validate){
                        let data = {
                            changeUserId: this.userId,
                            unUsedPwd:encrypt(this.secondForm.password).toUpperCase(),
                            pwdType:'01'
                        }
                        this.$ajaxPromise(requestUrl.resetPwd,data,"POST",true).then((res)=>{
                            this.$refs.forgetPwdCarousel.next();
                            this.carouselIndex++;
                        }).catch((error)=>{

                        })
                    }
                }
              });
            },
//            handleConfirmReset(){
//                this.dialogVisible =false;
//            },

            handleClickComplete(){
                this.$emit('setForgetPwd',false);
            },
            handleIDTypeChange(){
              if(this.firstForm.IDNumber){
                  this.$refs.IDNumber.handleBlur();
              }
            },
            handleClickGetPhoneValidateCode(){
              //手机填写正确才能获取短信验证码
              this.$refs.firstForm.validateField('phoneNumber',(string)=>{
                  if(!string){
                      if (this.countNum == 0){
                          let data = {
                              chkAcct:this.firstForm.phoneNumber,
                              chkChnl:'00',
                              chkFlag:'00'
                          }
                          this.$ajaxPromise(requestUrl.getSMSVerification,data,"POST",true).then((res)=>{

                              localStorage.setItem("smsId",res.smsId)
                          }).catch((error)=>{

                          })
                          this.countNum = 60;
                          let _this = this;
                          let timer = setInterval(()=>{
                              _this.countNum--;

                              if (_this.countNum === 0){
                                  clearInterval(timer);
                              }
                          },1000)
                      }
                  }
              });
            }
        },
        mounted(){
            $(document).scrollTop(0);
        },
        destroyed(){
            $(document).scrollTop(0);
        }
    }


</script>

