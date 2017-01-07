var current_step = 0;
var steps = [
	[
	"Welcome to TweetScript! This is a programming language made up of Tweets.",
	"To write your first line of code, type the following into the white box below, then press \"Enter\":",
	"> print \"hello world\""
	],
	[
	"The blue box is the Tweet you just wrote.",
	"The yellow box is the output. As you can see, the interpreter has printed your phrase as instructed.",
	"Now let's try some arithmetic. Type in the following:",
	"> 2 plus 3"
	],
	[
	"You can even nest operations by using parentheses. Try this:",
	"> (10 minus 8) times (6 divided by 3)"
	],
	[
	"In TweetScript, hashtags are variables. Set a hashtag to a certain value, and that value can be retrieved later.",
	"Try it out with these two Tweets:",
	"> set #bearhack to 3",
	"> #bearhack times #bearhack"
	],
	[
	"TweetScript allows you to write functions on Twitter, then import them into the TweetScript interpreter.",
	"First, try importing tweets from the example Twitter account <a href=\"https://twitter.com/tweetscript_ex\">@tweetscript_ex</a>:",
	"> import @tweetscript_ex",
	"After successfully importing the Tweets, you can preview them using the tabs at the top of the screen."
	],
	[
	"In the interpreter, you can now call these functions by typing in the function's name, replacing the hashtags with input values as necessary.",
	"Try the following, then try them with different numbers and see what happens:",
	"> GO",
	"> What is 5 squared?",
	"> Count down from 10",
	"> Math majors love to eat fibonachos 6"
	],
	[
	"That's it! If you're interested, create a new Twitter account to write your own functions, using the <a href=\"https://twitter.com/tweetscript_ex\">TweetScript examples</a> as reference.",
	"TweetScript was built at a hackathon by a team of five UC Berkeley freshmen. We hope you enjoyed our project!"
	]
];

function launch_tutorial() {
	$('#interpreter').addClass('tut-on');
	current_step = 0;
	goto_step(0);
}

function end_tutorial() {
	$('#interpreter').removeClass('tut-on');
}

function prev_step() {
	goto_step(current_step - 1);
}

function next_step() {
	goto_step(current_step + 1);
}

function goto_step(n) {
	if(n >= 0 && n < steps.length) {
		
		var text = '<div class="text">';
		
		for(var i = 0; i < steps[n].length; i++) {
			if(steps[n][i].charAt(0) == '>') {
				text += '<div class="tweet">' + steps[n][i] + '</div>';
			}
			else {
				text += '<p>' + steps[n][i] + '</p>';
			}
		}
		
		text += '</div><div class="links">';
		if(n != 0) text += '<span id="prev">prev</span>';
		if(n + 1 < steps.length) text += '<span id="next">next</span>';
		else text += '<span id="close">close</span>';
		text += '</div>';
		
		$('#tutorial').html(text);
		$("#prev").click(prev_step);
		$("#next").click(next_step);
		$("#close").click(end_tutorial);
		current_step = n;
	}
}