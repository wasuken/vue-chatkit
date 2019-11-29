<template>
	<div class="chat">
		<h2>ルーム一覧</h2>
		<ul id="room-list">
			<li v-for="room in this.roomList">
				<a href="javascript:void(0)">{{ room.name }}</a>
			</li>
		</ul>
	</div>
</template>

<script>
 import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
 export default {
	 name: 'ChatTest',
	 data: function(){
		 return {
			 message: 'chatkit-sample',
			 roomList: [],
		 }
	 },
	 methods: {
		 setRooms: function(){
			 const tokenProvider = new TokenProvider({
				 url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/02b72c63-8270-42e6-8a98-bc89a8c58779/token"
			 });
			 const chatManager = new ChatManager({
				 instanceLocator: "v1:us1:02b72c63-8270-42e6-8a98-bc89a8c58779",
				 userId: "test",
				 tokenProvider: tokenProvider
			 });
			 chatManager
				 .connect()
				 .then(currentUser => {
					 this.roomList = currentUser.rooms;
				 })
				 .catch(error => {
					 console.error("error:", error);
				 });
		 }
	 },
	 created: function(){
		 this.setRooms();
	 }
 }
</script>

<style>

</style>
