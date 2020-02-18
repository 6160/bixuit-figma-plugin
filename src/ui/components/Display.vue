<template>
  <div>
    <div v-on:click="previous">{{ $store.getters.listHeader}}</div>
    <div id="container" style="display: inline-flex;">
      <div id="list">
        <ol>
          <li
            v-on:click="loadList"
            v-for="(item, index) in $store.getters.list"
            v-bind:key="index"
            v-bind:id="item.id"
            v-bind:name="item.name"
          >{{item.name}}</li>
        </ol>
      </div>
      <div id="text">
        <ol>
          <li
            v-for="(item, index) in $store.getters.texts"
            v-bind:key="index"
            v-bind:id="item.id"
            v-bind:name="item.name"
          >
            <input v-on:keyup.enter="changed" name="text" v-bind:value="item.text" v-bind:id="item.id"/>
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
      // console.log("changed: ", event.target.value);
      const params = {
        id: event.target.id, 
        characters: event.target.value
      };

      this.$store.commit('changeText', params)
    },
    previous: function() {
      this.$store.commit("back");
      const step = this.$store.getters.current;
      this.$store.commit(step.method, step.id);
    },
    loadList: function(event) {
      const step = this.$store.getters.current;
      const texts = this.$store.getters.texts;

      // console.log('STEP LEVEL ', step.level )
      // console.log('TEXT ', texts)
      // if (!texts.length >  0) return;
      const method = levelMapping[step.level + 1];

      if (this.$store.getters.level === 2) return;
      
      // console.log(event.target.textContent)
      // console.log(method);
      this.$store.commit(method, {id: event.target.id, name: event.target.textContent});

      // console.log(event.target.id);
    }
  }
};
</script>
