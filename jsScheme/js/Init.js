// initZen.js - Initialisation of Zen
// Copyright (C) 2009  Tom Elam

dojo.provide("zen.Init");

speakUp = function() { alert('speaking!'); }

var writeString = "";
var s = [];
var sCount = 0;
write = function(str) {
  sCount += 1;
  s[sCount] = str;
  if (sCount >= 51) {
    sCount = 0;
    for (var i = 0; i++; i<52) {
      s[sCount] = s[sCount+1];
    }
  }
  for (var i = 0; i++; i<52) {
    writeString += s[i];
  }
  dojo.byId('writeArea').value = writeString;
}
  
cleanUpWritearea = function() {
  dojo.byId('writeArea').value = "";
}
    
// Initialise jsScheme and connect it to the user controls in zenHTML.html.
// Set some CSS styles.
initZen = function() {
    var clickConnections = [
	["evalButton",
	 function() {
	     var values;
	     if (settings.print) {
		 values = clickEval(dojo.byId("txt").value, dojo.byId("symbols"), "out");
		 dojo.byId("time").innerHTML = "Elapsed: " + values.time + "s";
	     } else {
		 values = clickEval(dojo.byId("txt").value);
		 var result = values.result;
	     }
	 } ],
	["exampleButton", function() { loadSchemeFile("jsScheme/scheme/example.scm"); } ],
	["concurrencyButton", function() { loadSchemeFile("jsScheme/scheme/concurrency.scm"); } ],
	["libraryButton", function() { loadSchemeFile("jsScheme/scheme/library.scm"); } ],
	["clearInputButton", function() { dojo.byId("txt").value = ""; } ],
	["clearLogButton", function() { dojo.byId("log").value = ""; } ],
	["configButton", function() { loadSchemeFile("conf/default.scm"); } ],
	["clearInsertionsButton", function() { dojo.byId("workingNode").innerHTML = ""; } ], //FIXME: Must do more.
	["setLoadFileButton", function() { loadSchemeFile(dojo.byId("loadFile").value); } ]
    ];
    dojo.forEach(clickConnections, function(cnxn) {
	dojo.connect(dojo.byId(cnxn[0]), "click", cnxn[1]);
    });
    var changeConnections = [
	["jit", function() { settings.echoInp = dojo.byId("jit").checked; } ],
	["echoInp", function() { settings.echoInp = dojo.byId("echoInp").checked; } ],
	["echoRes" , function() { settings.echoRes = dojo.byId("echoRes").checked; } ],
	["print", function() { settings.print = dojo.byId("print").checked; } ],
	["trace", function() { trace = dojo.byId("trace").checked; } ]
    ];
    dojo.forEach(changeConnections, function(cnxn) {
	dojo.connect(dojo.byId(cnxn[0]), "change", cnxn[1]);
    });
    //dojo.byId("txt").focus();
    //dojo.style("toggleInfo", "position", "absolute");
    //dojo.style("toggleInfo", "top", "" + (dijit.getViewport().h-60) + "px");
    dojo.style("zenBorder", "border", "");
    //dojo.style(dojo.query(".firebug")[0], "display", "none"); //FIXME: Why necessary?
    init(dojo.byId("symbols"), "out", "log");
    //dojo.addOnLoad(function() {	dojo.forEach(zen1.schemeFiles, evalSchemeFile); });
    dojo.forEach(zen1.schemeFiles, evalSchemeFile);
    zen1.canvasNode = dojo.byId('workingNode');
};

// A compatibility layer to adapt jsScheme to Dojo.
var jslib = {
    addDomReadyCallback : function(callback) { dojo.addOnLoad(callback); },
    byId : function(id) { return dojo.byId(id); },
    connect : function(node, eventType, callback) { dojo.connect(node, eventType, callback); },
    asyncGet : function(url, /* unused */ callback) { var resp;
						      dojo.xhrGet({url:url,
								   sync:false,
								   load:function(response, ioArgs) { resp = response; callback(resp); },
								   error:function(response, ioArgs) { resp = response; }});
						      return resp; },
    syncGet : function(url, /* unused */ callback) { var resp;
						     dojo.xhrGet({url:url,
								  sync:true,
								  load:function(response, ioArgs) { resp = response; callback(resp); },
								  error:function(response, ioArgs) { resp = response; }});
						     return resp; },
    forEach : function(array, fun) { dojo.forEach(array, fun); }
};
