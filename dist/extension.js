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
function activate(context) {
    let directJump = getDirectJumpPref();
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('occurrences-jumper'))
            directJump = getDirectJumpPref();
    }), vscode.commands.registerCommand('occurrences-jumper.toggleJumpMode', () => __awaiter(this, void 0, void 0, function* () {
        directJump = !directJump;
        setDirectJumpPref(directJump);
    })), vscode.commands.registerCommand('occurrences-jumper.next', () => __awaiter(this, void 0, void 0, function* () {
        try {
            const textEditor = vscode.window.activeTextEditor;
            if (textEditor === undefined || textEditor.selection === undefined)
                return;
            // tokenizeCurrentDocument();
            const doc = textEditor.document;
            const activeRange = new vscode.Range(textEditor.selection.start, textEditor.selection.end);
            var selectedText = doc.getText(textEditor.selection);
            if (!directJump) {
                if (yield directJumpNext(doc, textEditor, activeRange))
                    return;
            }
            var lastLine = doc.lineAt(doc.lineCount - 1);
            var text = doc.getText(new vscode.Range(textEditor.selection.start, lastLine.range.end));
            var startOffset = doc.offsetAt(textEditor.selection.active) - selectedText.length;
            var index = text.indexOf(selectedText, selectedText.length);
            if (index === -1) {
                text = doc.getText(new vscode.Range(new vscode.Position(0, 0), textEditor.selection.start));
                index = text.indexOf(selectedText);
                startOffset = 0;
                if (index === -1)
                    return;
            }
            const offset = startOffset + index;
            const endOffset = offset + selectedText.length;
            textEditor.selection = new vscode.Selection(doc.positionAt(offset), doc.positionAt(endOffset));
            textEditor.revealRange(textEditor.selection);
        }
        catch (err) {
            vscode.window.showErrorMessage("jumping error: {" + err + "}");
        }
    })), vscode.commands.registerCommand('occurrences-jumper.previous', () => __awaiter(this, void 0, void 0, function* () {
        try {
            const textEditor = vscode.window.activeTextEditor;
            if (textEditor === undefined || textEditor.selection === undefined)
                return;
            // tokenizeCurrentDocument();
            const doc = textEditor.document;
            const selection = doc.getText(textEditor.selection);
            const activeRange = new vscode.Range(textEditor.selection.start, textEditor.selection.end);
            if (!directJump) {
                if (yield directJumpPrevious(doc, textEditor, activeRange))
                    return;
            }
            let text = doc.getText(new vscode.Range(new vscode.Position(0, 0), textEditor.selection.start));
            let startOffset = 0;
            var index = text.lastIndexOf(selection);
            if (index === -1) {
                var lastLine = doc.lineAt(doc.lineCount - 1);
                text = doc.getText(new vscode.Range(textEditor.selection.end, lastLine.range.end));
                index = text.lastIndexOf(selection);
                startOffset = doc.offsetAt(textEditor.selection.active);
                if (index === -1)
                    return;
            }
            const offset = startOffset + index;
            const endOffset = offset + selection.length;
            textEditor.selection = new vscode.Selection(textEditor.document.positionAt(offset), textEditor.document.positionAt(endOffset));
            textEditor.revealRange(textEditor.selection);
        }
        catch (err) {
            vscode.window.showErrorMessage("jumping error: {" + err + "}");
        }
    })));
    function directJumpNext(doc, textEditor, activeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            const places = yield getPlaces(doc.uri, textEditor.selection.active);
            if (places.length > 1) {
                const placeList = places;
                const placeListCount = placeList.length;
                let currentPosition = 0;
                for (let i = 0; i < placeListCount; i++) {
                    const place = placeList[i];
                    if (place.range.isEqual(activeRange)) {
                        currentPosition = i;
                        break;
                    }
                }
                let place = currentPosition == placeList.length - 1 ? placeList[0] : placeList[currentPosition + 1];
                textEditor.selection = new vscode.Selection(place.range.start, place.range.end);
                textEditor.revealRange(textEditor.selection);
                return true;
            }
            return false;
        });
    }
    function directJumpPrevious(doc, textEditor, activeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            const places = yield getPlaces(doc.uri, textEditor.selection.active);
            if (places.length > 1) {
                const placeList = places;
                const placeListCount = placeList.length;
                let currentPosition = 0;
                for (let i = 0; i < placeListCount; i++) {
                    const place = placeList[i];
                    if (place.range.isEqual(activeRange)) {
                        currentPosition = i;
                        break;
                    }
                }
                let place = currentPosition > 0 ? placeList[currentPosition - 1] : placeList[placeList.length - 1];
                textEditor.selection = new vscode.Selection(place.range.start, place.range.end);
                textEditor.revealRange(textEditor.selection);
                return true;
            }
            return false;
        });
    }
}
exports.activate = activate;
let tokens = new Array();
function getPlaces(uri, position) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        return _a = yield vscode.commands.executeCommand('vscode.executeDocumentHighlights', uri, position), (_a !== null && _a !== void 0 ? _a : new Array());
    });
}
function getDirectJumpPref() {
    return vscode.workspace.getConfiguration('occurrences-jumper').get('useDirectJump', false);
}
function setDirectJumpPref(value) {
    return vscode.workspace.getConfiguration('occurrences-jumper').update('useDirectJump', value);
}
function tokenizeCurrentDocument() {
    return __awaiter(this, void 0, void 0, function* () {
        tokens = new Array();
        const textEditor = vscode.window.activeTextEditor;
        if (!textEditor)
            return;
        const symbols = yield vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', textEditor.document.uri);
        if (!symbols)
            return;
        for (let i = 0; i < symbols.length; i++) {
            const s = symbols[i];
            if (s.kind == vscode.SymbolKind.Variable) {
                const range = s.range;
                tokens.push(s.name);
            }
        }
    });
}
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ })
/******/ ]);
//# sourceMappingURL=extension.js.map