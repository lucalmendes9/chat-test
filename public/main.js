var socket = io('/');

const renderMessage = message => {
	$('.messages').append('<div class="message"><strong>'+ message.author +'</strong>:'+message.message+'');
}

socket.on('previousMessages', messages => {
	for(message of messages){
		renderMessage(message);
	}
})

socket.on('receivedMessage', message => {
	renderMessage(message);
} )

$('#chat').submit( function(e){
	e.preventDefault();

	var author = $('input[name=username]').val();
	var message = $('input[name=message]').val();

	if(author.length && message.length){
		var objMessage = {
			author: author,
			message: message,
		};
		socket.emit('sendMessage', objMessage);
	}

	renderMessage(objMessage);

})