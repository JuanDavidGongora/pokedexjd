import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import PokemonList from "../components/pokedex/PokemonList";
import HeaderPokeball from "../components/layouts/HeaderPokeball";
import { paginateData } from "../utils/pagination";


const Pokedex = () => {
  //?Aqui estan todos nuestros pokemons

 const [pokemons, setPokemons] = useState([])
 const [pokemonName, setPokemonName] = useState ("")
 const [types, setTypes] = useState([])
 const [currenType, setCurrentType] = useState ("")
 const [currentPage, setCurrentPage] = useState(1)


  const trainerName = useSelector ((store) => store.trainerName);

  const pokemonsByName = pokemons.filter((pokemon)=> pokemon.name.includes(pokemonName));

  const {itemsInCurrentPage, lastPage, pagesInCurrentBlock} = paginateData(
    pokemonsByName, 
    currentPage
    );
    
  const handleSubmit = (e) => {
      e.preventDefault()
      setPokemonName(e.target.pokemonName.value.toLowerCase().trim());
  };

  const handleChangeType = (e) => {
   setCurrentType(e.target.value)

  };
  

  const handlePreviusPage = () => {
    const newCurrentPage = currentPage - 1;
    if (newCurrentPage >= 1)  {setCurrentPage(newCurrentPage);}
  }

    const handleNextPage = () => {
      const newCurrentPage = currentPage + 1;
        if (newCurrentPage <= lastPage)  setCurrentPage(newCurrentPage);
};


//? Trae todos los pokemons

  useEffect (() => {
    if(currenType == "")
   { axios
      .get( "https://pokeapi.co/api/v2/pokemon?limit=1292")
      .then (({data}) => setPokemons(data.results))
      .catch ((err) => console.log(err)) 
}
  }, [currenType]);

//? Trae todos los types posibles para los pokemon

  useEffect (()=>{
    axios
    .get( "https://pokeapi.co/api/v2/type")
    .then (({data}) => setTypes(data.results))
    .catch ((err) => console.log(err)) 
  }, []);

  //?Tae todos los pokemons con base a un tipo

  useEffect(()=>{ 
    if (currenType !== "" ) {
      axios
      .get( `https://pokeapi.co/api/v2/type/${currenType}/`)
      .then (({data}) => {
        setPokemons(data.pokemon.map((pokemon)=> pokemon.pokemon));
      })
      .catch ((err) => console.log(err)) 
    }
  },[currenType]);

  //? reseteo pagina actual al cambiar de tipo

  useEffect (()=> {setCurrentPage(1)}, [currenType])

  return (
    <main>
      <HeaderPokeball/>
      <section>
        <p className="text-xl pb-12 pt-10 ">
          <span className="font-bold text-xl text-red-700 ">
            Welcome {trainerName },
          </span>
          here you can find your favorite pokemon
        </p>
        <form onSubmit={handleSubmit}> 
          <div className=" pb-12">
            <input className="drop-shadow-lg" name="pokemonName"type="text" placeholder="Search pokemon..."/> 
            <button className="bg-red-500 text-white shadow ">Search</button>
          </div>
          <select onChange={handleChangeType} className="capitalize drop-shadow-lg text-xl">
            <option value="">All pokemons</option>
            {types.map((type) =>(
              <option value={type.name} key={type.url}> {type.name} </option>))}
          </select>
        </form>
      </section>

      <ul className="flex justify-center gap-4 flex-wrap">
        {
          currentPage !== 1 && ( 
             <li>
            <button onClick={handlePreviusPage}>{"<"}</button>
           </li>
           )}

        {pagesInCurrentBlock.map((page) => (
        <li key={page}> 
        <button 
        onClick={()=> setCurrentPage(page)}
        className={`p-2 text-white 
        font-bold rounded-full ${currentPage == page ? "bg-red-700" : "bg-red-500"}`}>
          {page}
          </button>
        
        </li>
        ))}

      {
        currentPage !== lastPage && (
          <li>
          <button onClick={handleNextPage}>{">"}</button>
        </li>

        )
      }

      </ul>

      <PokemonList pokemons = {itemsInCurrentPage}/>


    </main>
  );
}

export default Pokedex;