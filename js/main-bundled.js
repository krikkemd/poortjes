!function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=2)}([function(t,e,r){t.exports=r(3)},function(t,e){function r(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}t.exports=function(t){return function(){var e=this,n=arguments;return new Promise((function(o,i){var a=t.apply(e,n);function c(t){r(a,o,i,c,u,"next",t)}function u(t){r(a,o,i,c,u,"throw",t)}c(void 0)}))}}},function(t,e,r){"use strict";r.r(e);var n=r(0),o=r.n(n),i=r(1),a=r.n(i),c=["events.json","ncGZ.json","ncRZ.json"],u=[],l=[],s=[],f=[];function h(){return(h=a()(o.a.mark((function t(){var e,r,n,i;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,d(c[0]);case 2:return t.sent,t.next=5,d(c[1]);case 5:return t.next=7,d(c[2]);case 7:e=u[0],r=u[1],n=u[2],i=r.concat(n),v(e),p(i),y(l,s),m(f),g(f);case 16:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function d(t){return new Promise((function(e,r){fetch(t).then((function(t){return t.json().then((function(t){return u.push(t.data),e("dit is voor reference, zo werkt die return")}))}))}))}function v(t){var e;t.forEach((function(t){var r=t.id,n=t.locations[0].name,o=t.defaultschedulestarttime,i=t.defaultscheduleendtime;"grote zaal"!=n.toLowerCase()&&"rabo zaal"!=n.toLowerCase()||(e={eventid:r,locatie:n,start:o,eind:i},l.push(e))})),l.sort(w)}function p(t){var e;t.forEach((function(t){var r,n,o=t.event.id,i=t.items[0].children[0].value,a=t.items[0].children[1].value,c=t.items[2].children,u=t.items[4].children[1].value;null!==t.items[3].value&&(r=t.items[3].value.contact.name),null!==t.items[1].value&&(n=t.items[1].value.originalname),e={eventid:o,titel:i,artiest:a,kleedkamers:c,pauze:u,vber:r,afb:n},s.push(e)})),s.sort(w)}function y(t,e){var r=new Date,n=["January","February","March","April","May","June","July","August","September","October","November","December"];t.forEach((function(o,i){if(o.eventid==t[i].eventid){var a={eventid:t[i].eventid,locatie:t[i].locatie,titel:e[i].titel,artiest:e[i].artiest,start:t[i].start,ncstart:new Date("".concat(n[r.getMonth()]," ").concat(r.getDate(),", ").concat(r.getFullYear()," ").concat(o.start)).valueOf()/36e5-3,nceind:new Date("".concat(n[r.getMonth()]," ").concat(r.getDate(),", ").concat(r.getFullYear()," ").concat(o.eind)).valueOf()/36e5-.25,pauze:e[i].pauze,eind:t[i].eind,vber:e[i].vber,kleedkamers:e[i].kleedkamers,afb:e[i].afb};e[i].afb&&f.push(a)}})),f.sort(b),f.sort(L)}function m(t,e){var r=(new Date).getTime()/36e5;console.log("".concat((new Date).getHours(),":").concat((new Date).getMinutes(),":").concat((new Date).getSeconds())),t.forEach((function(e,n){r>=e.ncstart&&(console.log("Start de Narrowcasting voor Artiest: ".concat(e.artiest," Voorstelling: ").concat(e.titel)),t.length&&(document.querySelector(".container").classList.add("container--visible"),document.querySelector(".closed").classList.remove("closed--visible"))),r>=e.nceind&&(console.log("Stop de Narrowcasting voor Artiest: ".concat(e.artiest," Voorstelling: ").concat(e.titel)),t.splice(e[n],1))})),t.length||(console.log(t.length),document.querySelector(".container").classList.remove("container--visible"),document.querySelector(".closed").classList.add("closed--visible"),clearInterval(e))}function g(t){var e,r=-1,n=document.querySelector(".titel"),o=document.querySelector(".artiest"),i=document.querySelector(".img"),a=document.querySelector(".locatie"),c=document.querySelector(".start"),u=document.querySelector(".pauze"),l=document.querySelector(".einde");console.log(t.length),e=setInterval((function(){m(t,e),r<t.length-1?(r++,n.innerHTML=t[r].titel,o.innerHTML=t[r].artiest,i.src="./afbeeldingen/".concat(t[r].afb),a.innerHTML=t[r].locatie,c.innerHTML=t[r].start,l.innerHTML=t[r].eind,null==t[r].pauze?u.innerHTML="-":u.innerHTML=t[r].pauze):r=-1}),3e3)}function w(t,e){return t.eventid<e.eventid?-1:t.eventid>e.eventid?1:0}function b(t,e){return t.ncstart<e.ncstart?-1:t.ncstart>e.ncstart?1:0}function L(t,e){return t.locatie<e.locatie?-1:t.locatie>e.locatie?1:0}!function(){h.apply(this,arguments)}(),setTimeout((function(){return location.reload()}),144e5)},function(t,e,r){var n=function(t){"use strict";var e=Object.prototype,r=e.hasOwnProperty,n="function"==typeof Symbol?Symbol:{},o=n.iterator||"@@iterator",i=n.asyncIterator||"@@asyncIterator",a=n.toStringTag||"@@toStringTag";function c(t,e,r,n){var o=e&&e.prototype instanceof s?e:s,i=Object.create(o.prototype),a=new x(n||[]);return i._invoke=function(t,e,r){var n="suspendedStart";return function(o,i){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw i;return E()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=w(a,r);if(c){if(c===l)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var s=u(t,e,r);if("normal"===s.type){if(n=r.done?"completed":"suspendedYield",s.arg===l)continue;return{value:s.arg,done:r.done}}"throw"===s.type&&(n="completed",r.method="throw",r.arg=s.arg)}}}(t,r,a),i}function u(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}t.wrap=c;var l={};function s(){}function f(){}function h(){}var d={};d[o]=function(){return this};var v=Object.getPrototypeOf,p=v&&v(v(S([])));p&&p!==e&&r.call(p,o)&&(d=p);var y=h.prototype=s.prototype=Object.create(d);function m(t){["next","throw","return"].forEach((function(e){t[e]=function(t){return this._invoke(e,t)}}))}function g(t,e){var n;this._invoke=function(o,i){function a(){return new e((function(n,a){!function n(o,i,a,c){var l=u(t[o],t,i);if("throw"!==l.type){var s=l.arg,f=s.value;return f&&"object"==typeof f&&r.call(f,"__await")?e.resolve(f.__await).then((function(t){n("next",t,a,c)}),(function(t){n("throw",t,a,c)})):e.resolve(f).then((function(t){s.value=t,a(s)}),(function(t){return n("throw",t,a,c)}))}c(l.arg)}(o,i,n,a)}))}return n=n?n.then(a,a):a()}}function w(t,e){var r=t.iterator[e.method];if(void 0===r){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,w(t,e),"throw"===e.method))return l;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return l}var n=u(r,t.iterator,e.arg);if("throw"===n.type)return e.method="throw",e.arg=n.arg,e.delegate=null,l;var o=n.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,l):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,l)}function b(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function L(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function x(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(b,this),this.reset(!0)}function S(t){if(t){var e=t[o];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,i=function e(){for(;++n<t.length;)if(r.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return i.next=i}}return{next:E}}function E(){return{value:void 0,done:!0}}return f.prototype=y.constructor=h,h.constructor=f,h[a]=f.displayName="GeneratorFunction",t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===f||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,h):(t.__proto__=h,a in t||(t[a]="GeneratorFunction")),t.prototype=Object.create(y),t},t.awrap=function(t){return{__await:t}},m(g.prototype),g.prototype[i]=function(){return this},t.AsyncIterator=g,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new g(c(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},m(y),y[a]="Generator",y[o]=function(){return this},y.toString=function(){return"[object Generator]"},t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=S,x.prototype={constructor:x,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(L),!t)for(var e in this)"t"===e.charAt(0)&&r.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(r,n){return a.type="throw",a.arg=t,e.next=r,n&&(e.method="next",e.arg=void 0),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var c=r.call(i,"catchLoc"),u=r.call(i,"finallyLoc");if(c&&u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,l):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),l},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),L(r),l}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;L(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:S(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=void 0),l}},t}(t.exports);try{regeneratorRuntime=n}catch(t){Function("r","regeneratorRuntime = r")(n)}}]);