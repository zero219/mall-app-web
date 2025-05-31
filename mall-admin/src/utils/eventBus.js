// mitt:用来代替vue2中事件总线
// 接收消息 emitter.on('eventName', (payload) => { console.log(val) })
// 发送消息 emitter.emit('pager-change', { pageIndex: 2,pageSize: 20 })
import mitt from 'mitt'
const emitter = mitt()
export default emitter
