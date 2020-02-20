//
// 6160
//

const ENABLELOG = false;
const log = message => { if (ENABLELOG) console.log(message) }

async function loadFonts(fonts) {
  fonts.forEach(async (font) => {
    await figma.loadFontAsync(font)  
  });
  
  log(`[FIGMA][LOADFONTS] fonts loaded: ${fonts.length}`);
}

// getting all pages
const getPages = () => {
  log(`[FIGMA][GETPAGES] start getting all pages`);

  const pages = [];

  // getting root page
  for (const node of figma.root.findAll(node => node.type === "PAGE" )) {
    pages.push({id: node.id, name: node.name});
  }
  
  log(`[FIGMA][GETPAGES] end. found: ${pages}`);
  return pages;
}

// traverse function for finding children with $type
function traverse(node, types) {
  const nodeList = [];

  if ("children" in node) {
    if (node.type === "PAGE") {
      for (const child of node.children) {
        if (types.includes(child.type)) {
          nodeList.push({id: child.id, text: child.name});
        }
      }
    }
  }

  return nodeList
}

// getting all frames from page id
const getFrames = (params) => {
  log(`[FIGMA][GETFRAMES] start with params: ${params}`);

  const page = figma.getNodeById(params.id);
  const frames = traverse(page, ['FRAME', 'GROUP']);

  log(`[FIGMA][GETFRAMES] end. found:  ${frames}`);
  
  figma.ui.postMessage({
    type: 'getFrames',
    data: frames
  })
}


// recursive function for finding texts
let textAggregator = [];
let usedFonts = [];
function traverseText(node) {
  log(`[FIGMA][GETTEXTSTRAVERSE] start node: ${node}`);

  if (node.type === 'TEXT' && node.visible) {
    log(`[FIGMA][GETTEXTSTRAVERSE] found TEXT: ${node}`);
    textAggregator.push({id: node.id, name: node.name, text: node.characters});
    usedFonts.push(node.fontName);
    return true;
  }
  if ("children" in node) {
    log(`[FIGMA][GETTEXTSTRAVERSE] found children in node: ${node.children}`);
    
    for (const child of node.children) {
      log(`[FIGMA][GETTEXTSTRAVERSE] start new traverse with child/parent: ${child} - ${node}`);
      traverseText(child);
    }
  }
}


// retrieving all text in frame.
const getTextsTraverse = (params) => {
  // resetting text aggregator
  textAggregator = [];
  log(`[FIGMA][GETTEXTSTRAVERSE] start with params: ${params}`);
  const frame = figma.getNodeById(params.frame);
  
  traverseText(frame);
  
  const textList = textAggregator;
  
  log(`[FIGMA][GETTEXTSTRAVERSE] end. found: ${textList}`);

  loadFonts(usedFonts);

  figma.ui.postMessage({
      type: 'getText',
      data: textList
  })
}

const changeText = (params) => {
  log(`[FIGMA][CHANGETEXT] change text requested with params: ${params}`);

  const newCharacters = params.characters;
  
  const text = figma.getNodeById(params.id);

  log(`[FIGMA][CHANGETEXT] found text: ${text}`);

  if (text) {
    log(`[FIGMA][CHANGETEXT] changing text to: ${newCharacters}`);
    if ('characters' in text) text.characters = newCharacters;
    
  }

  getTextsTraverse(params.selected);
}

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {
  width: 1024,
  height: 768
});


// send pages list at startup
const ROOTPAGES = getPages()
figma.ui.postMessage({ type: 'getPages', data: ROOTPAGES });

// handling messages from UI
figma.ui.onmessage = msg => {
  log(`[FIGMA] arrived message with type: ${msg.type} and content: ${msg}`);

  if (msg.type === 'retrieveFrames') {
    if (msg.id) return getFrames({id: msg.id, type: 'FRAME'});
  }

  if (msg.type === 'retrieveText') {
    if (msg.selected) return getTextsTraverse(msg.selected);
  }

  if (msg.type === 'retrievePages') {
    return figma.ui.postMessage({ type: 'getPages', data: ROOTPAGES });
  }

  if (msg.type === 'changeText') {
    if (msg.params) return changeText(msg.params);
  }
}
