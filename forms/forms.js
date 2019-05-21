var dojoFormsSample = new __cBill_waitForDojo('formsSample');
var alreadyDone = false;
dojoFormsSample.do(function () {
    //
    //  Check if there are iFrames
    //
    let iFramesInPage = new __cBill_waitByQuery('formsSample');
    iFramesInPage.do(function(listOfiFrames) {
        if (listOfiFrames) {
            listOfiFrames[0].addEventListener('load', function () {
                //alert('toto');
                //console.log('TOTOTOTOTOTOTOT');
                dojo.setContext(listOfiFrames[0].contentWindow.window, listOfiFrames[0].contentWindow.window.document);
                let formFooter = new __cBill_waitByQuery('formsSample');
                formFooter.do(function () { 
                    //alert('stefano');
                    if (! alreadyDone) {
                        alreadyDone = true;
                        dojo.place(
                            '<span id="printPDF" class="dijit dijitReset dijitInline dijitButton lfFormBtn lotusFormButton lfFormActionBtn lfFormActionSubmitBtn" role="presentation" >' +
                            '<span class="dijitReset dijitInline dijitButtonNode" onClick="window.print()" role="presentation">' +
                            '<span class="dijitReset dijitStretch dijitButtonContents" data-dojo-attach-point="titleNode,focusNode" role="button" tabindex="0" id="1111111" title="" style="-webkit-user-select: none;">' +
                            '<span class="dijitReset dijitInline dijitIcon dijitNoIcon" data-dojo-attach-point="iconNode">' +
                            '</span>' +
                            '<span class="dijitReset dijitToggleButtonIconChar">●</span>' +
                            '<span class="dijitReset dijitInline dijitButtonText" id="22222222_label" data-dojo-attach-point="containerNode">Print PDF</span>' +
                            '</span>' +
                            '</span>' +
                            '<input type="button" value="" class="dijitOffScreen" onClick="window.print()" tabindex="-1" role="presentation" aria-hidden="true" data-dojo-attach-point="valueNode"></span>',
                            dojo.query("div.form-button-box-wrapper")[0], "append");
                    }
                }, '.lfFormFooter', 100, 200);
            }, false);
        }
    }, 'iframe', 100, 200);
});
