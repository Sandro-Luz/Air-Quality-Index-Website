<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchEstate, countries, fetchCity, fetchAqi, fetchNews } from '$lib/index';
    import Accordion from '../components/accordion.svelte';
    let button: any;
    let country_selected = '';
    let estates: String[] = [];
    let estates_selected= '';
    let cities: String[] = [];
    let cities_selected = '';
    let aqi: any = [];
    let aqius: number;
    let mainus: String = "";
    let ts:any;
    let newsArticle : any[] = [{
        "title" : String,
        "url" : String,
        "thumbnail" : String,
        "source": String,
        "published": String
    }
    ];

    function formatTs(ts: any){
        return new Date(ts).toLocaleString();
    }

    function getAqiColor(aqius: number) {
        if (aqius >= 0 && aqius <= 50) return 'green';
        if (aqius >= 51 && aqius <= 100) return 'yellow';
        if (aqius >= 101 && aqius <= 150) return 'orange';
        if (aqius >= 151 && aqius <= 200) return 'red';
        if (aqius >= 201 && aqius <= 300) return 'purple';
        if (aqius >= 301) return 'brown';
        return 'gray';  // Default color in case AQI is undefined
    }
    type PollutantKey = "o3" | "p2" | "p1" | "n2" | "co" | "s2";

    const pollutants: Record<PollutantKey, string> = {
        "o3": "O₃ (Ozone) - High ozone levels can irritate the respiratory system, aggravate asthma, and reduce lung function, especially during outdoor activities.",
        "p2": "PM2.5 (Fine Particulate Matter) - PM2.5 can penetrate deep into the lungs and even enter the bloodstream, causing respiratory and cardiovascular issues, and increasing the risk of heart and lung diseases.",
        "p1": "PM10 (Particulate Matter) - These particles can cause respiratory irritation, coughing, and worsened asthma symptoms. Long-term exposure can lead to more serious health problems.",
        "n2": "NO₂ (Nitrogen Dioxide) - Short-term exposure can irritate the airways, while prolonged exposure can reduce lung function and increase respiratory infections, particularly in children.",
        "co": "CO (Carbon Monoxide) - Carbon monoxide interferes with the body’s ability to transport oxygen, causing fatigue, chest pain, and impaired vision. High levels can be life-threatening.",
        "s2": "SO₂ (Sulfur Dioxide) - Short-term exposure can lead to respiratory problems, especially in people with asthma. It can also aggravate cardiovascular diseases."
    };

    let mainp: PollutantKey;

    function getPollutantDescription(mainp: PollutantKey): string {
    return pollutants[mainp] || "Unknown pollutant";
  }


    async function handleCountryChange(){
        if (country_selected){
            try {
                    const response = await fetchEstate(country_selected); // Call the function from index.
                    estates = response;
            } catch (error) {
                console.error('Failed to fetch estates:', error);
                return [];
            }
        }
    }


    async function handleCityChange() {
        if (estates_selected){
            try{
                cities = await fetchCity(country_selected, estates_selected);

            }
            catch(error) {
                console.error('Failed to fetch cities'), error;
            }
        }
    }
    
    async function handleAqi()
    {
        if (cities_selected){
            try{
                aqi = await fetchAqi(country_selected, estates_selected, cities_selected);
                if (aqi){
                    aqius = aqi.aqius;
                    mainus = aqi.mainus;
                    mainp = aqi.mainus;
                    ts = aqi.ts;
                    return {aqius, mainus};
                }
                else {
                console.error("Pollution data not found.");
                return null;
                }
            }
            catch(error){
                console.error('Failed to fetch Air quality index'), error;
            }
        }
    }

    async function news() {
        try{
            newsArticle = await fetchNews()
        }
        catch(error){
            console.error('Failed to fetch news'), error;
        }
    }

    onMount(() => {
        news()
        // If you want, you can initialize the widget here when the component mounts
    });  // place files you want to import through the `$lib` alias in this folder
</script>

