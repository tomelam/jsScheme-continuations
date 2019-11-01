/*
initScheme.js - Initialisation of Scheme in JavaScript, standalone version
Copyright (C) 2009  Tom Elam
Copyright (C) 2006  Chris Double
Copyright (C) 2003  Alex Yakovlev

This file is part of jsScheme.

jsScheme is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, Version 2.

As a special exception to GPL, any HTML file which merely makes
function calls to this code, and for that purpose includes it by
reference shall be deemed a separate work for copyright law
purposes. In addition, the copyright holders of this code give you
permission to combine this code with free software libraries that are
released under the GNU LGPL. You may copy and distribute such a system
following the terms of the GNU GPL for this code and the LGPL for the
libraries. If you modify this code, you may extend this exception to
your version of the code, but you are not obligated to do so. If you
do not wish to do so, delete this exception statement from your
version.

jsScheme is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
General Public License for more details.

You should have received a copy of the GNU General Public License
along with jsScheme; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
02110-1301, USA.

The source code for jsScheme 0.1-tae can be downloaded from
http://www.tomelam.com or, normally, by clicking the 'Get the
Software' button wherever jsScheme 0.1-tae is installed on a web
server.  To obtain the source code via mail order, send your request
to Tom Elam at the email address 'tomelam@gmail.com'.

*/

/*
 * jsScheme 0.1-tae - initScheme.js
 *
 * The purpose of this file is to centralise the parts of the old
 * javascript-scheme that used to bind it up with scheme.html and the
 * DOM: the HTML code, the functions used as DOM event callbacks, and
 * code that changed the contents of the DOM for the purpose of
 * showing output, results, or trace output. Those parts have been
 * removed or placed inside conditional clauses so that they will not
 * be executed if the compatibility library defined below is not used.
 *
 * This file initialises jsScheme by calling its init function.
 * Though it is not strictly an initialisation matter, the connection
 * between user controls and jsScheme functions is also made here.
 * (Uses for jsScheme can be imagined that don't use such controls.)
 * To generalise jsScheme, a compatibility layer is created here to
 * allow jsScheme to be used with either jQuery or Dojo.  (Please
 * add compatibility for whatever JavaScript library you prefer.)
 */

// jslib is a simple compatibility library for the methods we need.
// It can be set anytime to use any JavaScript library for which a
// compatibility layer has been defined, or plain JavaScript.  If set
// to use plain JavaScript, some methods will not work or might cause
// problems due to browser problems.
//
// To set a callback to be executed when the DOM is ready to be traversed
// and manipulated:
//   jslib.addDomReadyCallback(/* function */ callback)
// To get the element with the given ID:
//   jslib.byId(/* string */ id)
// To connect a handler for a node, for a given type of event, to a callback:
//   jslib.connect(/* dom_node */ node, /* string */ eventType, /* function */ callback)
// To issue an Ajax GET request:
//   jslib.get(/* string */ url, /* function */ callback) // The callback should return the response.

// A compatibility layer for jQuery.
var jslib_jQuery = {
 addDomReadyCallback : function(/* function */ fn) { $(document).ready(fn) },
 byId : function(id) { return $("#" + id).get(0); },
 connect : function(node, eventType, callback) { $(node).bind(eventType, callback); },
 get : function(url, callback) { var resp;
				 $.ajaxSetup({
				       async:false
				       });
				 $.get(url, function(response, success) { resp = response; });
				 //console.debug("jslib_jQuery.get returned %s", resp);
				 return resp; },
 forEach : function(array, fun) { jQuery.each(array, function(i,val) { fun(val); }); }
}

// A compatibility layer for Dojo.
var jslib_Dojo = {
 addDomReadyCallback : function(callback) { dojo.addOnLoad(callback); },
 byId : function(id) { return dojo.byId(id); },
 connect : function(node, eventType, callback) { dojo.connect(node, eventType, callback); },
 get : function(url, /* unused */ callback) { var resp;
					      dojo.xhrGet({url:url,
						    sync:true,
						    load:function(response, ioArgs) { resp = response; },
						    error:function(response, ioArgs) { resp = response; }});
					      //console.debug("jslib_Dojo.get returning ", resp);
					      return resp; },
 forEach : function(array, fun) { dojo.forEach(array, fun); }
}

