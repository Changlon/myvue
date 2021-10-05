
import Dep from './dep.js' 

export default class Observer {
	
	constructor(data) {  
		this.traverse(data)
	}
	
	traverse(data) { 
		if(typeof data!=='object') return 
		const that = this 
		Object.keys(data).forEach(key=>{ 
			if(typeof data[key]==='object') {
				that.traverse(data[key])
			}else{
				that.defineReactive(data,key,data[key])
			}
		})
	}
	
	defineReactive(obj,key,val) {  
		let dep = new Dep()
		const that = this 
		Object.defineProperty(obj,key,{
			enumerable:true,
			configurable:true,
			get(){
				Dep.target && dep.addSub(Dep.target)
				return val
			}, 
			set(newVal) { 
				if(newVal===val) return
				val = newVal
				that.traverse(newVal)
				dep.notify()
			}
		})
	}		
}

