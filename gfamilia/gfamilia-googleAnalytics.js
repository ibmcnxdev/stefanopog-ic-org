////
// @author Tony McGuckin, IBM
// @name Profiles Customization
// @version 0.1
// @date February, 2017
//

//if (typeof (dojo) != "undefined") {
//    console.log('WOW WOW WOW');
//    dojo.place(
        /*"<script async src=\"https://www.googletagmanager.com/gtag/js?id=UA-54969817-4\"></script>",*/
//        "<script async src=\"https://www.googletagmanager.com/gtag/js?id=UA-54969817-4\"></script><script>alert('tefano');window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-54969817-4');</script>", 
//        dojo.doc.head,
//        "last"
//    );    

//    alert('stefano 2');
//    window.dataLayer = window.dataLayer || [];
//    function gtag(){dataLayer.push(arguments);}
//    gtag('js', new Date());
  
//    gtag('config', 'UA-54969817-4');
    
//  }

/*

"<script async src=\"https://www.googletagmanager.com/gtag/js?id=UA-54969817-4\"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-54969817-4');</script>"
*/

(function(d, script) {
    script = d.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = function(){
        // remote script has loaded
    };
    script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-109834396-1';
    d.getElementsByTagName('head')[0].appendChild(script);
}(document));

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'UA-109834396-1');
