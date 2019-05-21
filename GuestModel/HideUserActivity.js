/*
 * © Copyright IBM Corp. 2017
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at:
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 
 * implied. See the License for the specific language governing 
 * permissions and limitations under the License.
 */
//
//  Utility to validate if a given user can be shown as the author of a comment/like/download
//
function __HideUserActivity_UserDetails() {
    var n      = this;  //  for the closure....
    this.cache = [];

    this.profilesArgs = {
        url: __cBill_connectionsServer + "/profiles/atom/profile.do",
        handleAs: "xml",
        preventCache: false,
        sync: false,
        //user:      NO Need since same Domain,
        //password:  NO Need since same Domain,
        content: { userid: null }
    };

    this.userIsInCache = function (uuid) {
        for (var i = 0; i < this.cache.length; i++) {
            if (this.cache[i].uuid === uuid) return i;
        }
        return -1;
    }

    this.userCanShow = function (uuid) {
        var j = this.userIsInCache(uuid);
        if (j >= 0) return this.cache[j].canShow;
        return false;
    }

    this.userHasEmail = function (uuid) {
        var j = this.userIsInCache(uuid);
        if (j >= 0) return this.cache[j].email;
        return null;
    }

    this.addUserToCache = function (uuid, email, canShow) {
        var tmp = {
            uuid:  uuid,
            email: email,
            canShow: canShow
        }
        this.cache.push(tmp);
    }

    this.hideUser = function (label, uuid, element) {
        //
        //  This is the place in which you can customize the list of people whose details should not be visible to others
        //
        function checkEmailAddress(email) {
            if ((email === 'fadams@spogliani.ibmcollab.com') || (email === 'hreeds@spogliani.ibmcollab.com')) {
                return true;
            } else {
                return false;
            }
        }
        //
        //  Hides the element representing the user to be hidden
        //
        function hideTheUser(label, email, element) {
            dojo.setStyle(element, 'display', 'none');
            __cBill_logger(label + '_UserDetails: Element corresponding to user ' + email + ' has been hidden');
        }
        //
        //  Processing....
        //
        if (this.userIsInCache(uuid) <= 0) {
            __cBill_logger(label + '_UserDetails: user ' + uuid + ' has NOT been found in the cache. Going to fetch its profile !');
            //
            //  User is NOT in cache. Needs to be retrieved
            //
            this.profilesArgs.content.userid = uuid;
            var deferred = dojo.xhrGet(this.profilesArgs);
            deferred.then(
                function (data) {
                    __cBill_logger(label + '_UserDetails: Profile for user ' + uuid + ' has been fetched... processing it...');
                    try {
                        var feed = new dojox.atom.io.model.Feed();
                        feed.buildFromDom(data.documentElement);
                        if (feed.entries && feed.entries[0] && feed.entries[0].contributors && feed.entries[0].contributors[0]) {
                            //
                            //  Get the mail address of the user who downloaded/viewed the file
                            //
                            let email = feed.entries[0].contributors[0].email;
                            //
                            //  store the userdata in the Cache
                            //
                            let isBlacklisted = checkEmailAddress(email);
                            //
                            //  Add the user to the cache
                            //
                            n.addUserToCache(uuid, email, !isBlacklisted);
                            if (isBlacklisted) { 
                                //
                                //  User cannot be shown.
                                //  Hiding the element corresponding to the user
                                //
                                hideTheUser(label, email, element);
                            } else {
                                __cBill_logger(label + '_UserDetails: User ' + email + ' can be shown ! Nothing more to do.');
                            }
                        } else {
                            alert(label + "_UserDetails: error in deferred.then : User " + uuid + ' not found !!');
                        }
                    } catch (ex) {
                        alert(label + "_UserDetails: error in deferred.then : " + ex);
                    }
                },
                function (error) {
                    alert(label + "_UserDetails: An unexpected error occurred in xhr(" + uuid + "): " + error);
                }
            );
        } else {
            //
            //  Information about the user has already been retrieved. It is in the cache
            //
            __cBill_logger(label + ': user ' + this.userHasEmail(uuid) + ' has already been cached !');
            if (this.userCanShow(uuid)) {
                //
                //  User can be seen... Nothing to do
                //
                __cBill_logger(label + '_UserDetails: user ' + this.userHasEmail(uuid) + ' can be shown ! Nothing more to do.');
            } else {
                //
                //  User has been already checked and cannot be shown.
                //  So we hide it
                //
                hideTheUser(label, this.userHasEmail(uuid), element);
            }
        }
    }
}   
//
//  Main Function
//
function __HideUserActivity() {
    //
    //  Regexp for a File-Preview page of a standalone file
    //  Please note the "alternative" bewteen "app" and "app#" inside the regexp
    //
    __cBill_logger('__HideUserActivity : kicking off...');
    let dojoNoFileDownloadHistory = new __cBill_waitForDojo('__HideUserActivity');
    //
    //  There are some pages which load Dojo very lazily.
    //  So we need to wait until Dojo is fully loaded before testing and using it
    //
    dojoNoFileDownloadHistory.do(function () {
        __cBill_logger('__HideUserActivity : Dojo is defined - starting!');
        try {
            //
            //  We require the Dojo modules that help us to transform an XML feed into a JSON document
            //
            dojo.require("dojox.atom.io.model");
            //
            //  get the About Button
            //
            let waitForAboutBtn = new __cBill_waitById('__HideUserActivity');
            console.log('stefano');
            console.log(dojo.byId('about'));
            waitForAboutBtn.do(
                function(aboutBtn) {
                    alert('about clicked');
                    //
                    //  This is the real trick that makes the whole working
                    //  The Dojo ON module allows us to declare eventHandlers associated to classes. 
                    //  See https://dojotoolkit.org/reference-guide/1.10/dojo/on.html
                    //
                    require(
                        ['dojo/on', 'dojo/_base/window', 'dojo/query'],
                        //
                        //  We want to capture when the container of the user records (for Likes, Comments, Downloads...)
                        //  actually gets filled with the HTML elements that contain the information for the users
                        //  who are liking, commenting, downloading...
                        //
                        function (on, win) {
                            __cBill_logger('__HideUserActivity: declaring ON handler...');
                            on(win.doc,
                                '.panelContent.streamContent.bidiAware:DOMNodeInserted', //'.ics-viewer-user-count-widget:DOMNodeInserted', 
                                function (evt) {
                                    __cBill_logger('__HideUserActivity: Inside ON handler...');
                                    //
                                    //  When an HTML element is inserted...
                                    //
                                    var thisElement = evt.target;
                                    //
                                    //  ...we search the <span class="x-lconn-userid"> children of that element
                                    //
                                    var myChild = dojo.query('span.x-lconn-userid', thisElement);
                                    if (myChild.length > 0) {
                                        let downloadParent = myChild.closest('.ics-viewer-user-count-widget[data-dojo-attach-point="downloadsContainer"]');
                                        if (downloadParent.length > 0) {
                                            //
                                            //  If a child is found, then it contains the "userid" attribute of
                                            //  the record that is shown in the page
                                            //
                                            __cBill_logger('__HideUserActivity: going to get infos for user ' + myChild[0].innerHTML);
                                            //
                                            //  We can delegate to the hideUser method of the blackList object (which has 
                                            //  been instatiated withing commonTools.js) the task of hiding that record
                                            //  (if required)
                                            //
                                            __HideUserActivity_blackList.hideUser('__HideUserActivity', myChild[0].innerHTML, thisElement);
                                        } else {
                                            __cBill_logger('__HideUserActivity: user ' + myChild[0].innerHTML + ' is not in Download... forgetting it....');
                                        }
                                    }
                                });
                        }
                    );
            }, 'about');
            /*
            //
            //  Thess statements were the original choice of completely hiding the list of users who downloaded
            //  a given file
            //
            dojo.place(
                '<style>' +
                    '.ics-viewer-user-count-widget[data-dojo-attach-point="downloadsContainer"] .content.bidiAware { display: none } !important' +
                '</style>', dojo.body(),"first"); 
            __cBill_logger('__HideUserActivity: ics-viewer-user-count-widget class style change to noDisplay');
            */
            __cBill_logger('__HideUserActivity : finish');
        } catch (ex) {
            alert("__HideUserActivity error: MAIN: " + ex);
        }
    });
}
//
//  This code allows the script to be invoked when you access a File Preview from a reference to it which is posted in a different Connections Page
//  We observe the dynamic change of the BODY element and, in case a change in document.location is found, it invokes the script related to
//  the Files Preview page
//
var __HideUserActivity_blackList = new __HideUserActivity_UserDetails();
//
//  We execute this code in case we land on the page in the canonical way
//
alert('in VIEWER with URL ' + document.location.pathname);
alert(JSON.stringify(document.location, ' ', 2));
__HideUserActivity();
