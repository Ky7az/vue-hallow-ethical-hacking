<template>
    <div id="app">
        <div id="nav">
            <Header/>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import Header from '@/components/Header'

export default {
    name: 'App',
    components: {
        Header
    }
}
</script>

<style>
#app {
    font-family: Calibri, Helvetica;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #000000;
}

.orange {
    color: #f55151;
}

.orange:hover {
    color: #f5b351;
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #ffffff;
}

#nav a.router-link-active {
    color: #f55151;
}

.card-overflow {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

</style>