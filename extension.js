// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const yamlFront = require("yaml-front-matter");
const clipboardy = require("clipboardy");

/**
 * Gets the YAML front matter for the currenet active document.
 */
function getFrontMatter() {
  var editor = vscode.window.activeTextEditor;

  if (!editor) {
    return;
  }

  var doc = editor.document;

  return yamlFront.loadFront(doc.getText());
}

/**
 * Gets the slug based on the current active document.
 */
function getSlug() {
  var editor = vscode.window.activeTextEditor;

  if (!editor) {
    return;
  }

  var doc = editor.document;

  var currentlyOpenTabfilePath = doc.fileName;
  currentlyOpenTabfilePath = currentlyOpenTabfilePath.split("\\").join("/");
  var dirname = path.dirname(currentlyOpenTabfilePath);
  var currentOpenTabFileName = path.basename(currentlyOpenTabfilePath);

  var collection = dirname.substr(dirname.lastIndexOf("/"));
  var year = currentOpenTabFileName.substr(0, 4);
  var month = currentOpenTabFileName.substr(5, 2);
  var day = currentOpenTabFileName.substr(8, 2);
  var pathName = currentOpenTabFileName.substr(11);
  var extension = path.extname(pathName);
  pathName = pathName.substr(0, pathName.length - extension.length);

  var slug = collection + "/" + year + "/" + month + "/" + day + "/" + pathName;

  return slug;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "statamic-urls" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension.copyStatamicSlug",
    function() {
      // The code you place here will be executed every time your command is executed

      var editor = vscode.window.activeTextEditor;

      if (!editor) {
        return;
      }
      var slug = getSlug();

      clipboardy.writeSync(slug);
      vscode.window.showInformationMessage(slug + " copied to clipboard");
    }
  );

  let viewInBrowserDisposable = vscode.commands.registerCommand(
    "extension.viewURLInBrowser",
    function() {
      var editor = vscode.window.activeTextEditor;

      if (!editor) {
        return;
      }

      var statamicConf = vscode.workspace.getConfiguration('statamic');

      if (typeof statamicConf !== 'undefined' && statamicConf !== null) {
        if (typeof statamicConf.url !== 'undefined' && statamicConf.url !== null) {
          var baseUrl = statamicConf.url;

          if (baseUrl.charAt(baseUrl.length - 1) == '/') {
            baseUrl = baseUrl.substr(0, baseUrl.length - 1);
          }

          var slug = getSlug();
          var urlSlug = baseUrl + slug;
          
          vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(urlSlug));
        }
      }

    }
  );

  let copyTitleDisposable = vscode.commands.registerCommand(
    "extension.copyStatamicSlugAndTitle",
    function() {
      var editor = vscode.window.activeTextEditor;

      if (!editor) {
        return;
      }

      var frontMatter = getFrontMatter();

      var slug = getSlug();
      slug = "[" + frontMatter.title + "](" + slug + ")";

      clipboardy.writeSync(slug);
      vscode.window.showInformationMessage(slug + " copied to clipboard");
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(copyTitleDisposable);
  context.subscriptions.push(viewInBrowserDisposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
