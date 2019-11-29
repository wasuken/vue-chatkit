<template>
	<div class="chat">
		<div class="header">
			ログインユーザ:{{this.loginUserId}}
		</div>
		<div class="room-list float-left">
			<ul class="nav flex-column">
				<h2>ルーム一覧</h2>
				<li class="nav-item" v-for="room in this.roomList">
					<a :id="room.id" class="nav-link active" href="javascript:void(0)" v-on:click="selectedRoom(room, $event)">{{ room.name }}</a>
				</li>
			</ul>
		</div>
		<div class="login-user-list float-left">
			<ul class="nav flex-column">
				<h2>ログインユーザ一覧</h2>
				<li class="nav-item" v-for="user in this.curRoomLoginUserList">
					{{user.name}}
				</li>
			</ul>
		</div>
		<div class="chat-main float-left">
			<ul class="nav flex-column">
				<h2>メッセージ一覧</h2>
				<li class="nav-item" v-for="msg in this.curRoomMsgs">
					{{msg.sender.name}} > {{msg.parts[0].payload.content}}
					<a href="javascript:void(0)" v-on:click="deleteMessage(msg.id, $event)">[del]</a>
				</li>
			</ul>
			<div class="chat-post">
				<textarea id="post-text" rows="2" v-model="curRoomPostText">
					{{this.curRoomPostText}}
				</textarea>
				<input type="submit" value="送信" v-on:click="postMessage" class="btn btn-primary" />
			</div>
		</div>
	</div>
</template>

<script>
 import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
 import Chatkit from '@pusher/chatkit-server';
 export default {
	 name: 'ChatRoom',
	 data: function(){
		 return {
			 message: 'chatkit-sample',
			 sec: 0,
			 roomList: [],
			 curRoom: null,
			 loginUserId: "",
			 curRoomMsgs: [],
			 curRoomLoginUserList: [],
			 curRoomPostText: "",
			 nowDelay: false,
			 chatManager: new ChatManager({
				 instanceLocator: process.env.VUE_APP_INSTANCE_LOCATOR,
				 userId: process.env.VUE_APP_USER_ID,
				 tokenProvider: new TokenProvider({
					 url: process.env.VUE_APP_TOKEN_PROVIDER
				 })
			 }),
			 chatkit: new Chatkit({
				 instanceLocator: process.env.VUE_APP_INSTANCE_LOCATOR,
				 key: process.env.VUE_APP_KEY,
			 }),
		 }
	 },
	 methods: {
		 deleteMessage: function(id, e){
			 this.chatkit.deleteMessage({
				 roomId: this.curRoom.id,
				 messageId: id
			 }).catch(err => console.error(err));
			 this.listRoomMsgAndLoginUser(this.curRoom.id);
		 },
		 postMessage: function(e){
			 this.chatManager
				 .connect()
				 .then(currentUser => {
					 currentUser.sendSimpleMessage({
						 text: this.curRoomPostText,
						 roomId: this.curRoom.id
					 });
				 }).then((result) => this.curRoomPostText = "");
		 },
		 selectedRoom: function(room, e){
			 if(this.nowDelay) return;
			 let alertStr = " alert alert-primary";
			 console.log(document.getElementsByClassName(alertStr));
			 for(let he of document.getElementsByClassName(alertStr)){
				 he.className = he.className.replace(alertStr, "");
			 }
			 e.target.className += alertStr;
			 this.nowDelay = !this.nowDelay
			 setTimeout(()=> this.nowDelay = !this.nowDelay ,4000);

			 this.listRoomMsgAndLoginUser(room.id);
			 this.curRoom = room;
		 },
		 listRoomMsgAndLoginUser: function(id){
			 this.curRoomMsgs = [];
			 this.curRoomLoginUserList = [];
			 this.chatManager
				 .connect()
				 .then(currentUser => {
					 currentUser.subscribeToRoomMultipart({
						 roomId: id,
						 hooks: {
							 onMessage: message => {
								 this.curRoomMsgs.push(message);
							 }
						 }
					 });
					 setTimeout(() => {
						 this.curRoomLoginUserList = currentUser.users;
					 }, 3000);
				 })
		 },
		 listRoom: function(){
			 this.roomList = [];
			 this.chatManager
				 .connect()
				 .then(currentUser => {
					 this.loginUserId = currentUser.id;
					 this.roomList = currentUser.rooms;
				 })
		 }
	 },
	 unchi:{},
	 watch:{
		 sec:function(v, ov){
			 if(v >= 300){
				 if(this.curRoom === null){
					 this.listRoom();
				 }else{
					 this.listRoomMsgAndLoginUser(this.curRoom.id);
				 }
				 this.sec = 0;
			 }
		 }
	 },
	 created: function(){
		 let that = this;
		 setInterval(() => { that.sec++ }, 1000);
		 this.listRoom();
	 }
 }
</script>

<style>
 .room-list{
	 width: 15%;
	 height: 500px;
	 border: solid 3px gray;
 }
 .login-user-list{
	 width: 20%;
	 margin-left: 10px;
	 height: 500px;
	 border: solid 3px gray;
 }
 .chat-main{
	 width: 30%;
	 margin-left: 10px;
	 border: solid 3px gray;
	 height: 500px;
	 position: relative;
 }
 .chat-post{
	 width: 100%;
	 margin-bottom: 0px;
	 position: absolute;
	 bottom: 0;
 }
 #post-text{
	 width: 100%;
 }
</style>
