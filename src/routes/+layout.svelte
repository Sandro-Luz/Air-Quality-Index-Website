<script>
    import '../app.css';
    import { onMount } from "svelte";
    import 'aos/dist/aos.css';
    // @ts-ignore
    import AOS from 'aos';
    import logo from '../lib/assets/Design-sem-nome.svg';

    onMount(() => {
        AOS.init({
            once: false, // Animation only runs once
            offset: 120,
        }
        );
    });
</script>

<nav>
    <a href="/" class="logo-container">
        <img src="{logo}" alt="logo" class="logo">
    </a>
    <div class="nav-links">
        <a href="/" class="refs">Home</a>
        <a href="/Contact" class="refs">Contacts</a>
    </div>
</nav>

<slot></slot>

<style>

:global(.logo) {
    cursor: pointer;
    height: 30px;
    width: 50px;
    transform: scale(4); /* Adjust scaling as necessary */
}

nav {
    display: flex;
    align-items: center;
    justify-content: space-between; /* Spread items to each side */
    padding: 20px;
    background: var(--bg-2);
    overflow: hidden;
}


.nav-links {
    display: flex;
    gap: 2em; /* Space between the links */
}

.refs {
    text-decoration: none;
    border: 0.5px solid;
    border-radius: 4px;
    padding: 5px;
    transition: 0.5s ease-out;
}

.refs:hover {
    box-shadow: 5px 5px 5px #C4C5BA;
}
</style>