<template>
    <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand href="/">Hallow</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <!-- <b-nav-item href="/">Home</b-nav-item> -->
                <b-nav-item to="/soup">Soup</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <Login/>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
import Login from '@/components/Login'

export default {
    name: 'Header',
    components: {
        Login
    }
}
</script>