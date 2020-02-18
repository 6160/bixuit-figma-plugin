
// async function changetext(node) {
//   await figma.loadFontAsync({ family: "Montserrat", style: "Light" })
//   await figma.loadFontAsync({ family: "Montserrat", style: "Regular" })
//   await figma.loadFontAsync({ family: "Helvetica", style: "Regular" })
//   await figma.loadFontAsync({ family: "Roboto", style: "Regular" })
//   node.characters = 'DIOCANEDIO'
// }


// getting page with page id
const getPage = (params) => {
  console.log('[FIGMA][GETPAGE] start with params: ', params)

  // const type = params.type;
  const id = params.id;
  const nodeList = [];

  for (const node of figma.root.findAll(node => node.type === "PAGE" && node.id === id)) {
    nodeList.push(node);
  }

  console.log('[FIGMA][GETPAGE] end. found: ', nodeList)

  return nodeList;//figma.root.findAll((node) => {return node.type === 'PAGE' && node.id === id });
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
  const nodeList = []

  if ("children" in node) {
    if (node.type === "PAGE") {
      for (const child of node.children) {
        if (child.type === type) {
          nodeList.push({id: child.id, text: child.name})
        }
      }
    }
  }

  return nodeList
}

// getting frames from page id
const getFrames = (params) => {
  console.log('[FIGMA][GETFRAMES] start with params: ', params)

  const page = getPage(params);
  const frames = traverse(page[0], 'FRAME')

  console.log('[FIGMA][GETFRAMES] end. found: ', frames)
  
  figma.ui.postMessage({
    type: 'getFrames',
    data: frames
  })
}

// get single frame from frame id
const getFrame = (params) => {
  console.log('[FIGMA][GETFRAME] start with params: ', params)
  const page = getPage({id: params.page})[0];

  if ("children" in page) {
    if (page.type === "PAGE") {
      for (const child of page.children) {
        if (child.type === 'FRAME' && child.id === params.frame) {
          console.log('[FIGMA][GETFRAME] end. found: ', child)
          return child;
        }
      }
    }
  }
}

let textAggregator = [];
function traverseText(node) {
  console.log('[FIGMA][GETTEXTSTRAVERSE] start node: ', node)
  if ("children" in node) {
    console.log('[FIGMA][GETTEXTSTRAVERSE] found children in node with type: ', node.type);
    if (node.type === 'TEXT') {
      console.log('[FIGMA][GETTEXTSTRAVERSE] found TEXT: ', node)
      textAggregator.push({id: node.id, name: node.name, text: node.characters})
      return true;
    }

    if (node.type !== "INSTANCE") {
      console.log('[FIGMA][GETTEXTSTRAVERSE] node is not INSTANCE but: ', node.type)
      for (const child of node.children) {
        console.log('[FIGMA][GETTEXTSTRAVERSE] start new traverse with child/parent: ', child, node)
        traverseText( child)
      }
    }
  }
}


const getTexts = (params) => {
  console.log('[FIGMA][GETTEXTS] start with params: ', params)
  const frame = getFrame(params);

  const textList = [];

  for (const child of frame.children) {
    if (child.type === 'TEXT') {
      textList.push({id: child.id, name: child.name, text: child.characters})
    }
  }

  console.log('[FIGMA][GETTEXTS] end. found: ', textList)

  figma.ui.postMessage({
      type: 'getText',
      data: textList
  })
}
const getTextsTraverse = (params) => {
  console.log('[FIGMA][GETTEXTSTRAVERSE] start with params: ', params)
  const frame = getFrame(params);
  const done = traverseText(frame);

  const textList = done ? textAggregator : [];  

  console.log('[FIGMA][GETTEXTS] end. found: ', textList)

  figma.ui.postMessage({
      type: 'getText',
      data: textList
  })
}



const getText = (params) => {
  const frame = getFrame(params);
  
  for (const child of frame.children) {
    if (child.type === 'TEXT' && child.id === params.id) {
      return child;
    }
  }
}

const changeText = (params) => {
  const text = getText(params);
  const newCharacters = params.characters;

  text.characters = newCharacters;
}



// This shows the HTML page in "ui.html".
figma.showUI(__html__, {
  width: 600,
  height: 520
});

const ROOTPAGES = getPages()
// send pages list at startup
figma.ui.postMessage({ type: 'getPages', data: ROOTPAGES })

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  console.log('[FIGMA] arrived message: ', msg.type, msg)

  // retrieve frame handler  
  if (msg.type === 'retrieveFrames') {
    if (msg.id) getFrames({id: msg.id, type: 'FRAME'});
  }

  if (msg.type === 'retrieveText') {
    if (msg.selected) getTextsTraverse(msg.selected);
  }

  if (msg.type === 'retrievePages') {
    figma.ui.postMessage({ type: 'getPages', data: ROOTPAGES })
  }

  if (msg.type === 'changeText') {
    if (msg.id) changeText(msg);
  }


  // if (msg.type === 'create-rectangles') {
  //   const nodes: SceneNode[] = [];
  //   for (let i = 0; i < msg.count; i++) {
  //     const rect = figma.createRectangle();
  //     rect.x = i * 150;
  //     rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
  //     figma.currentPage.appendChild(rect);
  //     nodes.push(rect);
  //   }
  //   figma.currentPage.selection = nodes;
  //   figma.viewport.scrollAndZoomIntoView(nodes);
  // }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
}
