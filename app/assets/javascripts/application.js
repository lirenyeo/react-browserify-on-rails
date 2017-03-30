
/*  Old Configuration after 'rails g install:react'
 require jquery
 require jquery_ujs
 require turbolinks
 require react
 require react_ujs
 require components
 require_tree .
 *********************************************** */

// We only require js modules that we can't get npm packages for
// Anything declared in application.js won't be available to prerendering
// For server-side prerendering, use components.js
// Bootstrap needs to be required after jQuery (located in _self)

//= require_self
//= require react-server
//= require react_ujs
//= require tether
//= require bootstrap

window.$ = window.jQuery = global.$ = require('jquery');
var React = window.React = global.React = require('react');
var ReactDOM = window.ReactDOM = global.ReactDOM = require('react-dom');

require( 'jquery-ujs' );
require( 'fetch' );
require( './components' );

$(document).ready(() => {
    $(".dropdown-toggle").dropdown();
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover(); 
});