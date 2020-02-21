<template>
  <div style="overflow: hidden; height:1024px">
      <b-breadcrumb  v-on:click="previous" :items="$store.getters.listHeader"></b-breadcrumb>
    <!-- <div v-on:click="previous">{{ $store.getters.listHeader}}</div> -->
    <div id="container" style="display: inline-flex;width: 100%; ">
      <div id="list" style="height: 980px; width: 200px;overflow: auto; font-size: 12px">
        <b-list-group name='LIST'>
          <b-list-group-item
            v-on:click="loadList"
            v-for="(item, index) in $store.getters.list"
            v-bind:key="index"
            v-bind:id="item.id"
            v-bind:name="item.name"
          >{{item.name}}</b-list-group-item>
        </b-list-group>
      </div>
      <div v-if="$store.getters.texts.length" id="text" class="w-100 p-3 bg-secondary text-light" style="height: 980px;overflow: auto;display: inline-flex;flex-wrap: wrap;justify-content: center;">
        <div >
          <img :src="$store.getters.frameImg" style="max-width: 100%; padding-bottom: 15px; padding-right: 15px;">
        </div>
        <div style="flex-grow: 2;">
          <ul style="list-style-type: none;padding: 0; margin: 0;">
            <li
              v-for="(item, index) in $store.getters.texts"
              v-bind:key="index"
              v-bind:id="item.id"
              v-bind:name="item.name"
              style="padding-bottom: 3px;"
            >
                <b-form-textarea size="sm" rows="3" max-rows="6" v-on:keyup.ctrl.enter="changed" name="text" v-bind:value="item.text" v-bind:id="item.id"/>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="w-100 p-3 bg-secondary text-dark" style="height: 980px;overflow: auto"> 
        <b-card
          title="HELLO!"
          img-src="https://i.imgur.com/0aVRBYA.png"
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 25rem;"
          class="mb-2"
        >
          <b-card-text style="font-size: 12px">
            Just a quick introduction:
            <il>
              <li> Navigate pages and artboards with the list on the left.</li>
              <li>Edit the text in the text area of selected artboard and then save to Figma with <b>ctrl+enter</b>.</li>
            </il>
          </b-card-text>

        </b-card>
      </div>
    </div>
    <div> {{$store.getters.lastChange}}</div>
  </div>
</template>


<script>
import connector from '../connector/figma';

const levelMapping = {
  0: "getPages",
  1: "getFrames",
  2: "getText"
};

// messages from FIGMA
onmessage = (event) => connector.parseMessage(event);

export default {
  methods: {
    changed: function(event) {
      const params = {
        id: event.target.id, 
        characters: event.target.value
      };

      this.$store.commit('changeText', params);
    },
    previous: function() {
      this.$store.commit("back");
      const step = this.$store.getters.current;
      this.$store.commit(step.method, step.id);
      console.log('[UI][PREVIOUS ####] list header: ', this.$store.getters.listHeader)
    },
    loadList: function(event) {
      const step = this.$store.getters.current;
      const texts = this.$store.getters.texts;

      const method = levelMapping[step.level + 1];

      if (this.$store.getters.level === 2) return;
      
      this.$store.commit(method, {id: event.target.id, name: event.target.textContent});
      console.log('[UI][NEXT ####] list header: ', this.$store.getters.listHeader)
    }
  }
};
</script>
