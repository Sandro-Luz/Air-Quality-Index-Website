import axios from 'axios';
const aqi_key = import.meta.env.VITE_API_KEY_AQI;
const news_key = import.meta.env.VITE_NEWS_API_KEY;
export const countries = [{ "country": "Afghanistan" }, { "country": "Albania" }, { "country": "Algeria" }, { "country": "Andorra" }, { "country": "Anguilla" }, { "country": "Antarctica" }, { "country": "Argentina" }, { "country": "Armenia" }, { "country": "Australia" }, { "country": "Austria" }, { "country": "Azerbaijan" }, { "country": "Bahamas" }, { "country": "Bahrain" }, { "country": "Bangladesh" }, { "country": "Barbados" }, { "country": "Belgium" }, { "country": "Belize" }, { "country": "Benin" }, { "country": "Bermuda" }, { "country": "Bolivia" }, { "country": "Bosnia Herzegovina" }, { "country": "Brazil" }, { "country": "Brunei" }, { "country": "Bulgaria" }, { "country": "Burundi" }, { "country": "Cambodia" }, { "country": "Cameroon" }, { "country": "Canada" }, { "country": "Cayman Islands" }, { "country": "Chad" }, { "country": "Chile" }, { "country": "China" }, { "country": "Colombia" }, { "country": "Costa Rica" }, { "country": "Croatia" }, { "country": "Curacao" }, { "country": "Cyprus" }, { "country": "Czech Republic" }, { "country": "Democratic Republic of the Congo" }, { "country": "Denmark" }, { "country": "Djibouti" }, { "country": "Dominican Republic" }, { "country": "Ecuador" }, { "country": "Egypt" }, { "country": "El Salvador" }, { "country": "Estonia" }, { "country": "Ethiopia" }, { "country": "Finland" }, { "country": "France" }, { "country": "French Polynesia" }, { "country": "Gabon" }, { "country": "Gambia" }, { "country": "Georgia" }, { "country": "Germany" }, { "country": "Ghana" }, { "country": "Greece" }, { "country": "Greenland" }, { "country": "Grenada" }, { "country": "Guatemala" }, { "country": "Guinea" }, { "country": "Guyana" }, { "country": "Honduras" }, { "country": "Hong Kong SAR" }, { "country": "Hungary" }, { "country": "Iceland" }, { "country": "India" }, { "country": "Indonesia" }, { "country": "Iran" }, { "country": "Iraq" }, { "country": "Ireland" }, { "country": "Israel" }, { "country": "Italy" }, { "country": "Ivory Coast" }, { "country": "Jamaica" }, { "country": "Japan" }, { "country": "Jordan" }, { "country": "Kazakhstan" }, { "country": "Kenya" }, { "country": "Kosovo" }, { "country": "Kuwait" }, { "country": "Kyrgyzstan" }, { "country": "Laos" }, { "country": "Latvia" }, { "country": "Lebanon" }, { "country": "Libya" }, { "country": "Liechtenstein" }, { "country": "Lithuania" }, { "country": "Luxembourg" }, { "country": "Macao SAR" }, { "country": "Madagascar" }, { "country": "Malaysia" }, { "country": "Maldives" }, { "country": "Malta" }, { "country": "Mauritius" }, { "country": "Mexico" }, { "country": "Moldova" }, { "country": "Mongolia" }, { "country": "Montenegro" }, { "country": "Morocco" }, { "country": "Mozambique" }, { "country": "Myanmar" }, { "country": "Nepal" }, { "country": "Netherlands" }, { "country": "New Caledonia" }, { "country": "New Zealand" }, { "country": "Nicaragua" }, { "country": "Nigeria" }, { "country": "North Macedonia" }, { "country": "Norway" }, { "country": "Oman" }, { "country": "Pakistan" }, { "country": "Palestine" }, { "country": "Panama" }, { "country": "Paraguay" }, { "country": "Peru" }, { "country": "Philippines" }, { "country": "Poland" }, { "country": "Portugal" }, { "country": "Puerto Rico" }, { "country": "Qatar" }, { "country": "Romania" }, { "country": "Russia" }, { "country": "Rwanda" }, { "country": "San Marino" }, { "country": "Saudi Arabia" }, { "country": "Senegal" }, { "country": "Serbia" }, { "country": "Singapore" }, { "country": "Slovakia" }, { "country": "Slovenia" }, { "country": "South Africa" }, { "country": "South Korea" }, { "country": "Spain" }, { "country": "Sri Lanka" }, { "country": "Suriname" }, { "country": "Svalbard and Jan Mayen" }, { "country": "Sweden" }, { "country": "Switzerland" }, { "country": "Taiwan" }, { "country": "Tajikistan" }, { "country": "Tanzania" }, { "country": "Thailand" }, { "country": "Togo" }, { "country": "Trinidad and Tobago" }, { "country": "Turkey" }, { "country": "Turkmenistan" }, { "country": "U.S. Virgin Islands" }, { "country": "USA" }, { "country": "Uganda" }, { "country": "Ukraine" }, { "country": "United Arab Emirates" }, { "country": "United Kingdom" }, { "country": "Uruguay" }, { "country": "Uzbekistan" }, { "country": "Venezuela" }, { "country": "Vietnam" }, { "country": "Zambia" }, { "country": "Zimbabwe" }];

export async function fetchEstate(country_selected:string): Promise<String[]> {
        try{
            const response = await axios.get(
                `http://api.airvisual.com/v2/states?country=${encodeURIComponent(country_selected)}&key=${aqi_key}`
            );
            
            const states =  response.data.data.map((estate: { state: String }) => estate.state);
            console.log(response);
            return states;
            
        }
        catch (error){
            console.error('Error fetching estates');
            return [];
        }
}

export async function fetchCity(country_selected: string, estate_selected:string): Promise<String[]> {
    try{
        const response = await axios.get(
            `http://api.airvisual.com/v2/cities?state=${encodeURIComponent(estate_selected)}&country=${encodeURIComponent(country_selected)}&key=${aqi_key}`
        );
        const cities = response.data.data.map((city: {city: String}) => city.city ); // Should log true if it's an array.
        console.log(cities);
        return cities;
    }
    catch (error){
        console.error('Error fetching cities');
        return [];
    }
}

export async function fetchAqi (country_selected: string, estate_selected: string, city_selected: string): Promise<String[]> {
    try{
        const response = await axios.get(`http://api.airvisual.com/v2/city?city=${encodeURIComponent(city_selected)}&state=${encodeURIComponent(estate_selected)}&country=${encodeURIComponent(country_selected)}&key=${aqi_key}`
    );
    const aqiinfo = response.data.data.current.pollution;
    console.log(aqiinfo);
    return aqiinfo;
    } 
    catch(error) {
        console.error('Error fetching AQI --index ');
        return [];
    }
}

export async function fetchNews():Promise<String[]>{
    try{
        const response = await axios.get(`https://climate-news-feed.p.rapidapi.com/page/1?limit=10`,{
            headers: {
                'x-rapidapi-key': news_key,
                'x-rapidapi-host': 'climate-news-feed.p.rapidapi.com'
            }
        })
        console.log(response.data.articles)
        return response.data.articles
    }
    catch(error){
        console.log('Failed to get news'), error;
        return []
    }
}