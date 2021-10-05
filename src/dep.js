
export default class Dep {
	constructor() {
	    this.subs = [] 
		
	}
	
	
	addSub(watcher){
		if(watcher) {
			this.subs.push(Dep.target)
		}
	}
	
	
	notify(){ 
		this.subs.forEach(watcher=>{
			watcher.update()
		})
	}
	
	
}