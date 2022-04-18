
const _o = function _o(obj: any) {
    return {
        obj,
        key(key: string) {
            return _o(obj[key])
        }
    }    
}
export default _o;