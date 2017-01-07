$(document).ready(function() {
	// Clicking the Get Started button
	$("#start").click(start_app);
	$("#start-tut").click(function() {
		launch_tutorial();
		start_app();
	});
	// Pressing Enter when composing a tweet
	$("#composer textarea").keypress(function(event) {
		if(event.which == 13) {
			event.preventDefault();
			process_composed();
		}
	});
	// Pressing the Tweet button
	$("#composer .button").click(process_composed);
});

function start_app() {
	$('#header').addClass('mini');
	switch_to('interpreter');
}

// Switch tabs to the specified name
function switch_to(target) {
	$('#screens > div').hide();
	$('#'+target).show();
	$('#tabs > div').css('background', '#666');
	$('#'+target+'-tab').css('background', '#ccc');
	$(document).scrollTop(0);
}

// Renders an array of tweets in the specified HTML element.
function display_tweets(user_tweets, element) {
	for(var i = 0; i < user_tweets.length; i++) {
		$(element).append('<div class="tweet" id="'+user_tweets[i]["id"]+'">'+user_tweets[i]["text"]+'<div class="tweets"></div></div>');
		display_tweets(user_tweets[i]["children"], '#'+user_tweets[i]["id"]+' > .tweets');
	}
	$(document).scrollTop($(document).height());
}

// Renders output text to the interpreter.
function output(text) {
	if(typeof text != 'undefined') {
		if(!($('#interpreter > .tweets > div:last').hasClass('output'))) {
			$('#interpreter > .tweets').append('<div class="output"><div>'+text+'</div></div>');
		}
		else {
			$('#interpreter > .tweets > div:last').append('<div>'+text+'</div>');
		}
		$(document).scrollTop($(document).height());
	}
}

// Process the submitted text and create/execute a tweet
function process_composed() {
	var text = $('#composer textarea').val();
	$('#composer textarea').val('> ');
	var tweet = build_tweet(text);
	display_tweets([tweet], '#interpreter > .tweets');
	var x = tweeteval(tweet, global_frame);
	output(x);
}