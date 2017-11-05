$(document).ready(function() {
  initModalHref();
  $(window).resize(function(){
    slide_resize();
  });

  $(window).load(function(){
    slide_resize();
  });
});

function slide_resize(){
  var blockWidth = $('.grid-3d-item').width();
  $('.grid-3d-item').css({height: blockWidth + 'px'});
}

function initModalHref(){
  $('[data-href]').click(function(){
    $('.modal-info iframe').attr('src', $(this).data('href'));
    $('.modal-info').slideDown(300);
    $("body").css("overflow","hidden");
  });

  $('.backdrop').click(function(){
    $('.modal-info').slideUp(300);
    $('.modal-info iframe').removeAttr('src');
    $("body").css("overflow","auto");
  });
}









// --------------------3D GRID----------------------

/*
* Example for http://isuttell.github.io/distort
*/

/*
* Blocks Constructor
*
* Stores all the blocks
*/
function Blocks($blocks) {
  this.$blocks = $blocks;

  this._events();
}

/*
* Start the events
*/
Blocks.prototype._events = function() {
  var _this = this;
  this.$blocks.hover(function(){
    $(this).addClass('active');
    _this.update();
  }, function() {
    $(this).removeClass('active');
    _this.update();
  });
};

/*
* Calculate which row an index is in
*/
function row(index) {
  return Math.floor(index / 5);
}

/*
* Calculate which column an index is in
*/
function column(index) {
  return index % 5;
}

/*
* Each grid item is a block which positions
* itself within the grid and then applies the
* appropriate transformation
*/
function Block($el, index, activeIndex, factor) {
  this.$el = $el;
  this.index = index;
  this.matrix = new Distort({ $el: $el });

  this.row = row(index);
  this.column = column(index);
  if(activeIndex === -1) { return; }

  var activeRow = row(activeIndex);
  var activeColumn = column(activeIndex);

  this.factor = factor || 20;

  var direction;
  if(this.isNear(activeRow, activeColumn) && index === activeIndex - 6) {
    direction = 'topLeft';
  } else if (this.isNear(activeRow, activeColumn) && index === activeIndex - 5) {
    direction = 'top';
  } else if (this.isNear(activeRow, activeColumn) && index === activeIndex - 4) {
    direction = 'topRight';
  } else if (this.isNear(activeRow, activeColumn) && index === activeIndex - 1) {
    direction = 'left';
  } else if (this.isNear(activeRow, activeColumn) && index === activeIndex) {
    direction = 'center';
  } else if (this.isNear(activeRow, activeColumn) && index === activeIndex + 1) {
    direction = 'right';
  } else if (this.isNear(activeRow, activeColumn) && index === activeIndex + 4) {
    direction = 'bottomLeft';
  } else if (this.isNear(activeRow, activeColumn) && index === activeIndex + 5) {
    direction = 'bottom';
  } else if (this.isNear(activeRow, activeColumn) && index === activeIndex + 6) {
    direction = 'bottomRight';
  }

  if(direction && this[direction]) { this[direction](this.factor); }
}

/*
* Calculate if an element is within on space
*/
Block.prototype.isNear = function(row, column) {
  if(Math.abs(this.row - row) > 1) { return false; }
  if(Math.abs(this.column - column) > 1) { return false; }
  return true; 
}

/*
* Move the top left corner 
*/
Block.prototype.topLeft = function(factor) {
  factor = factor || this.factor;

  this.matrix.bottomRight.x += -factor;
  this.matrix.bottomRight.y += -factor;
}

/*
* Move the top
*/
Block.prototype.top = function(factor) {
  factor = factor || this.factor;

  this.matrix.bottomLeft.x += -factor;
  this.matrix.bottomLeft.y += -factor;

  this.matrix.bottomRight.x += factor;
  this.matrix.bottomRight.y += -factor;
}

/*
* Move the top right corner 
*/
Block.prototype.topRight = function(factor) {
  factor = factor || this.factor;

  this.matrix.bottomLeft.x += factor;
  this.matrix.bottomLeft.y += -factor;
}

/*
* Move the left 
*/
Block.prototype.left = function(factor) {
  factor = factor || this.factor;

  this.matrix.topRight.x += -factor;
  this.matrix.topRight.y += -factor;

  this.matrix.bottomRight.x += -factor;
  this.matrix.bottomRight.y += +factor;
}

/*
* Scale the center 
*/
Block.prototype.center = function(factor) {
  factor = factor || this.factor;
  this.matrix.topLeft.x += -factor;
  this.matrix.topLeft.y += -factor;

  this.matrix.topRight.x += factor;
  this.matrix.topRight.y += -factor;

  this.matrix.bottomLeft.x += -factor;
  this.matrix.bottomLeft.y += factor;

  this.matrix.bottomRight.x += factor;
  this.matrix.bottomRight.y += factor;
}

/*
* Move the right
*/
Block.prototype.right = function(factor) {
  factor = factor || this.factor;
  
  this.matrix.topLeft.x += factor;
  this.matrix.topLeft.y += -factor;
  
  this.matrix.bottomLeft.x += factor;
  this.matrix.bottomLeft.y += factor;
}

/*
* Move the bottom left corner 
*/
Block.prototype.bottomLeft = function(factor) {
  factor = factor || this.factor;

  this.matrix.topRight.x += -factor;
  this.matrix.topRight.y += factor;
}

/*
* Move the bottom edge
*/
Block.prototype.bottom = function(factor) {
  factor = factor || this.factor;

  this.matrix.topRight.x += factor;
  this.matrix.topRight.y += factor;

  this.matrix.topLeft.x += -factor;
  this.matrix.topLeft.y += factor;
}

/*
 * Move the bottom right corner 
 */
Block.prototype.bottomRight = function(factor) {
  factor = factor || this.factor;

  this.matrix.topLeft.x += factor;
  this.matrix.topLeft.y += factor;
}


/*
 * Apply the transform to a block
 */
Blocks.prototype.update = function() {
  window.requestAnimationFrame(animate.bind(this));
}

function animate() {
  var index = -1;
  var length = this.$blocks.length;

  var activeIndex = this.$blocks.siblings('.active').index();

  while(++index < length) {
    var $el = this.$blocks.eq(index);

    var block = new Block($el, index, activeIndex, 10);

    $el.css({
      'transform': block.matrix.toString()
    });
  }
}

/*
 * Initialize
 */
new Blocks($('.grid-3d-item'));



/**
 * Additional 3D shift on mouse move
 */
/*var $blocks = $('.grid-3d');

window.addEventListener('mousemove', function(event){
  var width = $(window).width();
  var height = $(window).height();
  
  var x = ((event.pageX - (width / 2)) / width) * 2;
  var y = ((event.pageY - (height / 2)) / height) * 2;

//  Blocks
  $blocks.css({
    'transform' :  'translateZ(-10px) rotateY(' + (x * -2) + 'deg) rotateX(' + (y * 2) + 'deg)'
  });
  
//  Background
  $('body').css({
    'background-position' :  (x * -5) + 'px ' + (y * -5) + 'px' 
  });
}, false);*/