// A minimum compatibility layer when no JavaScript library is used, not fully implemented.
var jslib_no_JS_lib = {
 addDomReadyCallback : function() { },
 byId : function(/* string */ id) { return document.getElementById(id); },
 connect : function() { console.info("connect: no compatibility method for no-JS-lib demo"); },
 get : function() { console.info("get: no compatibility method for no-JS-lib demo"); },
 forEach : function() { }
}

// Set the JavaScript library type in the HTML file that loads this file.
if (jslib_type == "jquery") {
  var jslib = jslib_jQuery;
} else if (jslib_type == "dojo") {
  var jslib = jslib_Dojo;
} else {
  var jslib = jslib_no_JS_lib;
}

// Initialise jsScheme and connect it to the user controls in scheme_dojo.html,
// scheme_jquery.html, or scheme_no_jslib.html.
connectGUI = function() {
  var clickConnections = [
			  ["evalButton",
			   function() {
			      var values;
			      if (settings.print) {
				values = clickEval(jslib.byId("txt").value, jslib.byId("symbols"), "out");
				jslib.byId("time").innerHTML = "Elapsed: " + values.time + "s";
			      } else {
				values = clickEval(jslib.byId("txt").value);
				var result = values.result;
			      }
			    } ],
			  ["exampleButton", function() { loadSchemeFile("../scheme/example.scm"); } ],
			  ["concurrencyButton", function() { loadSchemeFile("../scheme/concurrency.scm"); } ],
			  ["libraryButton", function() { loadSchemeFile("../scheme/library.scm"); } ],
			  ["clearInputButton", function() { jslib.byId("txt").value = ""; } ],
			  ["clearLogButton", function() { jslib.byId("log").value = ""; } ]
			  ];
  jslib.forEach(clickConnections, function(cnxn) {
      jslib.connect(jslib.byId(cnxn[0]), "click", cnxn[1]);
    });
  var changeConnections = [
			   ["jit", function() { settings.echoInp = jslib.byId("jit").checked; } ],
			   ["echoInp", function() { settings.echoInp = jslib.byId("echoInp").checked; } ],
			   ["echoRes" , function() { settings.echoRes = jslib.byId("echoRes").checked; } ],
			   ["print", function() { settings.print = jslib.byId("print").checked; } ],
			   ["trace", function() { trace = jslib.byId("trace").checked; } ]
			   ];
  jslib.forEach(changeConnections, function(cnxn) {
      jslib.connect(jslib.byId(cnxn[0]), "change", cnxn[1]);
    });
  // The following event handler is meant to provide a convenience by
  // allowing the user to evaluate a set of properly formed
  // s-expressions by just pressing balancing left and right
  // parentheses and confirming she wants to evaluate the s-exps. It
  // is not perfect, but it can save the user time by making it
  // unnecessary to touch the mouse. Where parentheses are quoted, she
  // might have to press ESCAPE to reply in the negative to a
  // confirmation prompt.
  jslib.connect(jslib.byId("txt"), 
		"keypress",
		function(event) {
		  var key = event.charCode;
		  var txtElt = jslib.byId("txt");
		  var unbalancedLeftParens = 0;
		  jslib.forEach(txtElt.value,
			       function(char) { // Scan for balanced parentheses.
				 if (char == "(") {
				   unbalancedLeftParens += 1;
				 } else if (char == ")") {
				   unbalancedLeftParens -= 1;
				 }
			       });
		  if ((unbalancedLeftParens == 1) && (key == 41)) { // Test if last key balances the parens.
		    // Print the right paren so the user will see it
		    // during the prompt. Prevent the default action,
		    // which would be to put the character into the
		    // textarea anyway.
		    txtElt.value = txtElt.value + ")";
		    event.preventDefault();
		    if (confirm("Evaluate?")) {
		      if (settings.print) {
			values = clickEval(txtElt.value, jslib.byId("symbols"), "out");
			jslib.byId("time").innerHTML = "Elapsed: " + values.time + "s";
		      } else {
			values = clickEval(txtElt.value);
			var result = values.result;
		      }
		    }
		  }
		});
  //jslib.byId("txt").focus();
  init(jslib.byId("symbols"), "out", "log");
};

//jslib.addDomReadyCallback(connectGUI);
