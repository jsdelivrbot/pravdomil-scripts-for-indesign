/// <reference path="../../node_modules/types-for-adobe/ScriptUI/index.d.ts" />

interface PravdomilExportOptions {
  onlyCurrentPage?: boolean;
  
  mergePages?: boolean;
  
  keepFontFiles?: boolean;
  versioning?: boolean;
  
  outputFile?: string;
}

function pravdomilExportOptionsGet(doc: Document) {
  let label = doc.extractLabel("pravdomil_html_export");
  let opt = myJSONParse(label) as PravdomilExportOptions;
  if(typeof opt != "object") {
    opt = {};
  }
  
  if(opt.keepFontFiles == undefined) {
    opt.keepFontFiles = true;
  }
  
  return opt
}

function pravdomilExportOptionsSave(doc: Document, opt: object) {
  let label = myJSONStringify(opt);
  doc.insertLabel("pravdomil_html_export", label)
}

function pravdomilExportOptionsDialog(doc: Document) {  
  let opt = pravdomilExportOptionsGet(doc);
  
  let dialog = new Window("dialog", "Pravdomil Export to HTML");
  dialog.alignChildren = "fill";
  
  let pagesPanel = dialog.add("panel") as Panel;
  pagesPanel.margins = 20;
  pagesPanel.orientation = "row";
  pagesPanel.text = "Pages";
  let allPages = pagesPanel.add("radiobutton", undefined, "All Pages") as RadioButton;
  allPages.value = !Boolean(opt.onlyCurrentPage);
  let onlyCurrentPage = pagesPanel.add("radiobutton", undefined, "Current Page") as RadioButton;
  onlyCurrentPage.value = Boolean(opt.onlyCurrentPage);
  
  let group = dialog.add("panel") as Panel;
  group.orientation = "row";
  let splitPages = group.add("radiobutton", undefined, "Split Pages");
  splitPages.value = !opt.mergePages;
  let mergePages = group.add("radiobutton", undefined, "Merge Pages");
  mergePages.value = opt.mergePages;
  
  let optionsPanel = dialog.add("panel") as Panel;
  optionsPanel.alignChildren = "left";
  optionsPanel.orientation = "column";
  
  let versioning = optionsPanel.add("checkbox", undefined, "Versioning");
  versioning.value = opt.versioning;
  
  let keepFontFiles = optionsPanel.add("checkbox", undefined, "Keep Font Files");
  keepFontFiles.value = opt.keepFontFiles;
  
  let group = dialog.add("group");
  group.alignment = "right";
  group.add("button", undefined, "Cancel");
  group.add("button", undefined, "OK");
  
  if(dialog.show() == 1) {
    opt.onlyCurrentPage = onlyCurrentPage.value;
    opt.mergePages = mergePages.value;
    opt.versioning = versioning.value;
    opt.keepFontFiles = keepFontFiles.value;
    
    let path;
    let outputFile = new File(opt.outputFile);
    if(opt.outputFile && outputFile.parent.exists) {
      path = outputFile.saveDlg()
    }
    else if(doc.saved) {
      path = new File(doc.fullName.fullName.replace(/\.indd$/, ".html")).saveDlg()
    }
    else {
      path = File.openDialog()
    }
    if(!path) { return }
    else {
      if(path.name.substr(-5) !== ".html") { path += ".html" }
      opt.outputFile = path
    }

    pravdomilExportOptionsSave(doc, opt);
    return opt
  }
}
