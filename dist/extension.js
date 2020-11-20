module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(1);
const Case = __webpack_require__(2);
const path = __webpack_require__(3);
const quickInputProxy_1 = __webpack_require__(4);
const documentChangeTracker_1 = __webpack_require__(5);
const documentTokenizer_1 = __webpack_require__(6);
const Settings_1 = __webpack_require__(8);
const proxy = new quickInputProxy_1.QuickInputProxy(RenameCurrentFile);
function activate(context) {
    const tracker = new documentChangeTracker_1.DocumentChangeTracker(onDidChangeDetected);
    Settings_1.Settings.Initialize();
    context.subscriptions.push(Settings_1.Settings.Subscribe(context), vscode.window.onDidChangeActiveTextEditor((e) => {
        tracker.Reset();
    }), vscode.workspace.onDidSaveTextDocument((e) => {
        tracker.Trigger(e);
    }), vscode.workspace.onDidChangeTextDocument((e) => {
        tracker.Update(e);
    }), vscode.commands.registerCommand('renamer.rename-current-file', () => __awaiter(this, void 0, void 0, function* () {
        try {
            const textEditor = vscode.window.activeTextEditor;
            if (textEditor === undefined || textEditor.selection === undefined)
                return;
            const doc = textEditor.document;
            const symbols = yield documentTokenizer_1.DocumentTokenizer.tokenizeCurrentDocument();
            const items = expandItems(symbols);
            proxy.Show(path.basename(doc.uri.fsPath), items);
        }
        catch (err) {
            vscode.window.showErrorMessage("renaming error: {" + err + "}");
        }
    })));
}
exports.activate = activate;
function RenameCurrentFile(newName) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const textEditor = vscode.window.activeTextEditor;
        if (textEditor === undefined || textEditor.selection === undefined)
            return;
        const doc = textEditor.document;
        const ext = path.extname(doc.uri.fsPath);
        let resultingName = `${newName}${ext}`;
        if (newName.includes('.'))
            resultingName = newName;
        const uri = vscode.Uri.file(path.join(path.dirname(doc.uri.fsPath), resultingName));
        const selection = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.selection;
        const edit = new vscode.WorkspaceEdit();
        edit.renameFile(doc.uri, uri, { overwrite: true });
        return yield vscode.workspace.applyEdit(edit).then(() => {
            const textEditor = vscode.window.activeTextEditor;
            if (selection && textEditor)
                textEditor.selections = [selection];
            return vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
        });
    });
}
function expandItems(tokens) {
    const quickPickItems = new Array();
    const tokensCount = tokens.length;
    for (let i = 0; i < tokensCount; i++) {
        const token = tokens[i];
        quickPickItems.push(...expandItem(token));
    }
    return quickPickItems;
}
function expandItem(token) {
    const quickPickItems = new Array();
    quickPickItems.push({ label: token.name, description: 'unchanged' });
    quickPickItems.push({ label: Case.upper(token.name), description: 'upper' });
    quickPickItems.push({ label: Case.lower(token.name), description: 'lower' });
    quickPickItems.push({ label: Case.capital(token.name), description: 'capital' });
    quickPickItems.push({ label: Case.snake(token.name), description: 'snake' });
    quickPickItems.push({ label: Case.pascal(token.name), description: 'pascal' });
    quickPickItems.push({ label: Case.camel(token.name), description: 'camel' });
    quickPickItems.push({ label: Case.kebab(token.name), description: 'kebab' });
    quickPickItems.push({ label: Case.header(token.name), description: 'header' });
    quickPickItems.push({ label: Case.constant(token.name), description: 'constant' });
    quickPickItems.push({ label: Case.title(token.name), description: 'title' });
    quickPickItems.push({ label: Case.sentence(token.name), description: 'sentence' });
    quickPickItems.push({ label: Case.flip(token.name), description: 'flip' });
    quickPickItems.push({ label: Case.random(token.name), description: 'random' });
    return quickPickItems;
}
function onDidChangeDetected(docPath, item) {
    const items = expandItem(item);
    vscode.window.activeTextEditor;
    proxy.Show(path.basename(docPath), items);
}
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*! Case - v1.6.2 - 2020-03-24
* Copyright (c) 2020 Nathan Bubna; Licensed MIT, GPL */
(function() {
    "use strict";
    var unicodes = function(s, prefix) {
        prefix = prefix || '';
        return s.replace(/(^|-)/g, '$1\\u'+prefix).replace(/,/g, '\\u'+prefix);
    },
    basicSymbols = unicodes('20-26,28-2F,3A-40,5B-60,7B-7E,A0-BF,D7,F7', '00'),
    baseLowerCase = 'a-z'+unicodes('DF-F6,F8-FF', '00'),
    baseUpperCase = 'A-Z'+unicodes('C0-D6,D8-DE', '00'),
    improperInTitle = 'A|An|And|As|At|But|By|En|For|If|In|Of|On|Or|The|To|Vs?\\.?|Via',
    regexps = function(symbols, lowers, uppers, impropers) {
        symbols = symbols || basicSymbols;
        lowers = lowers || baseLowerCase;
        uppers = uppers || baseUpperCase;
        impropers = impropers || improperInTitle;
        return {
            capitalize: new RegExp('(^|['+symbols+'])(['+lowers+'])', 'g'),
            pascal: new RegExp('(^|['+symbols+'])+(['+lowers+uppers+'])', 'g'),
            fill: new RegExp('['+symbols+']+(.|$)','g'),
            sentence: new RegExp('(^\\s*|[\\?\\!\\.]+"?\\s+"?|,\\s+")(['+lowers+'])', 'g'),
            improper: new RegExp('\\b('+impropers+')\\b', 'g'),
            relax: new RegExp('([^'+uppers+'])(['+uppers+']*)(['+uppers+'])(?=[^'+uppers+']|$)', 'g'),
            upper: new RegExp('^[^'+lowers+']+$'),
            hole: /[^\s]\s[^\s]/,
            apostrophe: /'/g,
            room: new RegExp('['+symbols+']')
        };
    },
    re = regexps(),
    _ = {
        re: re,
        unicodes: unicodes,
        regexps: regexps,
        types: [],
        up: String.prototype.toUpperCase,
        low: String.prototype.toLowerCase,
        cap: function(s) {
            return _.up.call(s.charAt(0))+s.slice(1);
        },
        decap: function(s) {
            return _.low.call(s.charAt(0))+s.slice(1);
        },
        deapostrophe: function(s) {
            return s.replace(re.apostrophe, '');
        },
        fill: function(s, fill, deapostrophe) {
            if (fill != null) {
                s = s.replace(re.fill, function(m, next) {
                    return next ? fill + next : '';
                });
            }
            if (deapostrophe) {
                s = _.deapostrophe(s);
            }
            return s;
        },
        prep: function(s, fill, pascal, upper) {
            s = s == null ? '' : s + '';// force to string
            if (!upper && re.upper.test(s)) {
                s = _.low.call(s);
            }
            if (!fill && !re.hole.test(s)) {
                var holey = _.fill(s, ' ');
                if (re.hole.test(holey)) {
                    s = holey;
                }
            }
            if (!pascal && !re.room.test(s)) {
                s = s.replace(re.relax, _.relax);
            }
            return s;
        },
        relax: function(m, before, acronym, caps) {
            return before + ' ' + (acronym ? acronym+' ' : '') + caps;
        }
    },
    Case = {
        _: _,
        of: function(s) {
            for (var i=0,m=_.types.length; i<m; i++) {
                if (Case[_.types[i]].apply(Case, arguments) === s){ return _.types[i]; }
            }
        },
        flip: function(s) {
            return s.replace(/\w/g, function(l) {
                return (l == _.up.call(l) ? _.low : _.up).call(l);
            });
        },
        random: function(s) {
            return s.replace(/\w/g, function(l) {
                return (Math.round(Math.random()) ? _.up : _.low).call(l);
            });
        },
        type: function(type, fn) {
            Case[type] = fn;
            _.types.push(type);
        }
    },
    types = {
        lower: function(s, fill, deapostrophe) {
            return _.fill(_.low.call(_.prep(s, fill)), fill, deapostrophe);
        },
        snake: function(s) {
            return Case.lower(s, '_', true);
        },
        constant: function(s) {
            return Case.upper(s, '_', true);
        },
        camel: function(s) {
            return _.decap(Case.pascal(s));
        },
        kebab: function(s) {
            return Case.lower(s, '-', true);
        },
        upper: function(s, fill, deapostrophe) {
            return _.fill(_.up.call(_.prep(s, fill, false, true)), fill, deapostrophe);
        },
        capital: function(s, fill, deapostrophe) {
            return _.fill(_.prep(s).replace(re.capitalize, function(m, border, letter) {
                return border+_.up.call(letter);
            }), fill, deapostrophe);
        },
        header: function(s) {
            return Case.capital(s, '-', true);
        },
        pascal: function(s) {
            return _.fill(_.prep(s, false, true).replace(re.pascal, function(m, border, letter) {
                return _.up.call(letter);
            }), '', true);
        },
        title: function(s) {
            return Case.capital(s).replace(re.improper, function(small, p, i, s) {
                return i > 0 && i < s.lastIndexOf(' ') ? _.low.call(small) : small;
            });
        },
        sentence: function(s, names, abbreviations) {
            s = Case.lower(s).replace(re.sentence, function(m, prelude, letter) {
                return prelude + _.up.call(letter);
            });
            if (names) {
                names.forEach(function(name) {
                    s = s.replace(new RegExp('\\b'+Case.lower(name)+'\\b', "g"), _.cap);
                });
            }
            if (abbreviations) {
                abbreviations.forEach(function(abbr) {
                    s = s.replace(new RegExp('(\\b'+Case.lower(abbr)+'\\. +)(\\w)'), function(m, abbrAndSpace, letter) {
                        return abbrAndSpace + _.low.call(letter);
                    });
                });
            }
            return s;
        }
    };

    // TODO: Remove "squish" in a future breaking release.
    types.squish = types.pascal;
    
    // Allow import default
    Case.default = Case;

    for (var type in types) {
        Case.type(type, types[type]);
    }
    // export Case (AMD, commonjs, or global)
    var define = typeof define === "function" ? define : function(){};
    define( true && module.exports ? module.exports = Case : this.Case = Case);

}).call(this);


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(1);
class QuickInputProxy {
    /**
     *  Construct the quick pick
     */
    constructor(accept) {
        this.accept = accept;
        this.allItems = new Array();
        this.quickPick = vscode.window.createQuickPick();
        this.quickPick.title = "New Name (Press 'Enter' to confirm or 'Escape' to cancel)";
        this.quickPick.onDidChangeActive((e) => {
            if (e.length > 0)
                this.quickPick.value = e[0].label.toString();
        });
        this.quickPick.onDidHide((e) => {
            QuickInputProxy.alreadyOpened = false;
        });
        this.quickPick.onDidAccept(e => {
            accept(this.quickPick.value);
            this.quickPick.hide();
        });
    }
    /**
     * Show
     */
    Show(currentName, items) {
        if (QuickInputProxy.alreadyOpened)
            return;
        QuickInputProxy.alreadyOpened = true;
        items.splice(0, 0, { label: currentName, description: 'current file name' });
        this.quickPick.items = this.allItems = items;
        // this.quickPick.value = currentName;
        this.quickPick.show();
    }
}
exports.QuickInputProxy = QuickInputProxy;
QuickInputProxy.alreadyOpened = false;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const documentTokenizer_1 = __webpack_require__(6);
const Settings_1 = __webpack_require__(8);
class DocumentChangeTracker {
    constructor(onDidChangesDetected) {
        this.onDidChangesDetected = onDidChangesDetected;
        this.initialList = undefined;
    }
    /**
     * Update
     */
    Update(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Settings_1.Settings.Enabled || e.contentChanges.length == 0)
                return;
            this.detectedChangeItem = undefined;
            let forceChanges = false;
            if (!this.initialList) {
                yield this.Reset();
                forceChanges = true;
                if (!this.initialList)
                    return;
            }
            const changedItemList = e.contentChanges;
            const changedListCount = changedItemList.length;
            for (let index = 0; index < changedListCount; index++) {
                const changedItem = changedItemList[index];
                const itemList = this.initialList;
                const itemListCount = itemList.length;
                for (let index = 0; index < itemListCount; index++) {
                    const item = itemList[index];
                    const nearestToken = yield documentTokenizer_1.DocumentTokenizer.getNearestToken(changedItem.range);
                    if (nearestToken && (forceChanges || (item.region.intersection(nearestToken.region) || nearestToken.region.intersection(item.region)) && item.name !== nearestToken.name)) {
                        this.detectedChangeItem = item;
                        this.detectedChangeItem.name = nearestToken.name;
                    }
                }
            }
        });
    }
    Trigger(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Settings_1.Settings.Enabled || !this.initialList || !this.detectedChangeItem || Settings_1.Settings.BlackList.includes(doc.languageId)) {
                return;
            }
            yield this.onDidChangesDetected(doc.uri.fsPath, this.detectedChangeItem);
            yield this.Reset();
        });
    }
    /**
     * Reset
     */
    Reset() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Settings_1.Settings.Enabled)
                return;
            this.initialList = yield documentTokenizer_1.DocumentTokenizer.tokenizeCurrentDocument();
            this.detectedChangeItem = undefined;
        });
    }
}
exports.DocumentChangeTracker = DocumentChangeTracker;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(1);
const documentChangeItem_1 = __webpack_require__(7);
class DocumentTokenizer {
    static recursiveTokenize(symbols, tokens) {
        for (let i = 0; i < symbols.length; i++) {
            const s = symbols[i];
            if (s.kind == vscode.SymbolKind.Namespace) {
                this.recursiveTokenize(s.children, tokens);
            }
            else {
                const item = new documentChangeItem_1.DocumentChangeItem(s.kind, s.selectionRange, s.name);
                tokens.push(item);
            }
        }
    }
    static tokenizeCurrentDocument() {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = new Array();
            const textEditor = vscode.window.activeTextEditor;
            if (!textEditor)
                return tokens;
            const symbols = yield vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', textEditor.document.uri);
            if (!symbols)
                return tokens;
            for (let i = 0; i < symbols.length; i++) {
                const s = symbols[i];
                if (s.kind == vscode.SymbolKind.Namespace) {
                    this.recursiveTokenize(s.children, tokens);
                }
                else {
                    const item = new documentChangeItem_1.DocumentChangeItem(s.kind, s.selectionRange, s.name);
                    tokens.push(item);
                }
                // enum SymbolKind {
                //     File = 0,
                //     Module = 1,
                //     Namespace = 2,
                //     Package = 3,
                //     Class = 4,
                //     Method = 5,
                //     Property = 6,
                //     Field = 7,
                //     Constructor = 8,
                //     Enum = 9,
                //     Interface = 10,
                //     Function = 11,
                //     Variable = 12,
                //     Constant = 13,
                //     String = 14,
                //     Number = 15,
                //     Boolean = 16,
                //     Array = 17,
                //     Object = 18,
                //     Key = 19,
                //     Null = 20,
                //     EnumMember = 21,
                //     Struct = 22,
                //     Event = 23,
                //     Operator = 24,
                //     TypeParameter = 25
                // }
                // if (s.kind == vscode.SymbolKind.Variable) {
                //     const item = new DocumentChangeItem(s.kind, s.selectionRange, s.name);
                //     tokens.push(item);
                // }
            }
            return tokens;
        });
    }
    static getNearestToken(region) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield this.tokenizeCurrentDocument();
            const count = tokens.length;
            for (let i = 0; i < count; i++) {
                const item = tokens[i];
                if ((item.region.intersection(region) || region.intersection(item.region))) {
                    return new documentChangeItem_1.DocumentChangeItem(item.symbol, item.region, item.name);
                }
            }
        });
    }
}
exports.DocumentTokenizer = DocumentTokenizer;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class DocumentChangeItem {
    constructor(symbol, region, name) {
        this.symbol = symbol;
        this.region = region;
        this.name = name;
    }
}
exports.DocumentChangeItem = DocumentChangeItem;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(1);
const constants_1 = __webpack_require__(9);
class Settings {
    static Initialize() {
        this.Reload();
    }
    static Reload() {
        this.Enabled = this.getEnabledPref();
        this.BlackList = this.getBlackListPref();
    }
    static Subscribe(context) {
        return vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration(constants_1.Constants.ExtensionName)) {
                this.Reload();
            }
        });
    }
    static getEnabledPref() {
        return vscode.workspace.getConfiguration(constants_1.Constants.ExtensionName).get('enabled', true);
    }
    static getBlackListPref() {
        return vscode.workspace.getConfiguration(constants_1.Constants.ExtensionName).get('ignoredLanguageIdList', new Array());
    }
}
exports.Settings = Settings;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Constants {
}
exports.Constants = Constants;
Constants.ExtensionName = 'renamer';


/***/ })
/******/ ]);
//# sourceMappingURL=extension.js.map