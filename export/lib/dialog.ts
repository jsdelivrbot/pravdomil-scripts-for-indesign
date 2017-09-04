/// <reference path="../../node_modules/types-for-adobe/ScriptUI/index.d.ts" />

function options_dialog(doc: Document) {  
  let opt = get_options(doc);
  
  let dialog = new Window("dialog", "Pravdomil Export to HTML");
  dialog.alignChildren = "fill";
  
  let pagesPanel = dialog.add("panel") as Panel;
  pagesPanel.orientation = "row";
  pagesPanel.text = "Pages";
  let allPages = pagesPanel.add("radiobutton", undefined, "All Pages");
  allPages.value = !opt.onlyCurrentPage;
  let onlyCurrentPage = pagesPanel.add("radiobutton", undefined, "Current Page");
  onlyCurrentPage.value = opt.onlyCurrentPage;
  
  let group = dialog.add("panel") as Panel;
  group.orientation = "row";
  let splitPages = group.add("radiobutton", undefined, "Split Pages");
  splitPages.value = !opt.mergePages;
  let mergePages = group.add("radiobutton", undefined, "Merge Pages");
  mergePages.value = opt.mergePages;
  
  let group = dialog.add("panel") as Panel;
  group.alignChildren = "left";
  group.orientation = "column";
  
  let versioning = group.add("checkbox", undefined, "Versioning");
  versioning.value = opt.versioning;
  
  let keepFontFiles = group.add("checkbox", undefined, "Keep Font Files");
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
    
    save_options(doc, opt);
    return opt
  }
}

function get_options(doc: Document) {
  let label = doc.extractLabel("pravdomil_html_export");
  let opt = myJSONParse(label);
  if(opt.keepFontFiles === undefined) { opt.keepFontFiles = true }
  return opt
}

function save_options(doc: Document, opt: object) {
  let label = myJSONStringify(opt);
  doc.insertLabel("pravdomil_html_export", label)
}
