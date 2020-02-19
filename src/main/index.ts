//
// 6160
//

async function loadFonts(fonts) {
  fonts.forEach(async (font) => {
    await figma.loadFontAsync(font)  
  });
  
  console.log('[FIGMA][LOADFONTS] fonts loaded: ', fonts.length);
}

// getting all pages
const getPages = () => {
  console.log('[FIGMA][GETPAGES] start getting all pages');

  const pages = [];

  // getting root page
  for (const node of figma.root.findAll(node => node.type === "PAGE" )) {
    pages.push({id: node.id, name: node.name});
  }
  
  console.log('[FIGMA][GETPAGES] end. found: ', pages);
  return pages;
}

// traverse function for finding children with $type
function traverse(node, type) {
  const nodeList = [];

  if ("children" in node) {
    if (node.type === "PAGE") {
      for (const child of node.children) {
        if (child.type === type) {
          nodeList.push({id: child.id, text: child.name});
        }
      }
    }
  }

  return nodeList
}

// getting all frames from page id
const getFrames = (params) => {
  console.log('[FIGMA][GETFRAMES] start with params: ', params);

  const page = figma.getNodeById(params.id);
  const frames = traverse(page, 'FRAME');

  console.log('[FIGMA][GETFRAMES] end. found: ', frames);
  
  figma.ui.postMessage({
    type: 'getFrames',
    data: frames
  })
}

let textAggregator = [];
let usedFonts = [];
// recursive function for finding texts
function traverseText(node) {
  console.log('[FIGMA][GETTEXTSTRAVERSE] start node: ', node);

  if (node.type === 'TEXT') {
    console.log('[FIGMA][GETTEXTSTRAVERSE] found TEXT: ', node);
    textAggregator.push({id: node.id, name: node.name, text: node.characters});
    usedFonts.push(node.fontName);
    return true;
  }
  if ("children" in node) {
    console.log('[FIGMA][GETTEXTSTRAVERSE] found children in node: ', node.children);
    
    for (const child of node.children) {
      console.log('[FIGMA][GETTEXTSTRAVERSE] start new traverse with child/parent: ', child, node);
      traverseText(child);
    }
    
  }
}


// retrieving all text in frame.
const getTextsTraverse = (params) => {
  // resetting text aggregator
  textAggregator = [];
  console.log('[FIGMA][GETTEXTSTRAVERSE] start with params: ', params);
  const frame = figma.getNodeById(params.frame);
  
  traverseText(frame);
  
  const textList = textAggregator;
  
  console.log('[FIGMA][GETTEXTSTRAVERSE] end. found: ', textList);

  loadFonts(usedFonts);

  figma.ui.postMessage({
      type: 'getText',
      data: textList
  })
}

const changeText = (params) => {
  console.log('[FIGMA][CHANGETEXT] change text requested with params: ', params);

  const newCharacters = params.characters;
  
  const text = figma.getNodeById(params.id);

  console.log('[FIGMA][CHANGETEXT] found text: ', text);

  if (text) {
    console.log('[FIGMA][CHANGETEXT] changing text to: ', newCharacters);
    if ('characters' in text) text.characters = newCharacters;
    
  }

  getTextsTraverse(params.selected);
}

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {
  width: 600,
  height: 520
});


// send pages list at startup
const ROOTPAGES = getPages()
figma.ui.postMessage({ type: 'getPages', data: ROOTPAGES });

// handling messages from UI
figma.ui.onmessage = msg => {
  console.log('[FIGMA] arrived message: ', msg.type, msg);

  // retrieve frame handler  
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
