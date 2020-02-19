
// adding window postmessage listeners

import store from '@/store/index'

// callback fn
const parsePages = (pages) => {
    console.log('[UI][PARSEPAGES] parsing: ', pages);
    store.commit('savePages', pages);
}

const parseFrames = (frames) => {
    const parsed = [];

    frames.forEach(f => parsed.push({ id: f.id, name: f.text }));
    console.log('[UI][PARSEFRAMES] parsing: ', parsed);
    store.commit('saveFrames', parsed);
}

const parseText = (msg) => {
    console.log('[UI][PARSETEXT] parsing: ', msg);
    store.commit('saveText', msg);
}

// to figma
const retrievePages = (params) => {
    console.log('[UI][RETRIEVEPAGES] sending postMessage.');
    parent.postMessage({ pluginMessage: { type: 'retrievePages' } }, '*');

}

const retrieveFrames = (selected) => {
    console.log('[UI][RETRIEVEFRAMES] sending postMessage. selected: ', selected);
    parent.postMessage({ pluginMessage: { type: 'retrieveFrames', id: selected.page } }, '*');
}

const retrieveText = (selected) => {
    console.log('[UI][RETRIEVETEXT] sending postMessage. selected: ', selected);
    parent.postMessage({ pluginMessage: { type: 'retrieveText', selected } }, '*');
}


const changeText = (params) => {
    console.log('[UI][CHANGETEXT] sending postMessage. params: ', params);
    parent.postMessage({ pluginMessage: { type: 'changeText', params } }, '*');
}


const MAPPING = {
    getPages: parsePages,
    getFrames: parseFrames,
    getText: parseText,
};


const parseMessage = (msg) => {
    console.log('[UI][PARSEMESSAGE] received: ', msg);

    const pluginMessage = msg.data.pluginMessage;
    if (!pluginMessage || Object.keys(MAPPING).indexOf(pluginMessage.type) < 0) return;

    const type = pluginMessage.type;
    const data = pluginMessage.data;

    // uuuuuuuuuuhhhh
    MAPPING[type](data);
}

export default { parseMessage, retrievePages, retrieveFrames, retrieveText, changeText }
