
import Watcher from './watch.js'


export default class Compiler{
	constructor(vm) { 
		this.el = vm.$el   
		this.vm = vm 
		this.methods = vm.$methods
		this.compile(this.el)  
	}
	
	compile(el) { 
		
		const that = this 
		const childNodes = el.childNodes
		const nodeType = el.nodeType 
		
		switch (nodeType) {  
			/**元素节点 */
			case 1:
				that.compileElement(el)
				break
			
			/**文本节点 */	
			case 3:
				that.compileText(el)
				break
		}
		
		if(childNodes&&childNodes.length>0) { 
			for(let i =0;i<childNodes.length;++i) {
				const node = childNodes[i] 
				this.compile(node)
			}
		}
				
	}
	
	compileText(node) {
		let content = node.textContent   
		const expressionReg = /\{\{(.+?)\}\}/g 
		const matches = content.match(expressionReg)  
		
		if(!matches) return 
		for(let match of matches) {
			let matchKey = match.trim() 
		    matchKey =  matchKey.substring(2,matchKey.length) 
		    matchKey =  matchKey.substring(0,matchKey.length-2).trim() 
			const value = this.vm[matchKey] 
			if(value===undefined) {
				try {
					value = eval(`${matchKey}`)
				}catch(e) {
					throw new Error(`template render error: the key ${matchKey} is not exists in vm or the expression is invalid !`)
				}
			} 
			content =  content.replace(match,value)      
			
		} 
		
		node.textContent = content
	}
	
	
	compileElement(node) { 
		const attributes = node.attributes 
		if(attributes&&attributes.length>0) {
			for(const attr of attributes){ 
				let  name = attr.name ,value = attr.value 
				let type = 0  
				
				/** 解析v-开头的指令 */
				if(name.startsWith('v-'))  {
					name = name.substring(2,name.length).trim() 
						if(name.indexOf(':')>-1){
							type = 1 
							name = name.substring(name.indexOf(':')+1,name.length)
						}
				
					this.update(node,value,name,type) 
					
				/**解析 @绑定的事件 */	 
				}else if(name.startsWith('@')) { 
					type = 1
					name = name.substring(1,name.length).trim()  
					this.update(node,value,name,type)
				}
				
				
				/** 其他的指令发挥你的创造性才能吧！ */ 
				/** 比如考虑如何实现 指令修饰符.sync .stop ... */ 
				/** 当解析完指令后，我们从浏览器还能看到v-* 等属性，如何解析完，在适合的地方
					移除他们，交给你来实现！！！
				*/
				
			} 
		}
	}
	
	
	/**
	 * @param {Object} node
	 * @param {Object} key
	 * @param {Object} directiveName
	 * @param {Object} type 指令类型: 0 普通指令 1 事件指令
	 */
	
	update(node,key,directiveName,type) { 
		
		const updateFn = this[`${directiveName}Updater`] 
		if(!updateFn) throw new Error(`invalid directive:${directiveName}`)
		let value = type==0?
					this.vm[key]: 
					 type==1?
					this.vm.$methods[key]: 
					null 
								
		if(value===undefined) {
			try {
				value = eval(`${key}`)
			}catch(e) {
				throw new Error(`template render error: the key ${matchKey} is not exists in vm or the expression is invalid !`)
			}
		} 
		updateFn.call(this,node,value,key)			 
	}
	
	textUpdater(node,value,key) {
		node.innerText = value 
		new Watcher(this.vm,key,(oldValue,newValue)=>{  
			node.innerText = newValue 
		})
		
	}
	
	
	htmlUpdater(node,value,key) {
		node.innerHTML = value 
		new Watcher(this.vm,key,(oldValue,newValue)=>{
			node.innerHTML = newValue
		})
	}
	
	
	modelUpdater(node,value,key) {
		//暂且只有input等有value值得元素可以设置v-model 
		if(node.value==undefined) throw new Error(`directive v-model using in a invalid way!`) 
		node.value = value 
		new Watcher(this.vm,key,(oldValue,newValue)=>{
			node.value = newValue
		})
		
		node.addEventListener('input',(e)=>{
			this.vm[key] = e.target.value
		})
		
	}
	
	ifUpdater(node,value,key) {
		
		//v-if = "true" 表达式形式
		if(key.trim() ===(value+"")) {
			value? node : 
			node.parentNode.removeChild(node)
		}else{  
			
			
			let next 
			let parent 
			
			value? node :(
			parent = node.parentNode,
			next = node.nextSibling,
			parent.removeChild(node)
			)  
						
			new Watcher(this.vm,key,(oldValue,newValue)=>{
					newValue?
						parent.insertBefore(node,next):( 
						next = node.nextSibling,
						parent.removeChild(node)
					 )
			})
			
		}
		
	}
	
	
	clickUpdater(node,value,key) {
		node.addEventListener('click',()=>{
			value.call(this.vm)
		}) 
		
	}
	
	
	
	
	
}