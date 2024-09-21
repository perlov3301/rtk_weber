import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
// import App from './App.js';
import './index.css';
import {createApi, ApiProvider} from '@reduxjs/toolkit/query/react';


// data copy & pasted from https://pokeapi.co/api/v2/pokemon?limit=9
const fakePokemonListing = {
    count: 1126,
    next: "https://pokeapi.co/api/v2/pokemon?offset=9&limit=9",
    previous: null,
    results: [
        { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/",i:1 },
        { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/",i:"2" },
        { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/",i:"3" },
        { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/",i:"4" },
        { name: "charmeleon", url: "https://pokeapi.co/api/v2/pokemon/5/",i:"5" },
        { name: "charizard", url: "https://pokeapi.co/api/v2/pokemon/6/",i:"6" },
        { name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/",i:"7" },
        { name: "wartortle", url: "https://pokeapi.co/api/v2/pokemon/8/",i:"8" },
        { name: "blastoise", url: "https://pokeapi.co/api/v2/pokemon/9/",i:"9" },
    ],
};
//partial data of https://pokeapi.co/api/v2/pokemon/1/
const fakePokemonDetailData = {
  id: 1,
  name: "bulbasour",
  height: 7,
  weight: 69,
  types: [
    {
        slot: 1,
        type: { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" },
      },
      {
        slot: 2,
        type: { name: "poison", url: "https://pokeapi.co/api/v2/type/4/" },
      },
  ],
  sprites: {
    front_default:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
  },
  img_url: {
        base_url:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/",
    },
};

function simulateLoading() {
  return new Promise((resolve)=> setTimeout(resolve, 500));
}

const api= createApi({
  baseQuery: ()=> {},
  endpoints: build=> ({
    pokemonList: build.query({
      async queryFn(){
        await simulateLoading();
        return {data: fakePokemonListing }
      }
    }),
    pokemonDetail: build.query({
      async queryFn(){
        await simulateLoading();
        return {data: fakePokemonDetailData }
      }
    }),
  }),
});

const {usePokemonListQuery, usePokemonDetailQuery } = api;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <StrictMode>
      <ApiProvider api={api}>
        <App />
      </ApiProvider>
    </StrictMode>
);

function App() {
    const [selectedPokemon, selectPokemon]= 
        React.useState(undefined);
    return (
      <>
        <header>
          <h1>my Pokedex</h1>
        </header>
        <main>
          {selectedPokemon ? (
            <>
              <PokemonDetails i={selectedPokemon.i} />
              <button className="button_back"
                  onClick={()=> selectPokemon(undefined)}>
                back
              </button>
            </>
          ) : (
            <PokemonList onPokemonSelected={selectPokemon} />
          ) }
        </main>
      </>
    );
  }
function PokemonList({ onPokemonSelected }) {
    const {data, isLoading, isError, isSuccess } = usePokemonListQuery();
    if (isLoading) { return "loading" }
    if (isError) { return "something went wrong" }
    if (isSuccess) {
      return (
        <article>
          <h2>Overwiev</h2>
          <ol start={1}>
            {data.results.map((pokemon)=> (
              <li key={pokemon.name}>
                {/* <button onClick={()=> onPokemonSelected(pokemon.i)}> */}
                <button onClick={()=> onPokemonSelected(pokemon.i)}>
                  {pokemon.name}
                </button>
              </li>
            ))}
          </ol>
        </article>
      );
    }

    
}
const listFormatter= new Intl.ListFormat("en-GB", {
    style: "short",
    type: "conjunction"
  });
function PokemonDetails({ i }) {// try i
  const { data, isLoading, isError, isSuccess }= usePokemonDetailQuery();
    if (isLoading ) { return "loading..."; }
    if (isError ) {return "something went wrong"; }
    if (isSuccess) {
    const url_i= data.img_url.base_url + 9+'.png';

      return (
        <article>
          <h2>{data.name} </h2>
          <img src={url_i} alt={data.name} />
          {/* <img src={data.sprites.front_default } alt={data.name} /> */}
          <ul>
            <li>id: {data.id} </li>
            <li>height: {data.height} </li>
            <li>weight: {data.weight} </li>
            <li> types:
              {listFormatter.format(data.types.map(
                (item)=> item.type.name
              ))}
            </li>
          </ul>
        </article>
      );
    }
}