//global vars
var playlist;
var playlistIndex;
var playRandom;
var log;

//initialize event handlers on window load
window.onload = function () 
{ 
  //initialize global vars
  playlist = [];
  playlistIndex = -1;
  playRandom = true;
  log = document.getElementById('PISlog');

  //Check the support for the File API support 
  if (window.File && window.FileReader && window.FileList && window.Blob) 
  {
    

    var fileSelected = document.getElementById('txtFileToRead');
    fileSelected.addEventListener('change', function (e) 
    {
      loadPlaylist( fileSelected.files[0] );
    }, false);

    var chkbxRandom = document.getElementById('randomize');
    chkbxRandom.addEventListener('change', function (e) 
    { 
      playRandom = chkbxRandom.checked;
    }, false);

    var PISplayer = document.getElementById("PlayItSam");
    PISplayer.addEventListener("ended", function (e)
    {
      //log.innerHTML += "...ENDED";
      skip();
      loadSong();
    }, false);

    PISplayer.addEventListener("canplay", function (e)
    {
      PISplayer.play();
    }, false);

    PISplayer.addEventListener("abort", function (e)
    {
      log.innerHTML += "...ABORTED";
      skip();
      loadSong();
    }, false);

    PISplayer.addEventListener("error", function (e)
    {
      log.innerHTML += "...ERROR";
      skip();
      loadSong();
    }, false);

    PISplayer.addEventListener("stalled", function (e)
    {
      log.innerHTML += "...STALLED";
      skip();
      loadSong();
    }, false);

  } 
  else 
  {  
    log.innerHTML += "<br/>Files are not supported in your browser"; 
  } 
}


//progress to next song, or loop back to beginning
function skip()
{
  playlistIndex = ++playlistIndex % playlist.length; // go to next song when song ends
}

//randomly shuffle the playlist
function randomizePlaylist()
{
  var numsongs = playlist.length;
  for(var i = 0; i < numsongs*numsongs; i++ )
  {
    var num = Math.floor((Math.random() * playlist.length));
    playlist.push( playlist.splice(num,1) ); //remove random item and move it to the end
  }
}

//given a file (plain text in m3u format), load each line as a song file
function loadPlaylist(file)
{
  var fileReader = new FileReader(); 
  fileReader.onload = function (e) 
  { 
    var allSongs = fileReader.result;
    var eachLine = allSongs.match(/[^\r\n]+/g);
    for(index in eachLine)
    {
      var songname = new String(eachLine[index]);

      if( !songname.match(/^#/) ) //any non-comment line
      {
        playlist.push( songname );
      }
    }
    log.innerHTML += "<br/>Loaded " + playlist.length + " songs. ";
    if(playRandom)
      randomizePlaylist();
    skip();
    loadSong();
  } 
  fileReader.readAsText(file);
}

//load song from playlist into PlayItSam player
function loadSong()
{
  if( playlistIndex >=0  && playlistIndex < playlist.length )
  {
    var filesong = playlist[playlistIndex];
    var PISplayer = document.getElementById("PlayItSam");
    log.innerHTML += "<br/>#" + (playlistIndex+1) + " " + filesong + "<br/>";
    PISplayer.src=filesong;
    PISplayer.load();
  }
}