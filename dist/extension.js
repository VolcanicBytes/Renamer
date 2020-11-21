module.exports=function(e){var t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(i,r,function(t){return e[t]}.bind(null,r));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t){e.exports=require("vscode")},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=n(0),r=n(9);t.Settings=class{static Initialize(){this.Reload()}static Reload(){this.Enabled=this.getEnabledPref(),this.BlackList=this.getBlackListPref(),this.RegexList=this.getRegexListPref(),this.ForceRegex=this.getForceRegexPref()}static Subscribe(e){return i.workspace.onDidChangeConfiguration(e=>{e.affectsConfiguration(r.Constants.ExtensionName)&&this.Reload()})}static getEnabledPref(){return i.workspace.getConfiguration(r.Constants.ExtensionName).get("enabled",!0)}static getForceRegexPref(){return i.workspace.getConfiguration(r.Constants.ExtensionName).get("forceRegex",!1)}static getBlackListPref(){return i.workspace.getConfiguration(r.Constants.ExtensionName).get("ignoredLanguageIdList",new Array)}static getRegexListPref(){const e=i.workspace.getConfiguration(r.Constants.ExtensionName).get("regexList");let t=new Array;if(e)try{t=e}catch(e){i.window.showErrorMessage("Unable to parse the regexList:  "+e)}return t}}},function(e,t,n){"use strict";var i=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))((function(r,o){function c(e){try{s(i.next(e))}catch(e){o(e)}}function a(e){try{s(i.throw(e))}catch(e){o(e)}}function s(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(c,a)}s((i=i.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const r=n(0),o=n(8),c=n(1);t.DocumentTokenizer=class{static recursiveTokenize(e,t){for(let n=0;n<e.length;n++){const i=e[n];if(i.kind==r.SymbolKind.Namespace)this.recursiveTokenize(i.children,t);else{const e=new o.DocumentChangeItem(i.kind,i.selectionRange,i.name);t.push(e)}}}static tokenizeCurrentDocument(){return i(this,void 0,void 0,(function*(){const e=new Array,t=r.window.activeTextEditor;if(!t)return e;const n=c.Settings.ForceRegex?void 0:yield r.commands.executeCommand("vscode.executeDocumentSymbolProvider",t.document.uri);if(!n)return this.tokenizeWithRegex(t.document);for(let t=0;t<n.length;t++){const i=n[t];if(i.kind==r.SymbolKind.Namespace)this.recursiveTokenize(i.children,e);else{const t=new o.DocumentChangeItem(i.kind,i.selectionRange,i.name);e.push(t)}}return e}))}static tokenizeWithRegex(e){const t=new Array,n=e.getText(),i=c.Settings.RegexList,a=i.length;for(let c=0;c<a;c++){const a=i[c];if(a.languageId!==e.languageId||!a.regex)continue;const s=a.regex,u=s.length;for(let i=0;i<u;i++){const c=s[i],u=null!=a.captureGroup&&a.captureGroup.length>i?a.captureGroup[i]:1;let l=null;const d=new RegExp(c,"g");for(;null!=(l=d.exec(n));)try{const n=e.positionAt(l.index),i=e.lineAt(n.line),c=i.text,a=l[u],s=c.search(a),d=new r.Position(i.lineNumber,s),p=new r.Position(i.lineNumber,s+a.length),h=new r.Range(d,p);t.push(new o.DocumentChangeItem(r.SymbolKind.Class,h,a.trim()))}catch(e){console.log(e)}}}return t}static getNearestToken(e){return i(this,void 0,void 0,(function*(){const t=yield this.tokenizeCurrentDocument(),n=t.length;for(let i=0;i<n;i++){const n=t[i];if(n.region.intersection(e)||e.intersection(n.region))return new o.DocumentChangeItem(n.symbol,n.region,n.name)}}))}}},function(e,t,n){"use strict";var i=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))((function(r,o){function c(e){try{s(i.next(e))}catch(e){o(e)}}function a(e){try{s(i.throw(e))}catch(e){o(e)}}function s(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(c,a)}s((i=i.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const r=n(0),o=n(4),c=n(5),a=n(6),s=n(7),u=n(2),l=n(1),d=new a.QuickInputProxy((function(e){var t;return i(this,void 0,void 0,(function*(){const n=r.window.activeTextEditor;if(void 0===n||void 0===n.selection)return;const i=n.document,o=c.extname(i.uri.fsPath);let a=`${e}${o}`;e.includes(".")&&(a=e);const s=r.Uri.file(c.join(c.dirname(i.uri.fsPath),a)),u=null===(t=r.window.activeTextEditor)||void 0===t?void 0:t.selection,l=new r.WorkspaceEdit;return l.renameFile(i.uri,s,{overwrite:!0}),yield r.workspace.applyEdit(l).then(()=>{const e=r.window.activeTextEditor;return u&&e&&(e.selections=[u]),r.commands.executeCommand("workbench.action.focusActiveEditorGroup")})}))}));function p(e){const t=new Array;return t.push({label:e.name,description:"unchanged"}),t.push({label:o.upper(e.name),description:"upper"}),t.push({label:o.lower(e.name),description:"lower"}),t.push({label:o.capital(e.name),description:"capital"}),t.push({label:o.snake(e.name),description:"snake"}),t.push({label:o.pascal(e.name),description:"pascal"}),t.push({label:o.camel(e.name),description:"camel"}),t.push({label:o.kebab(e.name),description:"kebab"}),t.push({label:o.header(e.name),description:"header"}),t.push({label:o.constant(e.name),description:"constant"}),t.push({label:o.title(e.name),description:"title"}),t.push({label:o.sentence(e.name),description:"sentence"}),t.push({label:o.flip(e.name),description:"flip"}),t.push({label:o.random(e.name),description:"random"}),t}function h(e,t){const n=p(t);r.window.activeTextEditor,d.Show(c.basename(e),n)}t.activate=function(e){const t=new s.DocumentChangeTracker(h);l.Settings.Initialize(),e.subscriptions.push(l.Settings.Subscribe(e),r.window.onDidChangeActiveTextEditor(e=>{t.Reset()}),r.workspace.onDidSaveTextDocument(e=>{t.Trigger(e)}),r.workspace.onDidChangeTextDocument(e=>{t.Update(e)}),r.commands.registerCommand("renamer.rename-current-file",()=>i(this,void 0,void 0,(function*(){try{const e=r.window.activeTextEditor;if(void 0===e||void 0===e.selection)return;const t=e.document,n=function(e){const t=new Array,n=e.length;for(let i=0;i<n;i++){const n=e[i];t.push(...p(n))}return t}(yield u.DocumentTokenizer.tokenizeCurrentDocument());d.Show(c.basename(t.uri.fsPath),n)}catch(e){r.window.showErrorMessage("renaming error: {"+e+"}")}}))))},t.deactivate=function(){}},function(e,t,n){
/*! Case - v1.6.2 - 2020-03-24
* Copyright (c) 2020 Nathan Bubna; Licensed MIT, GPL */
(function(){"use strict";var t=function(e,t){return t=t||"",e.replace(/(^|-)/g,"$1\\u"+t).replace(/,/g,"\\u"+t)},n=t("20-26,28-2F,3A-40,5B-60,7B-7E,A0-BF,D7,F7","00"),i="a-z"+t("DF-F6,F8-FF","00"),r="A-Z"+t("C0-D6,D8-DE","00"),o=function(e,t,o,c){return e=e||n,t=t||i,o=o||r,c=c||"A|An|And|As|At|But|By|En|For|If|In|Of|On|Or|The|To|Vs?\\.?|Via",{capitalize:new RegExp("(^|["+e+"])(["+t+"])","g"),pascal:new RegExp("(^|["+e+"])+(["+t+o+"])","g"),fill:new RegExp("["+e+"]+(.|$)","g"),sentence:new RegExp('(^\\s*|[\\?\\!\\.]+"?\\s+"?|,\\s+")(['+t+"])","g"),improper:new RegExp("\\b("+c+")\\b","g"),relax:new RegExp("([^"+o+"])(["+o+"]*)(["+o+"])(?=[^"+o+"]|$)","g"),upper:new RegExp("^[^"+t+"]+$"),hole:/[^\s]\s[^\s]/,apostrophe:/'/g,room:new RegExp("["+e+"]")}},c=o(),a={re:c,unicodes:t,regexps:o,types:[],up:String.prototype.toUpperCase,low:String.prototype.toLowerCase,cap:function(e){return a.up.call(e.charAt(0))+e.slice(1)},decap:function(e){return a.low.call(e.charAt(0))+e.slice(1)},deapostrophe:function(e){return e.replace(c.apostrophe,"")},fill:function(e,t,n){return null!=t&&(e=e.replace(c.fill,(function(e,n){return n?t+n:""}))),n&&(e=a.deapostrophe(e)),e},prep:function(e,t,n,i){if(e=null==e?"":e+"",!i&&c.upper.test(e)&&(e=a.low.call(e)),!t&&!c.hole.test(e)){var r=a.fill(e," ");c.hole.test(r)&&(e=r)}return n||c.room.test(e)||(e=e.replace(c.relax,a.relax)),e},relax:function(e,t,n,i){return t+" "+(n?n+" ":"")+i}},s={_:a,of:function(e){for(var t=0,n=a.types.length;t<n;t++)if(s[a.types[t]].apply(s,arguments)===e)return a.types[t]},flip:function(e){return e.replace(/\w/g,(function(e){return(e==a.up.call(e)?a.low:a.up).call(e)}))},random:function(e){return e.replace(/\w/g,(function(e){return(Math.round(Math.random())?a.up:a.low).call(e)}))},type:function(e,t){s[e]=t,a.types.push(e)}},u={lower:function(e,t,n){return a.fill(a.low.call(a.prep(e,t)),t,n)},snake:function(e){return s.lower(e,"_",!0)},constant:function(e){return s.upper(e,"_",!0)},camel:function(e){return a.decap(s.pascal(e))},kebab:function(e){return s.lower(e,"-",!0)},upper:function(e,t,n){return a.fill(a.up.call(a.prep(e,t,!1,!0)),t,n)},capital:function(e,t,n){return a.fill(a.prep(e).replace(c.capitalize,(function(e,t,n){return t+a.up.call(n)})),t,n)},header:function(e){return s.capital(e,"-",!0)},pascal:function(e){return a.fill(a.prep(e,!1,!0).replace(c.pascal,(function(e,t,n){return a.up.call(n)})),"",!0)},title:function(e){return s.capital(e).replace(c.improper,(function(e,t,n,i){return n>0&&n<i.lastIndexOf(" ")?a.low.call(e):e}))},sentence:function(e,t,n){return e=s.lower(e).replace(c.sentence,(function(e,t,n){return t+a.up.call(n)})),t&&t.forEach((function(t){e=e.replace(new RegExp("\\b"+s.lower(t)+"\\b","g"),a.cap)})),n&&n.forEach((function(t){e=e.replace(new RegExp("(\\b"+s.lower(t)+"\\. +)(\\w)"),(function(e,t,n){return t+a.low.call(n)}))})),e}};for(var l in u.squish=u.pascal,s.default=s,u)s.type(l,u[l]);var d="function"==typeof d?d:function(){};d(e.exports?e.exports=s:this.Case=s)}).call(this)},function(e,t){e.exports=require("path")},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=n(0);class r{constructor(e){this.accept=e,this.valueSelected=!1,this.valueAlreadySelected=!1,this.allItems=new Array,this.quickPick=i.window.createQuickPick(),this.quickPick.title="New Name (Press 'Enter' to confirm or 'Escape' to cancel)",this.quickPick.onDidChangeSelection(e=>{this.valueAlreadySelected||this.quickPick.value.length>3||(this.quickPick.value=e[0].label.toString(),this.valueSelected=!0,this.valueAlreadySelected=!0)}),this.quickPick.onDidHide(e=>{r.alreadyOpened=!1}),this.quickPick.onDidAccept(t=>{this.valueSelected?this.valueSelected=!1:(e(this.quickPick.value),this.quickPick.hide())})}StartCountdown(){return setTimeout(()=>{this.valueAlreadySelected=!1},500)}Show(e,t){r.alreadyOpened||(r.alreadyOpened=!0,t.splice(0,0,{label:e,description:"current file name"}),this.quickPick.items=this.allItems=t,this.valueSelected=!1,this.valueAlreadySelected=!1,this.quickPick.value="",this.quickPick.show())}}t.QuickInputProxy=r,r.alreadyOpened=!1},function(e,t,n){"use strict";var i=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))((function(r,o){function c(e){try{s(i.next(e))}catch(e){o(e)}}function a(e){try{s(i.throw(e))}catch(e){o(e)}}function s(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(c,a)}s((i=i.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const r=n(2),o=n(1);t.DocumentChangeTracker=class{constructor(e){this.onDidChangesDetected=e,this.initialList=void 0}Update(e){return i(this,void 0,void 0,(function*(){if(!o.Settings.Enabled||0==e.contentChanges.length)return;this.detectedChangeItem=void 0;let t=!1;if(!this.initialList&&(yield this.Reset(),t=!0,!this.initialList))return;const n=e.contentChanges,i=n.length;for(let e=0;e<i;e++){const i=n[e],o=this.initialList,c=o.length;for(let e=0;e<c;e++){const n=o[e],c=yield r.DocumentTokenizer.getNearestToken(i.range);c&&(t||(n.region.intersection(c.region)||c.region.intersection(n.region))&&n.name!==c.name)&&(this.detectedChangeItem=n,this.detectedChangeItem.name=c.name)}}}))}Trigger(e){return i(this,void 0,void 0,(function*(){o.Settings.Enabled&&this.initialList&&this.detectedChangeItem&&!o.Settings.BlackList.includes(e.languageId)&&(yield this.onDidChangesDetected(e.uri.fsPath,this.detectedChangeItem),yield this.Reset())}))}Reset(){return i(this,void 0,void 0,(function*(){o.Settings.Enabled&&(this.initialList=yield r.DocumentTokenizer.tokenizeCurrentDocument(),this.detectedChangeItem=void 0)}))}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.DocumentChangeItem=class{constructor(e,t,n){this.symbol=e,this.region=t,this.name=n}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});class i{}t.Constants=i,i.ExtensionName="renamer"}]);
//# sourceMappingURL=extension.js.map