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
    color: #e1d9d1;
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

a:link { 
    text-decoration: none; 
}

.vue-tags-input {
    max-width: 100% !important;
    flex: 1 1 auto !important;
    background: #212529 !important;
}

.vue-tags-input .ti-input {
    padding: 1px !important;
    border-color: #495057 !important;
}

.vue-tags-input .ti-new-tag-input {
    background-color: transparent !important;
}

.vue-tags-input .ti-tag {
    background: #f55151 !important;
    color: #ffffff !important;
}

.vue-tags-input .ti-item.ti-selected-item {
    background: #f55151 !important;
}

.vue-tags-input .ti-deletion-mark {
    background: #f5b351 !important;
}

.vue-tags-input .ti-autocomplete {
    background: #212529 !important;
    border-color: #495057 !important;
}
</style>