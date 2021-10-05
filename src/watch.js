import Dep from './dep.js' 

export default class Watch {
	constructor(vm,key,cb) {   
		this.vm = vm 
		this.key = key 
		this.cb = cb 
		Dep.target = this  
		this.oldValue =  vm[key]  
		Dep.target = null 
	}
	
	update() {
		let newValue = this.vm[this.key] 
		if(this.oldValue===newValue) return 
		this.cb(this.oldValue,newValue) 
		this.oldValue = newValue
	}	
}