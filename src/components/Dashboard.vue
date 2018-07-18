<template>
  <div>
    <Navbar/>
    <Alert></Alert>
    <div class="container-fluid">
      <div class="row">
        <Sidebar/>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Alert from './AlertMsg';

export default {
  components: {
    Sidebar, 
    Navbar,
    Alert,
  },
};

</script>

<style>
body{
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "sans-serif", "Apple Color Emoji", 
  "Segoe UI Emoji", "Segoe UI Symbol", \5FAE\8EDF\6B63\9ED1\9AD4;
}
</style>