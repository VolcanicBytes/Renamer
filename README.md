# Renamer

This extension allows you to rename a file when you change the most important symbols and save it.\
\
For example: you change a class name.\
After you hit **save**, you realize that the file name doesn't match the contained class.\
You should rename the file but how ?\
Two options:
1) open the Explorer sidebar, locate the file(manually or with the command `Reveal in Side Bar`) 
2) Use the [FileUtils]( https://marketplace.visualstudio.com/items?itemName=sleistner.vscode-fileutils)  `fileutils.renameFile` command

This extension introduces two new options:

1) [Renamer: Rename current file](#renamer.rename-current-file) command
   1) which varies from the FileUtils one, because it displays a bunch of names in different case, plus allow the extension to be changed manually
2) But more remarkable: **it automatically shows a picker for a new filename when it detects a change in a main symbol after a save**

## Options

You can add custom regex with the `renamer.regexList` setting to trigger the prompt, for language without highlights provider, for example:

```JSON
{
    "languageId": "csharp",
    "regex": [
        "class\\s*([^{]+)\\s*{",
        "interface\\s*([^{]+)\\s*{"
    ],
    "captureGroup": [
        1,
        1
    ]
} 
```
captureGroup are default to 1.

## Known issues

* It only works with languages that provide document Highlights or listed in `renamer.regexList` and that are not in the `ignoredLanguageIdList`
* It tries to detect changes based on the position of the main symbols
* In order for this extension to automatically prompt for new file names, symbol provider should be installed.
  * Javascript and Typescript work out of the box


## Credits

*   https://www.npmjs.com/package/case
*   https://marketplace.visualstudio.com/items?itemName=sleistner.vscode-fileutils
*   https://marketplace.visualstudio.com/items?itemName=VolcanicBytes.occurrences-jumper