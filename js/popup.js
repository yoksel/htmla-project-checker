var button = document.querySelector('.button');
var currents = {};

sendMsg( 'getCurrents' );

//---------------------------------------------

function sendMsg( func, key, value ) {
  var data = {};
  data[ func ] = {};

  if ( key ) {
    data[ func ][ key ] = value;
  }

  chrome.tabs.query(
    {active: true, currentWindow: true},
    function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id,
      data,
      function(response) {
        if( response && response.currents ){
          currents = response.currents;

          init();
        }
      });
  });
}

function init() {
  if( currents.htmlaCheckerState ) {
    button.classList.add('button--on');
  }
}
//---------------------------------------------

button.onclick = function () {
  this.classList.toggle('button--on');
  sendMsg('changeExtnState', 'toggleState', '');
}

//---------------------------------------------
