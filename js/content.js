// Не смотрите в код.
// Я предупредила!

var $ = tinyLib;
var doc = document;
var body = doc.body;
console.log('hello');

var defaultClass = 'criterie-item';
var classHidden = defaultClass + '--hidden';
var classYes = defaultClass + '--yes';
var classNo = defaultClass + '--no';

var checkItems = $.get('.' + defaultClass);

// console.log( checkItems );


//---------------------------------------------

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  var itemName = '';

  if ( request.getCurrents ) {
    sendResponse({ currents: currents });
  }
  else if (request.setBodyClass ) {
    itemName = 'maket';

    currents[itemName] = request.setBodyClass[ itemName ];
    localStorage[itemName] = currents[itemName];

    sendResponse({farewell: "Set current maket"});
  }

});


//---------------------------------------------

function init() {
  checkItems.forEach(function ( item ) {
    var newCheckItem = new checkItem( item );
    newCheckItem.init();
  });
}

//---------------------------------------------

function checkItem( critItem ) {
  this.elemSet = critItem;
  this.dataSet = this.elemSet.elem.dataset;

  this.dataSet.state = '';
  this.dataSet.isOpen = 'true';
};

//---------------------------------------------

checkItem.prototype.init = function () {
  this.addButton();
  this.checkState();
};

//---------------------------------------------

checkItem.prototype.addButton = function () {
  var critItem = this.elemSet;
  var that = this;
  var col = critItem.elem.querySelector('.col-xs-1');
  col.classList.add( defaultClass + '__buttons')

  critItem.button = $.create('button')
          .addClass(defaultClass + '__button')
          .attr({'type': 'button'});

  col.insertBefore( critItem.button.elem, col.firstChild );

  critItem.button.elem.onclick = function () {
    that.toggleVisibility();
  };
}

//---------------------------------------------

checkItem.prototype.toggleVisibility = function () {
  if ( this.dataSet.isOpen === 'true' ) {
    this.dataSet.isOpen = 'false';
  }
  else {
    this.dataSet.isOpen = 'true';
  }
};

//---------------------------------------------

checkItem.prototype.checkState = function () {
  var that = this;

  this.checkBox = this.elemSet.elem.querySelector('[type=checkbox]');
  this.textField = this.elemSet.elem.querySelector('.form-control');
  this.prevText = this.elemSet.elem.querySelector('.text-muted');

  if ( this.checkBox.checked ) {
    this.dataSet.state = 'yes';
    this.dataSet.isOpen = 'false';
  }
  else if ( this.textField.value !== '' || this.prevText ) {
    this.dataSet.state = 'no';
  }

  this.checkBox.onchange = function () {
    if ( this.checked ) {
      that.dataSet.state = 'yes';
    }
    else {
      that.dataSet.state = 'no';
    }
  };

  this.textField.onchange = function () {
    console.log( 'change' );
    if ( this.value !== '') {
      if ( !this.checkBox.checked ) {
        that.dataSet.state = 'no';
      }
    }
    else {
      that.dataSet.state = 'yes';
    }
  };

};



init();

// Functions
// ------------------------------------------
