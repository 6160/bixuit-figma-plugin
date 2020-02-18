<template>
  <div id="app">
    <Display/>
    <Frames/>
  </div>
</template>

<script>
import Display from './components/Display'
import Frames from './components/Frames'

export default {
  name: 'App',
  components: {
    Display,
    Frames
  }
}
</script>
