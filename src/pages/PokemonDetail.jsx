import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import HeaderPokeball from "../components/layouts/HeaderPokeball";

const PokemonDetail = () => {

  const [pokemon, setPokemon] = useState(null)
 const {pokemonId}= useParams ();

 const getPercentStat = (statValue) => {
  const MAX_STAT_VALUE = 255;
  const percentStat = ((statValue*100) / MAX_STAT_VALUE).toFixed(1);
  return `${percentStat}%`
 }


 useEffect(()=> {
  axios
  .get( `https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
  .then (({data}) => setPokemon(data))
  .catch ((err) => console.log(err)) 
 }, [])





  return (
   <main className=" text-center capitalize font-bold ">
    <HeaderPokeball/>
    <article className="max-w-[500px] py-10 px-2 mx-auto border-2 border-gray-300 
    shadow-2xl rounded-lg  ">
      <header className="max-w-[190px] mx-auto block" >
      <img src={pokemon?.sprites.other["official-artwork"].front_default} alt="" />
      </header>
      <h3 >#{pokemon?.id}</h3>
      <h2 className="text-3xl text-gray-500">{pokemon?.name}</h2>
      {/*Stats*/}
      <section>
        <h3 className="text-start text-2xl">Stats</h3>
        <ul className="grid gap-4">
          {
            pokemon?.stats.map((stat) => (
               <li className="capitalize" key={stat.stat.name}>
              <div className="flex justify-between items-center">
                <h5>{stat.stat.name}</h5>
                <span>{stat.base_stat}/255</span>
              </div>
               {/*Total Bar*/}
               <div className="bg-slate-200 rounded-md h-6">
                 {/*Bar Progress*/}
                 <div style={{width: getPercentStat(stat.base_stat)}} 
                 className={"bg-yellow-400 h-full rounded-md"}></div>

               </div>
             

            </li>))
          }
        </ul>
      </section>
    </article>

   </main>
  )
}

export default PokemonDetail