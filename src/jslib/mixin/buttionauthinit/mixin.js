export default {
    data(){
        return {
            mixinAuths:[],
            mixinAuthGetFinished:false
        }
    },
    beforeMount () {
        this._mixinAuthGet()
    },
    methods : {
        _mixinAuthGet:function () {
            this.mixinAuths = this.$store.state.system.userInfo.userAuthList;

            this.mixinAuthGetFinished = true
            if(this.mixinShowWatcherCheck){
                this.mixinShowWatcherCheck()
            }
        },
        mixinButtonIsDisable:function (auth) {
            if(!this.mixinAuths){
                return true
            }

            let result = false;

            this.mixinAuths.forEach((obj)=>{
                if (obj.authCode === auth && !obj.isAuth){
                    result = true;
                    return;
                }
            })
            return result;
        }
    }
}


