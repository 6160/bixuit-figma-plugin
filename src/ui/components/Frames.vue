<template>
  <div>
    <ol>
      <li
        v-on:click="displaySomething"
        v-for="(frame, index) in $store.getters.frames"
        v-bind:key="index"
        v-bind:id="frame"
      >{{frame}}</li>
    </ol>
    <a href>{{$store.getters.content}}</a>
  </div>
</template>

<script>
export default {
  methods: {
    displaySomething: function() {
      this.$store.commit("addSomething", Math.random(1, 10));
    }
  }
};
</script>
