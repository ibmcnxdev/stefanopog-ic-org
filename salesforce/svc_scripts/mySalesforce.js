function __salesforceDemo() {
    alert('hello Salesforce Demo !');
}

function __createOppy_stub() {
    alert('You clicked on the CREATE OPPORTUNITY action !');
}

function __showOppy_stub() {
    alert('You clicked on the SHOW OPPORTUNITY action !');
}

function __createOppy() {
    _getSFDCAccounts();
}

function _getSFDCAccounts() {
    var xmlHttpReq = false;
    if (window.XMLHttpRequest) {
        // Mozilla/Safari
        xmlHttpReq = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        // IE
        xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlHttpReq.open('GET',
        'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/543aba51314bff5bc7db871ec21796e77ad958439786c0a57a776b6943de6aac/NhnmNj/SFAccount/getAccountByIndustry?industry=Technology',
        true);
    xmlHttpReq.setRequestHeader('accept', 'application/json');
    xmlHttpReq.setRequestHeader('x-ibm-client-id', '954ca1f5-b101-402e-877b-82e3a6ab264f');
    xmlHttpReq.onreadystatechange = function () {
        if (xmlHttpReq.readyState == 4) {
            if ((xmlHttpReq.status == 200)) {
                __buildCreateOppyScreen(xmlHttpReq.responseText);
            } else {
                alert('Unfortunately there was an ERRROR ' + xmlHttpReq.status + ' / ' + xmlHttpReq.statusText);
            }
        }
    };
    xmlHttpReq.send();
}

function __buildCreateOppyScreen(myObjectStr) {
    var newStr = myObjectStr.replace(/\\\"/g, '"');
    newStr = newStr.replace(/\"\[/g, '\[');
    newStr = newStr.replace(/\]\"/g, '\]');
    var myObj = JSON.parse(newStr);  
    var items = myObj.Name.length;
    var _modal = document.createElement('div');
    _modal.classList.add('modal');

    var _modalContent = document.createElement('div');
    _modalContent.classList.add('modal-content');

    var _close = document.createElement('span');
    _close.classList.add('close');
    _close.innerHTML = '&times;';

    //
    //  This is the form to contain the values
    //
    var _table = document.createElement('table');
    _table.classList.add('theBorder');

    //
    //  Account Selector
    //
    var _tr1 = document.createElement('tr');
    var _td11 = document.createElement('td');
    _td11.appendChild(document.createTextNode('Account:'));

    var _td12 = document.createElement('td');
    var _select1 = document.createElement('select');
    for (var _i=0; _i < items; _i++) {
        let _option1 = document.createElement('option');
        _option1.value = myObj.Id[_i];
        _option1.label = myObj.Name[_i];
        //_option1.selected = true;
        _select1.appendChild(_option1);
    }
    _td12.appendChild(_select1);
    _tr1.appendChild(_td11);
    _tr1.appendChild(_td12);
    _table.appendChild(_tr1);
    //
    //  All the other inputs
    //
    _table.appendChild(_createTableLine('Opportunity Name', "_input2", "text"));
    _table.appendChild(_createTableLine('Description', "_input3", "text"));
    _table.appendChild(_createTableLine('Close Date', "_input4", "date"));
    _table.appendChild(_createTableLine('Amount', "_input5", "text"));
    _table.appendChild(_createTableLine('Probability', "_input6", "text"));


    var _m = document.createElement('p');
    _m.innerHTML = 'Prepare Salesforce Opportunity';
    _m.style['font-weight'] = 'bold';
    _m.style['align'] = 'center';

    var __table2 = document.createElement('table');
    __table2.classList.add('theBorder');
    var __line = document.createElement('tr');
    var __left = document.createElement('td');
    __left.style['vertical-align'] =  'middle';
    var __img = document.createElement('img');
    __img.src = "/files/customizer/salesforce/salesforce_big.png";
    __img.width = 200;
    __img.height = 100;
    __left.appendChild(__img);
    var __right = document.createElement('td');
    __right.appendChild(_table);
    __line.appendChild(__left);
    __line.appendChild(__right);
    __table2.appendChild(__line);
 
    var _button1 = document.createElement("input");
    _button1.setAttribute('type', 'button');
    _button1.setAttribute('name', '_btn1');
    _button1.setAttribute('value', 'Submit');
    _button1.addEventListener("click", function(){
        //
        //  Build the Message
        //
        var theMsg = {};
        //
        //  Opportunity INFOS
        //
        theMsg.accountID   = _select1.value; //"0011r00001laoCN";
        theMsg.name        = document.getElementById('_input2').value;
        theMsg.description = document.getElementById('_input3').value;
        let __a = new Date(document.getElementById('dijit_form_DateTextBox_0').value);  //"2021-02-01T01:12:41.460Z"
        theMsg.closeDate   = dojo.date.stamp.toISOString(__a, {selector: 'date'});
        theMsg.amount      = document.getElementById('_input5').value;
        theMsg.probability = document.getElementById('_input6').value;
        //
        //  user
        //
        theMsg.userid      = window.user.id;
        //
        //  Go with HTTP
        //
        _sendCreateOppy('https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/543aba51314bff5bc7db871ec21796e77ad958439786c0a57a776b6943de6aac/FZS70E/OppyInput/createoppy', 
                        theMsg);
    });
    
    _modalContent.appendChild(_close);
    _modalContent.appendChild(_m);
    _modalContent.appendChild(document.createElement('hr'));
    _modalContent.appendChild(__table2);
    _modalContent.appendChild(document.createElement('br'));
    _modalContent.appendChild(document.createElement('br'));
    _modalContent.appendChild(_button1);
    _modal.appendChild(_modalContent);
    document.body.appendChild(_modal);

    _modal.style.display = "block";
    //
    // When the user clicks on <span> (x), close the modal
    //
    _close.onclick = function() {
        _modal.style.display = "none";
    };
    //
    // When the user clicks anywhere outside of the modal, close it
    //
    window.onclick = function(event) {
        if (event.target == _modal) {
            _modal.style.display = "none";
        }
    };
}

function _sendCreateOppy(finalURL, data) {
    var xmlHttpReq = false;
    if (window.XMLHttpRequest) {
        // Mozilla/Safari
        xmlHttpReq = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        // IE
        xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlHttpReq.open('POST', finalURL, true);
    xmlHttpReq.setRequestHeader('accept', 'application/json');
    xmlHttpReq.setRequestHeader('Content-Type', 'application/json');
    xmlHttpReq.setRequestHeader('x-ibm-client-id', '7357e331-fd9b-4e10-adf0-5ceccca35cbc');
    xmlHttpReq.onreadystatechange = function() {
        if (xmlHttpReq.readyState == 4) {
            if ((xmlHttpReq.status == 200)) {
                alert('Opportunity Successfully created and added to IBM Connections! ');
            } else {
                alert('Unfortunately there was an ERRROR ' + xmlHttpReq.status + ' / ' +  xmlHttpReq.statusText);
            }
        }
    };
    xmlHttpReq.send(JSON.stringify(data));
}

function _createTableLine(label, name, inputType) {
    var _tr2 = document.createElement('tr');
    var _td21 = document.createElement('td');
    _td21.appendChild(document.createTextNode(label + ':'));
    var _td22 = document.createElement('td');
    //
    //  If inputType is DATE, then we need to provide the Dojo Datepicker control
    //  to grant it will be cross-browser
    //
    if (inputType === "date") {
        let _div = document.createElement('div');
        _td22.appendChild(_div);
        let _input2  = new dijit.form.DateTextBox({constraints: {datePattern: "yyyy-MM-dd"}}, _div);
        _input2.set('value', new Date());
        dojo.addClass(_input2.domNode, 'sfdc_demo');
    } else {
        var _input2 = document.createElement("input");
        _input2.setAttribute('type', 'text');
        _input2.setAttribute('name', name);
        _input2.setAttribute('id', name);
        _td22.appendChild(_input2);
    }
    _tr2.appendChild(_td21);
    _tr2.appendChild(_td22);
    return _tr2;
}
function _changeWindow(ref) {
    window.open(ref, "_blank");
}
function _captureEvent (target) {
    if (target.id.startsWith('ic-tile:urn:lsid:lconn.ibm.com:activitystreams.story:')) {
        //
        //  search the .ic-title element in the tile
        //
        var _title = dojo.query('a.ic-title', target)[0];
        //
        //  get the HREF
        //
        var _href =  _title.href;
        //
        //  this script can be invoked several times (once per bubble that references it)
        //  thus the modification could be applied several times, and we do not want this.
        //  thus we escape if the modfication was already performed
        //
        if (_title.href.startsWith('javascript')) {
            //
            //  modification already done. Do not do anything
            //
        } else {
            //
            //  replace the href
            //
            _title.href = "javascript:_changeWindow('" + _href + "')";         
            //
            //  Find the summary and highlight it
            //
            var myChild = dojo.query('.ic-summary.ic-summary-article', target)[0];
            //
            //  Change color on mouseover to simulate the same behavior of the relevant event in the classic ActivityStream
            //
            myChild.addEventListener('mouseover', function(evt) {
                myChild.style['background-color'] = 'rgb(233, 241, 233)';
            }, true);
            myChild.addEventListener('mouseout', function(evt) {
                myChild.style['background-color'] = 'unset';
            }, true);
            //
            //  Add eventListener to the Child to simulate EmbeddedExperience
            //
            myChild.firstChild.addEventListener('click', function (e) {
                //
                //  Stop ballooning of events
                //
                e.stopImmediatePropagation();
                //
                //  Retrieve the story
                //
                var __tmp = target.id.split(':');
                var _story = __tmp[__tmp.length-1];
                //
                //  Now retrieve the story from the ActivityStream
                //
                var xmlHttpReq = false;
                if (window.XMLHttpRequest) {
                    // Mozilla/Safari
                    xmlHttpReq = new XMLHttpRequest();
                } else if (window.ActiveXObject) {
                    // IE
                    xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xmlHttpReq.open('GET', '/connections/opensocial/basic/rest/activitystreams/@me/@all/@all/' + _story, true);
                xmlHttpReq.setRequestHeader('Content-Type', 'application/json');
                xmlHttpReq.onreadystatechange = function() {
                    if (xmlHttpReq.readyState == 4) {
                        if ((xmlHttpReq.status == 200)) {
                            //
                            //  We got the answer
                            //  Get the CONTEXT object
                            //
                            var __tmp2 = JSON.parse(xmlHttpReq.responseText);
                            var _context = __tmp2.entry.openSocial.embed.context;
                            //
                            //  create the iFrame to load the salesforce.html page
                            //
                            var _iframe = document.createElement('iframe');
                            _iframe.classList.add('modal-content');
                            _iframe.src = _context.url;  // Retrieving Embedded Experience from CONTEXT Object
                            _iframe.style.height="400px";
                            //
                            //  When the iFrame will load, pass the CONTEXT object
                            //
                            _iframe.onload = function () {
                                let newCtx = {};
                                newCtx.source = {};
                                newCtx.source.resourceContext = _context;
                                _iframe.contentWindow.postMessage(JSON.stringify(newCtx), '*');
                            };
                            //
                            //  create the Modal Window and append the iFrame
                            //
                            var _modal = document.createElement('div');
                            _modal.classList.add('modal');
                            _modal.classList.add('sfdc_modal');
                            _modal.appendChild(_iframe);
                            _modal.style.display = "block";
                            _modal.style['padding-top'] = "200px";
                            _modal.style['padding-left'] = "200px";
                            //
                            //  When the user clicks anywhere outside of the modal, close it
                            //
                            window.onclick = function (event) {
                                if (event.target == _modal) {
                                    _modal.style.display = "none";
                                    _modal = null;
                                }
                            };
                            //
                            //  go with the MODAL
                            //
                            document.body.appendChild(_modal);
                        } else {
                            alert('ERRROR ' + xmlHttpReq.status + ' / ' + xmlHttpReq.statusText);
                        }
                    }
                };
                //
                //  Send the XHR event
                //
                xmlHttpReq.send();
            }, true);  
        }
    }
}

if (typeof (dojo) != "undefined") {
    require(["dojo/domReady!"], function () {
        //
        //  Get the existing TILES in the OrientMe page
        //  These are the TILES that already exist on the page
        //
        let _tiles = dojo.query('article.ic-stack-tile.ic-tile-sfdc_oppy.ic-is-post');
        //
        //  For each TILE, associate an eventListener on the SUMMARY so that they properly
        //  simulate the EmbeddedExperience
        //
        for (let _i = 0; _i < _tiles.length; _i++) {
           _captureEvent(_tiles[_i]);
        }
        //
        //  Now we want to perform the same operation as the above when the user
        //  changes TAB within the OrientMe page
        //  So we need to capture the DOMNodeInserted event
        //
        require(
            ['dojo/on', 'dojo/_base/window', 'dojo/query'],
            //
            //  We want to capture when each TILE actually gets filled with the HTML elements 
            //  that constitute its content 
            //
            function (on, win) {
                on(win.doc,
                    'article.ic-tile.ic-tile-sfdc_oppy.ic-is-post:DOMNodeInserted', 
                    function(evt) {
                        //
                        //  We associate an eventListener on the SUMMARY so that they properly
                        //  simulate the EmbeddedExperience
                        //
                        _captureEvent(evt.target);
                    }
                );
                /*
                on(win.doc,
                    'article.ic-stack-tile.ic-tile-sfdc_oppy.ic-is-post:DOMNodeInserted', 
                    function(evt) {alert('toto'); _captureEvent(evt.target);}
                );
                */
                on(win.doc,
                    'section.ic-tile.ic-tile-sfdc_oppy.ic-stack.ic-single-stack:DOMNodeInserted', 
                    function(evt) {
                        //
                        //  We associate an eventListener on the SUMMARY so that they properly
                        //  simulate the EmbeddedExperience
                        //
                        _captureEvent(dojo.query('article', evt.target)[0]);
                    }
                );
            });
    });
    //
    //  This adds the Dojo DatePicker to the script so that it can be used by the code when it needs
    //
    require(["dojo/parser", "dijit/form/DateTextBox"]);
}
