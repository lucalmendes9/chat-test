var socket = io('/');

const renderMessage = message => {
	$('.messages').append('<div class="message"><strong>'+ message.author +'</strong>:'+message.message+'');
}
const renderPeoples = data => {
	console.log(data.count);
	if(data.count > 1){
		$('.peoples p').text(''+data.count+' usuarios online!');	
	}else{
		$('.peoples p').text(''+data.count+' usuario online!');	
	}
}

const listarUsuarios = users => {
	$('.users p').remove();
	for(user of users){
		$('.users').append('<p>'+user+'</p>');
	}
}

socket.on('previousMessages', messages => {
	for(message of messages){
		renderMessage(message);
	}
})

socket.on('receivedMessage', message => {
	renderMessage(message);
} )

socket.on('users', data => {
	renderPeoples(data);
})

socket.on('listUsers', users => {
	listarUsuarios(users);
});
		

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

		renderMessage(objMessage);
	}
	
})