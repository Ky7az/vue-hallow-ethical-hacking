<template>
    <nav class="navbar navbar-expand-lg" style="background-color: #1d2024;">
        <a class="navbar-brand ms-4" href="#">Hallow</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav-collapse" aria-controls="nav-collapse" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="nav-collapse">
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <router-link class="nav-link" to="/soup">Soup</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/watch">Watch</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/pentest">Pentest</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/writeup">Writeup</router-link>
                </li>
            </ul>
            <ul class="navbar-nav me-4">
                <Login/>
            </ul>
        </div>
    </nav>
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