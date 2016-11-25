//const React = require('react');
//const ReactDOM = require('react-dom');
var $ = require('jquery');
var animateSvgPath = require('./animateSvgPath.js').animateSvgPath;
//var babel = require('babelify');
//var menu = require('./jsx/menu.jsx');

//var myDivElement = <div className="foo" />;
//ReactDOM.render(myDivElement, document.getElementById('container'));
//console.log('here');
//menu.render();
$(document).ready(function(){
  var path = document.querySelector('.z-svg path.animated');
  setTimeout(function(){
    $('body').addClass('loaded');
    setTimeout(function(){
      $('.LoadingOverlay').addClass('hidden');
    },500);
  }, 1000);

  animateSvgPath(path, {
    infiniteLoop: false,
    duration: 1.8,
    transition: 'ease-in-out',
    loopCount: 3,
    strokeColor: '#9aff83'
  });
});

