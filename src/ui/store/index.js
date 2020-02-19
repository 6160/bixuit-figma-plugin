import Vue from 'vue'
import Vuex from 'vuex'
import connector from '../connector/figma'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navigation: [{id: '', method:'getPages', level: 0}],
    listHeader: ['PAGES'],
    list: [],
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
      state.listHeader = ['PAGES'];
      state.navigation.push({id: '', method:'getPages', level: 0});
      connector.retrievePages();
    },
    savePages(state, pages) {
      state.list = pages;
    },
    getFrames(state, page) {
      state.selected.page = page.id; 
      connector.retrieveFrames(state.selected);
      state.listHeader.push(page.name);
      state.navigation.push({id: page,  method:'getFrames', level: 1});
      
    },
    saveFrames(state, frames) {
      state.list = frames;
    },
    getText(state, frame) {
      if (state.selected.frame) state.listHeader.pop();
      state.selected.frame = frame.id;
      connector.retrieveText(state.selected);
      state.listHeader.push(frame.name);
      state.currentLevel = 2;
    },
    saveText(state, text) {
      state.texts = text;
    },
    back(state) {
      state.texts = [];
      state.navigation.pop();
      state.listHeader.pop();
    },
    changeText(state, data) {
      state.lastChange = data.text;
      const params = {
        selected: state.selected,
        id: data.id,
        characters: data.characters,
      }
      connector.changeText(params);
    }
  },
  getters: {
    list: state => state.list,
    listHeader: state => state.listHeader.join(' > '),
    texts: state => state.texts,
    level: state => state.currentLevel,
    current: state => state.navigation[state.navigation.length -1],
    lastChange: state => state.lastChange ? `Changed: ${state.lastChange}` : '',
  }
})
