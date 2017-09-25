import CommerceInfo from '../components/mchtsCenter/commerceinfo'
 import Contract from '../components/mchtsCenter/contract'
 import MchtsCenterRoleManage from '../components/mchtsCenter/rolemanage'
 import StoreInfo from '../components/mchtsCenter/storeinfo'
 import MchtsCenterUserManage from '../components/mchtsCenter/usermanage'
 import UserPwd from '../components/mchtsCenter/userpwd'
 import EventInfo from '../components/serviceCenter/eventinfo'
 import MaterialTemplate from '../components/serviceCenter/materialtemplate'
 import ForgetPassword from '../components/system/forgetpassword'
 import ResetPassword from '../components/system/resetpassword'
 import SelectMerchant from '../components/system/selectmerchant'
 import SystemNotice from '../components/system/systemnotice'
 import Settlement from '../components/transCenter/settlement'
 import StoreTradeStatistic from '../components/transCenter/storeTradeStatistic'
 import StoreTradeInfo from '../components/transCenter/storetradeinfo'
 import TransCenterTransinfo from '../components/transCenter/transinfo'
 import TransCenterTransStatistics from '../components/transCenter/transstatistics'
 export default [
 { path: '/mchtsCenter/commerceinfo', name: 'CommerceInfo', component:CommerceInfo},
 { path: '/mchtsCenter/contract', name: 'Contract', component:Contract},
 { path: '/mchtsCenter/rolemanage', name: 'MchtsCenterRoleManage', component:MchtsCenterRoleManage},
 { path: '/mchtsCenter/storeinfo', name: 'StoreInfo', component:StoreInfo},
 { path: '/mchtsCenter/usermanage', name: 'MchtsCenterUserManage', component:MchtsCenterUserManage},
 { path: '/mchtsCenter/userpwd', name: 'UserPwd', component:UserPwd},
 { path: '/serviceCenter/eventinfo', name: 'EventInfo', component:EventInfo},
 { path: '/serviceCenter/materialtemplate', name: 'MaterialTemplate', component:MaterialTemplate},
 { path: '/system/forgetpassword', name: 'ForgetPassword', component:ForgetPassword},
 { path: '/system/resetpassword', name: 'ResetPassword', component:ResetPassword},
 { path: '/system/selectmerchant', name: 'SelectMerchant', component:SelectMerchant},
 { path: '/system/systemnotice', name: 'SystemNotice', component:SystemNotice},
 { path: '/transCenter/settlement', name: 'Settlement', component:Settlement},
 { path: '/transCenter/storeTradeStatistic', name: 'StoreTradeStatistic', component:StoreTradeStatistic},
 { path: '/transCenter/storetradeinfo', name: 'StoreTradeInfo', component:StoreTradeInfo},
 { path: '/transCenter/transinfo', name: 'TransCenterTransinfo', component:TransCenterTransinfo},
 { path: '/transCenter/transstatistics', name: 'TransCenterTransStatistics', component:TransCenterTransStatistics},
 ]