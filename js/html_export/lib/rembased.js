"use strict";
function pravdomilExportRembasedDebug(opt) {
    if (opt.settings.rembasedDebug) {
        opt.headFilters.push(pravdomilExportRembasedDebugFilter);
    }
}
// noinspection JSUnusedLocalSymbols
function pravdomilExportRembasedDebugFilter(opt, i, str) {
    str += "<script src=\"https://cdn.jsdelivr.net/gh/pravdomil/rembased@master/js/rembased.js\" defer></script>\n";
    return str;
}
