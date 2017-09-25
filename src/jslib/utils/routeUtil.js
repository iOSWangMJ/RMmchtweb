/**
 * Created by wwj on 2017/3/9.
 */
import * as SystemContext from '../context/SystemContext'

function goHome(vueObject) {
    vueObject.$router.push(SystemContext.PATH_HOME)
}

export {goHome}