<body>
    <main>
        <section id="herobanner">
            <div class="hero">
                <div class="title">
                    <h1>Indice de Qualidade do Ar</h1>
                    <p>Vê a qualidade do ar em qualquer parte do Mundo!</p>
                </div>
                <div class="map">
                    <div name="airvisual_widget" key="66f3df862ac593fbfd3585a1"></div>
                        <script type="text/javascript" src="https://widget.iqair.com/script/widget_v3.0.js"></script>
                    <div name="airvisual_widget" key="66f2ec43acf59a05869c6547"></div>
                        <script type="text/javascript" src="https://widget.iqair.com/script/widget_v3.0.js"></script>
                    <div name="airvisual_widget" key="66f2ec8c1a17a429e0f75ac9"></div>
                        <script type="text/javascript" src="https://widget.iqair.com/script/widget_v3.0.js"></script>
                    <div name="airvisual_widget" key="66f2edb84b5cc941a485a0a3"></div>
                        <script type="text/javascript" src="https://widget.iqair.com/script/widget_v3.0.js"></script>
                    </div>
        </section>
        <section id="search_location">
            <div class="title">
                <h1>Introduz a tua cidade!</h1>
            </div>
            <div>
                <select id="country-field" bind:value={country_selected} on:change={handleCountryChange}>
                    <option>Select a country</option>
                    {#each countries as { country }}
                      <option value={country}>{country}</option>
                    {/each}
                </select>
                <select id="estate-field" bind:value={estates_selected} disabled={estates.length === 0} on:change={handleCityChange}>
                    <option>Select an Estate</option>
                    {#if country_selected}
                        {#each Object.values(estates) as states}}
                            <option value={states}>{states}</option>
                        {/each}
                    {/if}
                </select>
                <select id="estate-field" bind:value={cities_selected} disabled={cities.length === 0}>
                    <option>Select an City</option>
                    {#if cities.length >= 0}
                        {#each Object.values(cities) as city}}
                            <option value={city}>{city}</option>
                        {/each}
                    {/if}
                </select>             
                <button bind:this={button} on:click={handleAqi} class="button">
                    Submeter
                </button>
            </div>
            <div id="aqi-widget">
                <div class="cardContainer">
                    {#if aqius !== undefined}
                        <div class="card" style="background-color: {getAqiColor(aqius)}">
                            <h2>Indice de Qualidade do Ar</h2>
                            <h1>{aqius}</h1>     
                        </div>
                        <div class="card1">
                            <h2>Maiores poluidores</h2>
                            <h3>{mainus}</h3>
                        </div>
                        <div class="card2">
                            <h2>Hora de atualização</h2>
                            <h3>{formatTs(ts)}</h3>
                        </div>
                        <div class="card3" id="pollutant">
                            <p>{getPollutantDescription(mainp)}</p>
                        </div>
                    {/if}
                </div>
                
            </div>
            
        </section>
         <section id="sec3">
            <div class="container1">
                <div class="row">
                    <h1>How does the AQI work?</h1>
                </div> 
                <div class="row1"> 
                    <p>
                        The higher the AQI value, the greater the level of air pollution and the greater the health concern.
                    </p>
                    <img src="../src/lib/assets/Screenshot 2024-10-02 at 11-25-53 Does Air Quality Affect Asthma.png" alt="">
                </div>
            </div>
        </section>
        <section id="sec2">
            <div class="container">
                <div class="column1">
                    <h1>Why is Air Quality Index important?</h1>
                    <p class="par">Air Quality Index (AQI) is crucial because it helps us understand the quality of the air we breathe, impacting our health and well-being. Poor air quality can lead to respiratory issues, heart conditions, and other long-term health problems. Protecting our air also means safeguarding nature — plants, animals, and ecosystems rely on clean air to thrive. By being aware of the AQI, we not only protect ourselves but also contribute to preserving the balance of nature, ensuring that future generations can enjoy a healthier, more sustainable environment.</p>
                </div>
                <div class="column2">
                    <div class="img-comp-container">
                        <div class="img-comp-img">
                        <img src="../src/lib/assets/christian-wiediger-rpZHKBowuig-unsplash.jpg" width="100%" height="600" alt="">
                        </div>
                        <div class="img-comp-img img-comp-overlay">
                        <img src="../src/lib/assets/aleks-dahlberg-pVATCBKLH8w-unsplash.jpg"  alt="" width="100%" height="600">
                        </div>
                        <div class="img-comp-img img-comp-overlay2">
                            <img src="../src/lib/assets/t-i-m-e-l-o-r-d-TgvgRXcDZWY-unsplash.jpg"  alt="" width="100%" height="600">
                        </div>
                        <div class="img-comp-img img-comp-overlay3">
                            <img src="../src/lib/assets/sean-oulashin-KMn4VEeEPR8-unsplash.jpg" alt="" width="100%" height="600">
                        </div>
                    </div>
                </div>
            </div>
            
        </section>
        <section id="sec4" class="paralax">
            <div>
                <Accordion open={true}>
                    <span slot="head">Principais causas de má qualidade do ar?</span>
                    <div slot="details">
                        <p>Air pollution can be created by both manmade and natural sources. Natural sources include windblown or kicked-up dust, dirt and sand, volcanic smoke, and burning materials. Manmade sources, meaning that pollution is created by the actions of human beings, tend to be the leading contributor to air pollution in cities and are inherently more able to be influenced by regulations. Manmade sources primarily include various forms of combustion, such as from gas-powered transportation (planes, trains, and automobiles) and industrial businesses (power plants, refineries, and factories), biomass burning (the burning of plant matter or coal for heating, cooking, and energy), and agriculture.
                            The contribution of various air pollution sources to a location’s air quality is highly dependent on the city’s location and regulations. Each location has its own mix of contributors and pollutants. Sources are commonly categorized into the following:
                        </p>
                    </div>
                </Accordion>
                <Accordion>
                    <span slot="head">Industria</span>
                    <div slot="details">
                        <p>
                            Industry includes pollution from facilities such as manufacturing factories, mines, and oil refineries as well as coal power plants and boilers for heat and power generation.
                            Industrial activity is a major global source of nitrogen oxides (NOx), hydrogen sulfide, volatile organic compounds (VOCs), and particulate matter, all of which contribute to ozone and smog.
                        </p>
                    </div>
                </Accordion>
                <Accordion>
                    <span slot="head">Agricultura</span>
                    <div slot="details">
                        <p>
                            The heavy use of fertilizers on agricultural land is a significant contributor to fine-particulate air pollution. A study in Geophysical Research Letters found that pollution generated from farms outweighed all other manmade sources of PM in much of the United States, Europe, Russia, and China.2
                            Globally, agricultural land use is on the rise due to an increased demand for animal products and per capita food.
                        </p>
                    </div>
                </Accordion>
                <Accordion>
                    <span slot="head">Transportes</span>
                    <div slot="details">
                        <p>
                            Air pollution from transport refers primarily to fuel combustion in motor vehicles, such as in cars, trucks, trains, planes, and ships. Transport emissions are a major contributor to elevated levels of fine particulate matter (PM2.5), ozone, and nitrogen dioxide (NO2).
                            The majority of emissions from transportation occur in the world’s top vehicle markets, as there tends to be a strong correlation between per capita transport emissions and incomes. As standards of living and economic activity increases, so too does the demand for transportation.3
                        </p>
                    </div>
                </Accordion>
                <Accordion>
                    <span slot="head">Fontes Naturais</span>
                    <div slot="details">
                        <p>
                            Air pollution from transport refers primarily to fuel combustion in motor vehicles, such as in cars, trucks, trains, planes, and ships. Transport emissions are a major contributor to elevated levels of fine particulate matter (PM2.5), ozone, and nitrogen dioxide (NO2).
                            The majority of emissions from transportation occur in the world’s top vehicle markets, as there tends to be a strong correlation between per capita transport emissions and incomes. As standards of living and economic activity increases, so too does the demand for transportation.3
                        </p>
                    </div>
                </Accordion>
                <Accordion>
                    <span slot="head">Doméstico</span>
                    <div slot="details">
                        <p>
                            Air pollution from transport refers primarily to fuel combustion in motor vehicles, such as in cars, trucks, trains, planes, and ships. Transport emissions are a major contributor to elevated levels of fine particulate matter (PM2.5), ozone, and nitrogen dioxide (NO2).
                            The majority of emissions from transportation occur in the world’s top vehicle markets, as there tends to be a strong correlation between per capita transport emissions and incomes. As standards of living and economic activity increases, so too does the demand for transportation.3
                        </p>
                    </div>
                </Accordion>
                <Accordion>
                    <span slot="head">Fogos e Queimadas a céu aberto</span>
                    <div slot="details">
                        <p>
                            Air pollution from transport refers primarily to fuel combustion in motor vehicles, such as in cars, trucks, trains, planes, and ships. Transport emissions are a major contributor to elevated levels of fine particulate matter (PM2.5), ozone, and nitrogen dioxide (NO2).
                            The majority of emissions from transportation occur in the world’s top vehicle markets, as there tends to be a strong correlation between per capita transport emissions and incomes. As standards of living and economic activity increases, so too does the demand for transportation.3
                        </p>
                    </div>
                </Accordion>
            </div>
        </section>
        <section id="sec5">
            <div class="carousel">
                <h1>Notícias recentes</h1>
                <div class="card-container" >
                    {#each newsArticle as article}
                    <div class="cards">
                        <img src="{article.thumbnail}" alt="{article.title}" style="width:150px;height:100px;"/>
                        <h5>{article.title}</h5>
                        <p>Source: {article.source}</p>
                        <p>Published: {formatTs(article.published)}</p>
                        <a href="{article.url}" target="_blank">Read more</a>
                    </div>
                    {/each}
                </div>
            </div>
        </section>
        <footer id="footer">
            <p>Developed by Colmeia Web Studio</p>
        </footer>
    </main>
</body>

<style>
    section {
        height: 100%;
        width: 100%;
    }

   .hero {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 90vh;
    background-image: url('/src/lib/assets/stacked-peaks-haikei.svg');
    background-size: cover;
    background-position: center;
    }

    @keyframes rotate{
        100%{
            background-position: 15% 90%;
        }
    }

    .map{
        flex: 1;
        width: 50%;
    }

    .title {
        flex: 1;
        font-size:x-large;
        width: 50%;
        margin: 30px;
        color: white;
        padding-left: 150px;
        text-align: justify;
        text-justify: inter-word;
    }
    #footer {
        background-color: hsl(0, 0%, 13%);
        height: 100px;
        width: 100%;
        padding-left: 5%;
        display: flex;
        justify-content: start;
        align-items: center;
        color: white;
    }

    button{
        background-color: black;
        padding: 10px;
        margin: 10px;
        transition: .3s;
    }

    button:active{
        background-color: green;
        transform: scale(0.8);
    }

    #search_location {
        display: flex;
        flex-direction: column;
        padding: 50px;
        height: 90vh;
        width: 100%;
        align-items: center;
        justify-content: center;
        background-color: #C4C5BA;  
    }
    
    #sec2{
        width: 100%;
        height: 100%;
        padding-bottom: 0px;
        background-image: url('../lib/assets/blob-scene-haikei.svg');
        background-size: cover;
        animation: rotate 6s infinite alternate linear;
    }

    #sec3{
        height: 100%;
        width: 100%;
        padding-top: 30px;
        display: flex;
        background-color: #C4C5BA;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    #sec4{
        height: 100%;
        width: 100%;
        padding: 10px;
        text-align: center;
        background-image: url('../lib/assets/christian-wiediger-rpZHKBowuig-unsplash.jpg');
        color: white;
    }

    #sec5{
        width: 100%;
        height: 90vh;
        background-color: #C4C5BA;
    }

    .row{
        width: 100%;
        padding: 20px;
        justify-content: center;
        justify-items: center;
    }

    .row1{
        width: 100%;
        padding: 20px;
        text-align: center;
        text-justify: inter-word;
    }
    .row1 p{
        padding: 10px;
    }

    .row1 img{
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 50%;
    }

    .container{
        display: flex;
        align-items: center;
    }

    .container1{
        flex-direction: row;
        align-items: center;
        justify-content: center;
        align-content: space-around;
    }

    @media (max-width: 800px) {
        .container1 {
            flex-direction: column;
        }
        .row{
            padding: 10px;
        }
        .row1{
            padding: 10px  ;
        }
    }

    @media (max-width: 800px) {
    .container {
        flex-direction: column;
        }
    }

    .column1{
        height: 100%;
        width: 50%;
        margin: 30px;
        padding: 50px;
        font-size: large;
        color: white;
        text-align: justify;
        text-justify: inter-word;
    }

    .column2{
        height: 100%;
        width: 50%;
    }

    #aqi-widget {
        width: 100%;
        min-height: 400px;
        margin: 20px;
    }

    .cardContainer{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
    }
    .card, .card1, .card2{
        width: 33.3333%;
        align-content: center;
        height: 175px;
        margin: 10px;
        padding: 20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        transition: 0.3s;
        border: 1px solid gray;
        animation: float 6s ease-in-out infinite;
    }
    .card3{
        width: 100%;
        flex-grow: 4;  
    }

    @keyframes float {
	0% {
		box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
		transform: translatey(0px);
	}
	50% {
		box-shadow: 0 25px 15px 0px rgba(0,0,0,0.2);
		transform: translatey(-20px);
	}
	100% {
		box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
		transform: translatey(0px);
	}
    }

    .card2{
        background-color:  #E4E4DE;
    }

    .card:hover, .card1:hover, .card2:hover{
        box-shadow: 0 16px 32px 0 rgba(0, 0, 0, 0.2);
    }


    .paralax{
        min-height: 500px;
        background-attachment: fixed;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    * {
            box-sizing: border-box;
        }

        .img-comp-container {
            position: relative;
            width: 100%;
            height: 600px; /* Set to match your image size */
            overflow: hidden;
        }

        .img-comp-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            transition: width 1s ease-in-out; /* Smooth transition */
        }

        .img-comp-img img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;

        }

        .img-comp-overlay {
            width: 40%; /* Start with half the image */
            transition: 1s ease-in-out;
            z-index: 2;
            top: 0%;
            height: 33.33333%;
       
        }

        .img-comp-overlay:hover {
            width: 100%;
            height: 100%;
             /* Ensure it is above the background image */
        }
        .img-comp-overlay2 {
            width: 40%; /* Start with half the image */
            height: 33.3333%;
            top:33.33333%;
            transition: 1s ease-in-out;
            z-index: 1;
        
        }

        .img-comp-overlay2:hover {
            width: 100%;
            height: 100%;
            top: 0%;
            z-index: 2;
             /* Ensure it is above the background image */
        }
        .img-comp-overlay3 {
            width: 40%; /* Start with half the image */
            height: 33.4%;
            top: 66.6666%;
            transition: 1s ease-in-out;
        }

        .img-comp-overlay3:hover {
            width: 100%;
            top: 0%;
            height: 100%;
            z-index: 2;
            /* Ensure it is above the background image */
        }

        
       /*
* Prefixed by https://autoprefixer.github.io
* PostCSS: v8.4.14,
* Autoprefixer: v10.4.7
* Browsers: last 4 version
*/

 .carousel {
            width: 100%; /* Width of carousel */
            height: 100%;
            -ms-flex-line-pack: center;
                align-content: center;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center; /* Height of carousel */
        }
        .carousel h1 {
            width: 50%;
            color: black;
            text-align: start;
            padding: 20px;
            border-bottom: 5px ridge black;
        }

        .cards{
            min-width: 250px;
            height: 50vh;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            background: rgb(0,0,0);
            background: -webkit-gradient(linear, left bottom, left top, from(rgba(0,0,0,1)), color-stop(35%, rgba(89,95,57,1)), to(rgba(196,197,186,1)));
            background: -o-linear-gradient(bottom, rgba(0,0,0,1) 0%, rgba(89,95,57,1) 35%, rgba(196,197,186,1) 100%);
            background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(89,95,57,1) 35%, rgba(196,197,186,1) 100%); 
            color: white;
            padding: 20px;
            -webkit-box-sizing: border-box;
                    box-sizing: border-box;
            border-radius: 8px;
        }

        .cards:hover{
            -webkit-animation: float 2.5s ease-in-out infinite;
                    animation: float 2.5s ease-in-out infinite; 
        }

        .card-container {
            width: 100%; /* Width of card container */
            padding: 20px 20px 20px 40px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: horizontal;
            -webkit-box-direction: normal;
                -ms-flex-direction: row;
                    flex-direction: row;
            overflow-x: scroll; /* Set overflow in horizontal scroll */
            overflow-y: hidden; /* Hidden overflow in vertical scroll */
            -ms-scroll-snap-type: x mandatory;
                scroll-snap-type: x mandatory; /* Force the scroll to snap to the start of a scroll-snap area */
            gap: 5%;
            margin: 20px 0;
            scroll-behavior: smooth;
        }

        
        .card-container::-webkit-scrollbar{
            display: none;
        }
        
</style>