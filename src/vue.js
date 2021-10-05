
import Observer from './observer.js' 
import Watcher from './watch.js'
import Compiler from './compiler.js' 

export default class Vue { 
	constructor(option) { 
		this.$el = this.checkEl(option.el)
		this.$data = option.data || {}
		this.$methods = option.methods ||{} 
		this.proxy(this.$data)
		
		//建立响应式数据
		new Observer(this.$data) 
		
		//解析模板
		new Compiler(this)
		
	}
	
	
	checkEl(el){  
		const $el = typeof el ==='string' ? 
			document.querySelector(el)
			: el
		if(!$el) throw new Error('myvue warn: The option el is invalid!') 
		return $el  
	}
	
	proxy(data) { 
		Object.keys(data).forEach(key=>{ 
			Object.defineProperty(this,key,{
				enumerable:true,
				configurable:true,
				get(){
					return data[key] 
				}, 
				set(newVal) { 
					if(newVal===data[key]) return 
					data[key]= newVal 
				}
			})
			
		})
	}
	
}


