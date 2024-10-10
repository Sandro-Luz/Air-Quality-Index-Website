<script>
    export let open = false;
      import { slide } from 'svelte/transition';
      const handleClick = () => open = !open
  </script>
  
  <div class="accordion">
      <div class="header">
          <div class="text">
              <slot name="head"></slot>	
          </div>
          
          <button on:click={handleClick} class="buttonacc">
              <img src="./src/lib/assets/add_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg" alt="">
          </button>
      </div>
      
      {#if open}
      <div class="details" transition:slide>
          <slot name="details">
          </slot>
      </div>
      {/if}
  </div>
  
  <style>
      div.accordion {
        margin: 1rem 0;
        margin-right: 150px;
        margin-left: 150px;
        border: 1px solid grey;
        border-radius: 10px;
        background-color: #C4C5BA;
        opacity: 0.77;
        color: black;
      }

      .buttonacc{
        background-color: transparent; 
      }

      .buttonacc img{
        width: 100%;
        height: 30px;
        transition: .2s;
        background-color: grey;
        border-radius: 5px;
      }

      .buttonacc img:active{
        rotate: 180deg;
        background-color: #C4C5BA;
      }

      @keyframes rotateButton {
        0%{
            transform: rotate(90deg);
        }
        100%{
            transform: rotate(0deg);
        }
      }



      div.header {
          display:flex;
          width:100%;
          align-items: center;
          justify-content: center;
      }
      
      div.header .text {
          flex: 1;
          margin-right: 5px;
      }
      
      div.details {
          background-color: #C4C5BA;
          padding:1rem;
          color: black;
      }
  </style>
  