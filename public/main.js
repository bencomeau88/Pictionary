$(document).ready(function() {

var pictionary = function() {
  var socket = io();
  var drawing = false;
    var canvas, context;

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };

    var guessBox;

var onKeyDown = function(event) {
    if (event.keyCode != 13) { // Enter
        return;
    }
    var guess = guessBox.val();
    socket.emit('guess', guess);
    console.log(guessBox.val());
    guessBox.val('');
};

var nickname = prompt('What is your nickname');
$('.nicknames').html(nickname);
socket.emit('userReg', nickname);

var displayGuess = function(guess){
  console.log(guess);
  $('#guesses').text("Guessed: " + guess);
}

var wordCount = 0;
var messages = $('.messages');
var nicknames = $('.nicknames');

var words = [
  "word", "letter", "number", "person", "pen", "class", "people",
   "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
   "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
   "land", "home", "hand", "house", "picture", "animal", "mother", "father",
   "brother", "sister", "world", "head", "page", "country", "question",
   "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
   "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
   "west", "child", "children", "example", "paper", "music", "river", "car",
   "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
   "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
   "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
   "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
   "space"
];
// I want to have a timeout() that clears the login info 5 seconds after someone logs in
var timeout = function(message){
  setTimeout(function(){
    nicknames.remove();
  }, 5000);
}
// how to display this message on "disconnect" EVT.
var winMessage = function(win){
  alert(win);
}

var addMessage = function(message){
  messages.text(message);
};

var logEvents = function(nickname){
  nicknames.text(nickname);
}

var usersOnline = function(nicknames){
  $('.nicknames').html(nicknames.map(function(nickname){return $('<div>' + nickname + '</div>')}))
};

var newWord = function(){
  var wordCount = Math.floor(Math.random() * (words.length));
  var chosenWord = words[wordCount];
  $('.wordChoice').text(chosenWord)
};

var drawer = function(){
  $('#guess').hide();
  $('.messages').text('you are the drawer!');
}
var guesser = function(){
  $('.messages').text('you are the guesser!');
};
guessBox = $('#guess input');
guessBox.on('keydown', onKeyDown);

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;

    canvas.on('mousedown', function(){
      drawing = true;
    });
    canvas.on('mouseup', function(){
      drawing = false ;
    });
    canvas.on('mousemove', function(event) {
      if(drawing){
        var offset = canvas.offset();
        var position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};
        // emitting a 'draw' event whne you use the mousemove()
        socket.emit('draw', position);
        draw(position);
        }
    });

    socket.on('guesser', guesser);
    socket.on('drawer', drawer);
    socket.on('newWord', newWord);
    socket.on('userList', usersOnline)
    socket.on('prompt', winMessage);
    socket.on('userReg', logEvents, timeout);
    socket.on('message', addMessage);
    socket.on('guess', displayGuess);
    socket.on('draw', draw);
};
 pictionary();
});
