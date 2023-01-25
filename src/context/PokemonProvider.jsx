import { useEffect, useState } from "react";
import { PokemonContext } from "./PokemonContext";

const PokemonProvider = ({ children }) => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const getPokemonByLimit = async (limit = 50) => {
    const baseUrl = "https://pokeapi.co/api/v2/";
    const data = await (
      await fetch(`${baseUrl}pokemon?limit=${limit}&offset=${offset}`)
    ).json();
    const pokemonPromises = data.results.map(async (pokemon) => {
      const data = await (await fetch(pokemon.url)).json();
      return data;
    });
    const results = await Promise.all(pokemonPromises);
    setAllPokemons(results);
  };

  useEffect(() => {
    getPokemonByLimit();
  }, []);

  return (
    <PokemonContext.Provider
      value={{
        numero: 0,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export default PokemonProvider;
