// Не смотрите в код.
// Я предупредила!

var $ = tinyLib;
var doc = document;
var body = doc.body;

var defaultClass = 'criterie-item';
var checkItems = $.get('.' + defaultClass);
var checkItemsIndex = {};
var itemsCounter = 0;
var attentionList = {};
var attentionListContent = null;
var attentionListElem = null;

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

  attentionListElem = $.create('div').addClass('attention-list');
  body.appendChild( attentionListElem.elem );
  printAttentionList();
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
  this.id = 'crit-' + itemsCounter++;
  this.elemSet.attr({id: this.id});

  this.addToIndex();
  this.addButton();
  this.checkState();
};

//---------------------------------------------

checkItem.prototype.addToIndex = function () {
  var labelElem = this.elemSet.elem.querySelector('label');
  var labelText = labelElem.innerText;
  var critNum = labelText.match(/\S\d{1,}\b/);

  checkItemsIndex[ this.id ] = {
    'num': critNum,
    'labelText': labelText
  };
}

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

  this.addLinksToText();

  this.changeState( 'load' );

  this.checkBox.onchange = function () {
    that.changeState( 'change' );
    printAttentionList();
  };
  this.textField.oninput = function () {
    that.changeState( 'change' );
    printAttentionList();
  };
  this.textField.onkeyup = function () {
    that.changeState( 'change' );
    printAttentionList();
  };
};

//---------------------------------------------

checkItem.prototype.changeState = function ( evt ) {
  if ( this.checkBox.checked ) {
    this.dataSet.state = 'yes';

    if ( evt === 'load' ) {
      this.dataSet.isOpen = 'false';
    }
  }
  else if ( this.textField.value !== '' || this.prevText ) {
    this.dataSet.state = 'no';
  }
  else {
    this.dataSet.state = '';
  }

  this.addToAttentionItems();
};

//---------------------------------------------

checkItem.prototype.addToAttentionItems = function () {
  if ( this.dataSet.state === 'no') {
    attentionList[ this.id ] = this.id;
  }
  else if ( attentionList[ this.id ] ) {
    delete attentionList[ this.id ];
  }
}

//---------------------------------------------

function printAttentionList () {
  var critIds = Object.keys( attentionList ).sort( sortIds );

  if ( attentionListContent ) {
    attentionListContent.elem.parentNode.removeChild( attentionListContent.elem );
  }

  if ( critIds.length === 0 ) {
    return;
  }

  attentionListContent = $.create('div').addClass('attention-list__content');

  critIds.forEach( function ( item ) {
    var linkText = checkItemsIndex[ item ].num;
    var linkTitle = checkItemsIndex[ item ].labelText;

    var link = $.create('a').attr({'href': '#' + item, 'title': linkTitle}).html( linkText );
    attentionListContent.append( link );
  });

  attentionListElem.append( attentionListContent );
};

//---------------------------------------------

checkItem.prototype.addLinksToText = function () {
  if ( !this.prevText ) {
    return;
  }
  var text = this.prevText.innerHTML;
  var pattern = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/gm;

  this.prevText.innerHTML = text.replace( pattern, '<a href="$&">$&</a>');
};

// ------------------------------------------

function sortIds( a, b ) {
  var aNum = parseInt(a.slice(5), 10);
  var bNum = parseInt(b.slice(5), 10);
  return aNum > bNum ? 1 : -1;
}

//---------------------------------------------

init();
