import Vue from 'vue'
import Vuex from 'vuex'
import connector from '../connector/figma'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navigation: [{id: '', method:'getPages', level: 0}],
    listHeader: ['PAGES'],
    list: [],//connector.getPages(),
    texts: [],
    lastChange: '',
    selected: {
      page: '',
      frame: '',
    }
  },
  mutations: {
    initList(state) {
      state.list = connector.getPages();
      state.listHeader = 'PAGES';
      state.currentLevel = 0;
    },
    getPages(state) {
      // state.list = pages;
      state.listHeader = ['PAGES'];
      state.navigation.push({id: '', method:'getPages', level: 0});
      connector.retrievePages();
    },
    savePages(state, pages) {
      state.list = pages;
    },
    getFrames(state, page) {
      // console.log('getting frames from figma, page: ', page)
      state.selected.page = page.id; 
      // asking frames to figma
      connector.retrieveFrames(state.selected);
      state.listHeader.push(page.name);
      state.navigation.push({id: page,  method:'getFrames', level: 1});
      
    },
    saveFrames(state, frames) {
      // console.log('saving frames from figma: ', frames.length);
      state.list = frames
      // saving frames coming from figma
    },
    getText(state, frame) {
      if (state.selected.frame) state.listHeader.pop();
      state.selected.frame = frame.id;
      connector.retrieveText(state.selected);
      // console.log(connector.getText(frame))
      state.listHeader.push(frame.name)
      
      state.currentLevel = 2;
    },
    saveText(state, text) {
      // console.log('saving text from figma: ', text.length);
      state.texts = text;
    },
    back(state) {
      state.navigation.pop();
      state.listHeader.pop();
    },
    changeText(state, data) {
      // console.log('TEXT', data.text)
      state.lastChange = data.text;
      const params = {
        selected: state.selected,
        id: data.id,
        characters: data.characters,
      }
      // console.log('CHANGETEXT params: ', params)
      connector.changeText(params);
    }
  },
  getters: {
    list: state => state.list,// Object.keys(state.list.pages)
    listHeader: state => state.listHeader.join(' > '),
    texts: state => state.texts,
    level: state => state.currentLevel,
    current: state => state.navigation[state.navigation.length -1],
    lastChange: state => state.lastChange ? `Changed: ${state.lastChange}` : '',
  }
})
