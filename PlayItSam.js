//global vars
var playlist;
var playlistIndex;
var playRandom;

//initialize event handlers on window load
window.onload = function () 
{ 
  //initialize global vars
  playlist = [];
  playlistIndex = -1;
  playRandom = false;

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
      loadPlaylist( fileSelected.files[0] );
    }, false);

    var PISplayer = document.getElementById("PlayItSam");
    PISplayer.addEventListener("ended", function (e)
    {
      skip();
      playSong();
    }, false);

    PISplayer.addEventListener("abort", function (e)
    {
      skip();
      playSong();
    }, false);

    PISplayer.addEventListener("error", function (e)
    {
      skip();
      playSong();
    }, false);

    PISplayer.addEventListener("stalled", function (e)
    {
      skip();
      playSong();
    }, false);

    PISplayer.addEventListener("suspend", function (e)
    {
      skip();
      playSong();
    }, false);
  } 
  else 
  {  
    alert("Files are not supported in your browser"); 
  } 
}


//progress to next song, or loop back to beginning
function skip()
{
  playlistIndex = playlistIndex % playlist.length +1; // go to next song when song ends
}

//randomly shuffle the playlist
function randomizePlaylist()
{
  var numsongs = playlist.length;
  for(var i = 0; i < numsongs; i++ )
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
    playRandom ? randomizePlaylist();
    playlistIndex = 0;
    playSong();
  } 
  fileReader.readAsText(file);
}

//load song from filename into PlayItSam player
function loadAndPlaySong(filesong)
{
  //alert("Playing " + filesong);
  var PISplayer = document.getElementById("PlayItSam");
  PISplayer.src=filesong;
  PISplayer.load();
  PISplayer.play();
}

//safely play the current song
function playSong()
{
  if( playlistIndex >=0  && playlistIndex < playlist.length )
  loadAndPlaySong(playlist[playlistIndex]);  
}