// Generated by CoffeeScript 1.12.4
(function() {
  var findDomain, group, html_export, main, undo;

  main = function() {
    var doc, undoCount;
    if (!app.activeDocument) {
      return;
    }
    doc = app.activeDocument;
    if (!doc.fullName) {
      return;
    }
    undoCount = group(doc);
    html_export(doc);
    undo(doc, undoCount);
  };

  group = function(doc) {
    var i, item, j, len, len1, page, ref, ref1, undoCount;
    undoCount = 0;
    ref = doc.pages;
    for (i = 0, len = ref.length; i < len; i++) {
      page = ref[i];
      group = [];
      ref1 = page.allPageItems;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        item = ref1[j];
        if (item.parent.constructor !== Spread) {
          continue;
        }
        if (item.locked) {
          item.locked = false;
          undoCount++;
        }
        group.push(item);
      }
      if (group.length > 1) {
        page.groups.add(group);
        undoCount++;
      }
    }
    return undoCount;
  };

  undo = function(doc, undoCount) {
    var i, ref;
    for (i = 0, ref = undoCount; 0 <= ref ? i < ref : i > ref; 0 <= ref ? i++ : i--) {
      doc.undo();
    }
  };

  html_export = function(doc) {
    var basename, basenameWithoutExt, content, file, filename, folder, parts, showDialog, title;
    folder = findDomain(doc.filePath);
    if (!folder) {
      return alert('No domain folder found');
    }
    basename = doc.fullName.displayName;
    basenameWithoutExt = basename.substring(0, basename.lastIndexOf('.'));
    parts = basenameWithoutExt.split('-');
    title = parts[0];
    filename = parts.length === 1 ? 'index' : parts.slice(1).join('-').trim();
    file = new File(folder + '/' + filename + '.html');
    doc.exportFile(ExportFormat.HTML, file, (showDialog = false));
    file.open('e');
    content = file.read();
    content = content.replace('<title>' + filename + '</title>', '<title>' + title + '</title>\u000d\n\u0009\u0009<meta name="viewport" content="width=device-width" />');
    file.seek(0);
    file.write(content);
    file.close();
  };

  findDomain = function(path) {
    var file, i, len, ref;
    ref = new Folder(path).getFiles();
    for (i = 0, len = ref.length; i < len; i++) {
      file = ref[i];
      if (file.displayName.match(/\.(cz|com)$/)) {
        return file;
      }
    }
  };

  String.prototype.trim = function() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };

  main();

}).call(this);
