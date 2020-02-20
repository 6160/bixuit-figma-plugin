<template>
  <div style="overflow: hidden; height:768px">
      <b-breadcrumb  v-on:click="previous" :items="$store.getters.listHeader"></b-breadcrumb>
    <!-- <div v-on:click="previous">{{ $store.getters.listHeader}}</div> -->
    <div id="container" style="display: inline-flex;width: 100%; ">
      <div id="list" style="height: 700px; width: 200px;overflow: auto;">
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
      <div id="text" class="w-100 p-3 bg-secondary text-light" style="height: 700px;overflow: auto">
        <ol>
          <li
            v-for="(item, index) in $store.getters.texts"
            v-bind:key="index"
            v-bind:id="item.id"
            v-bind:name="item.name"
          >
              <b-form-input  v-on:keyup.enter="changed" name="text" v-bind:value="item.text" v-bind:id="item.id"/>
          </li>
        </ol>
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
