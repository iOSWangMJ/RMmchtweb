<template>
    <el-form class="base-form" ref="form" :model="formData"
             v-bind="vBind">
        <el-form-item v-for="input in inputs" :key="input.name" :label="input.label" :prop="input.name">

            <el-input
                v-if="input.type === 'text'"
                v-bind="'vBind' in input ? input.vBind : defaultVBind"
                v-model="formData[input.name]"
                @blur="blur(input)"
                @focus="focus(input)"
                @change="change(input)"
                :ref="input.name"
            >
            </el-input>

            <el-input
                v-if="input.type === 'textarea'"
                type="textarea"
                v-bind="'vBind' in input ? input.vBind : defaultVBind"
                v-model="formData[input.name]"
                @blur="blur(input)"
                @focus="focus(input)"
                @change="change(input)"
                :ref="input.name"
                >
            </el-input>

            <el-autocomplete
                v-if="input.type === 'autocomplete'"
                v-bind="'vBind' in input ? input.vBind : defaultVBind"
                v-model="formData[input.name]"
                @blur="blur(input)"
                @focus="focus(input)"
                @change="change(input)"
                :ref="input.name"
            ></el-autocomplete>
            <el-select
                v-if="input.type === 'select'"
                v-bind="'vBind' in input ? input.vBind : defaultVBind"
                v-model="formData[input.name]"
                :remote-method="selectremoteHandler(input)"
                @change="change(input)"
                :ref="input.name"
               >
                <el-option
                    v-for="item in staticData[input.staticName]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" >
                </el-option>
            </el-select>
            <el-radio-group
                v-if="input.type === 'radio'"
                v-bind="'vBind' in input ? input.vBind : defaultVBind"
                v-model="formData[input.name]"
                @change="change(input)"
                :ref="input.name"
            >
                <el-radio v-for="radio in input.items" v-bind="'vBind' in radio ? radio.vBind : defaultVBind"  :key="radio.value" label="radio.value">{{radio.label}}</el-radio>
            </el-radio-group>
            <el-checkbox-group
                v-if="input.type === 'checkbox '"
                v-bind="'vBind' in input ? input.vBind : defaultVBind"
                v-model="formData[input.name]"
                @change="change(input)"
                :ref="input.name"
            >
                <el-checkbox v-for="checkbox in input.items" v-bind="'vBind' in checkbox ? checkbox.vBind : defaultVBind"  :key="checkbox.value" label="checkbox.value">{{checkbox.label}}</el-checkbox>
            </el-checkbox-group >
            <el-time-select
                v-if="input.type === 'time'"
                v-bind="'vBind' in input ? input.vBind : defaultVBind"
                v-model="formData[input.name]"
                @change="change(input)"
                :ref="input.name"
            >
            </el-time-select>
            <el-date-picker
                v-if="input.type === 'date'"
                v-bind="'vBind' in input ? input.vBind : defaultVBind"
                v-model="formData[input.name]"
                @change="change(input)"
                :ref="input.name"
            >
            </el-date-picker>
	    <el-date-picker
                v-if="input.type === 'daterange'"
                type="daterange"
                v-bind="'vBind' in input ? input.vBind : defaultVBind"
                v-model="formData[input.name]"
                @change="change(input)"
                :ref="input.name"
                >
            </el-date-picker>
            <el-switch
                v-if="input.type === 'switch'"
                v-bind="'vBind' in input ? input.vBind : defaultVBind"
                v-model="formData[input.name]"
                @change="change(input)"
                :ref="input.name"
            >
            </el-switch>

        </el-form-item>
        <slot name="other-items"></slot>
        <el-row>
            <el-col :push="3">
                <el-form-item>
                    <slot name="submitButton"></slot>
                </el-form-item>
                <el-form-item v-if="reset">
                    <el-button @click="formReset" > 重置</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>
<style lang="scss">
    $input-border-color:#e7e8ea;
    .base-form .el-button{
        border-radius: 2px;
        border: none;
        color: white;
    }
    .base-form .el-button:hover,    .base-form .el-button:focus,.base-form .el-button:active{
        color:white;
        border:none;
    }
    .base-form .el-input__inner,.firstForm .el-input__inner{
        height: 37px;
        border-radius: 0;
        border-color: $input-border-color;
    }
</style>
<script>

    export default{
        name:'base-form',
        data(){
            return{
                formData:{},
                defaultVBind:{},
                tempInput:{}
            }
        },
        props: {
            /**是否包含重置按钮*/
            reset:{
                type: Boolean,
                default: false
            },
            /**输入配置*/
            inputs:{
                type: Array,
                default: []
            },
            /**绑定对象*/
            data:{
                type: Object,
                required: true
            },
            /**静态数据对象*/
            staticData:{
                type: Object,
                default: {}
            },
            /** 自定义v-bind */
            vBind:{
                type: Object,
                default: () => {}
            }
        },
        components:{

    },
        methods:{
            blur(input){
                this.$emit("blur",input,this.formData[input.name])
            },
            focus(input){
                this.$emit("focus",input,this.formData[input.name])
            },
            change(input){
                console.log(this.$refs['form'])
                console.log(this.$refs[input.name])
                this.$emit("change",input,this.formData[input.name])
            },
            isValidatePass(){
                let formValid
                this.$refs['form'].validate((valid) => {
                    formValid = valid
                })
                return formValid
            },
            getFormDataIfValidatePass(){
                if(this.isValidatePass()){
                    return this.formData
                }else{
                    return null
                }
            },
            formReset(){
                this.$refs['form'].resetFields()
                this.formData = this.$dataClone(this.data)
            },
            setFormData(data){
                this.formData = data
            },
            setFormProperty(property,value){
                this.formData[property] = value
            },
            getFormData(){
                return this.formData
            },
            remoteQuery(query,input){
                if(!'vBind' in input ){
                    return
                }
                if(!'remote' in input.vBind ){
                    return
                }
                if(!input.vBind.remote ){
                    return
                }
                console.log('remoteQuery',query)
                let _this = this
                if(query && query.length > 0){
                    _this.$ajaxPromise(input.remoteUrl,{name:query},"POST",true)
                        .then(function(resp){
                            _this.staticData[input.staticName] = resp.dataList
                        }).catch(function(error){

                    })
                }
            },
            selectremoteHandler(input){
                let _this = this
                return function (query) {
                    var inputInner = _this.$dataClone(input)
                    _this.remoteQuery(query,inputInner)
                }
            }
        },
        mounted(){
            this.formData = this.$dataClone(this.data)
            this.$emit("mounted")
        }
    }
</script>
