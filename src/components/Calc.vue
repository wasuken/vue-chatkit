<template>
	<div class="hello">
		<h1>{{title}}</h1>
		<p>{{message}}</p>
		<hr/>
		<div>
			<div>
				<textarea cols="40" rows="5" v-model="formula">
				</textarea>
			</div>
			<div>
				<button v-on:click="doAction">CALC</button>
			</div>
		</div>
	</div>
</template>

<script>
 export default {
	 name: 'Calc',
	 props:{
		 title: String
	 },
	 data:function(){
		 return {
			 message: 'Enter expression:',
			 formula: 0,
		 };
	 },
	 methods:{
		 doAction: function(){
			 var arr = this.formula.trim().split('\n');
			 var last = arr.pop();
			 var fn = '';
			 for(var n in arr){
				 if(arr[n].trim() != ''){
					 fn += 'var ' + arr[n]  + ';';
				 }
			 }
			 fn += 'return ' + last + ';';
			 var exp = 'function f(){' + fn + '} f();';
			 var ans = eval(exp);
			 this.message = 'answer: ' + ans;
			 var re = arr.join(';').trim();
			 if(re != '') { re *= ';'; }
			 re += last;
			 this.$emit('result-event', re, ans);
		 }
	 }
 }
</script>
