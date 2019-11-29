<template>
	<div class="chat">
		<div class="header">
			ログインユーザ:{{this.loginUserId}}
		</div>
		<div class="room-list">
			<ul class="nav flex-column">
				<h2>ルーム一覧</h2>
				<li class="nav-item" v-for="room in this.roomList">
					<a class="nav-link active" href="javascript:void(0)" v-on:click="selectedRoom(room, $event)">{{ room.name }}</a>
				</li>
			</ul>
		</div>
		<div class="login-user-list">
			<ul class="nav flex-column">
				<h2>room名:[{{this.curRoom == undefined ? "<未選択>" : this.curRoom.name}}]ログインユーザ一覧</h2>
				<li class="nav-item" v-for="user in this.curRoomLoginUserList">
					{{user.name}}
				</li>
			</ul>
		</div>
		<div class="chat-main">
			<ul class="nav flex-column">
				<h2>room名:[{{this.curRoom == undefined ? "<未選択>" : this.curRoom.name}}]メッセージ一覧</h2>
				<li class="nav-item" v-for="msg in this.curRoomMsgs">
					{{msg.sender.name}} > {{msg.parts[0].payload.content}}
					<a href="javascript:void(0)" v-on:click="deleteMessage(msg.id, $event)">[del]</a>
				</li>
			</ul>
		</div>
		<div class="chat-post">
			<textarea cols="30" id="post-text" rows="10" v-model="curRoomPostText">
				{{this.curRoomPostText}}
			</textarea>
			<input type="submit" value="送信" v-on:click="postMessage" />
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
			 roomList: [],
			 curRoom: null,
			 loginUserId: "",
			 curRoomMsgs: [],
			 curRoomLoginUserList: [],
			 curRoomPostText: "",
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
		 selectedRoom: function(room,  e){
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
					 this.curRoomLoginUserList = currentUser.users;
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
	 created: function(){
		 this.listRoom();
	 }
 }
</script>

<style>

</style>
