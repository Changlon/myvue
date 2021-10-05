 import Vue from './vue.js' 
 
  var vm = new Vue({
		
		el:'#app',
		data:{ 
			name:'changlon',
			age:21,
			family:{
				father:{
					name:'henzhong',
					age:50
				},
				mother:{
					name:'haihua',
					age:46
				}
			},
			model:'hello v-model',
			isShow:false,
			html:''
			
		},
		methods:{
				walk() {
					console.log('walk')
				},
				click1() {
					this.isShow = true	
				},
				click2() {
					this.html = `
						
						<h1 style="text-align:center;color:red;" >Title</h1>
						<p>this is a simple-vue, about derective v-html usage</p>
					
					`
				},
				click3() {
					alert(`大家好 我叫${this.name},今年 ${this.age}岁!`)
				}
		}
	  
  }) 
  

