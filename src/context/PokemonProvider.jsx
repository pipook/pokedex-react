import { useEffect, useState } from "react";
import { useForm } from "../hooks/useForm";
import { PokemonContext } from "./PokemonContext";

const PokemonProvider = ({ children }) => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [globalPokemons, setGlobalPokemons] = useState([])
  const [offset, setOffset] = useState(0);

  const { valueSearch, onInputChange, onResetForm } = useForm({
    valueSearch: "",
  });

  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);

  const getPokemonByLimit = async (limit = 50) => {
    const baseUrl = "https://pokeapi.co/api/v2/";
    const res = await fetch(`${baseUrl}pokemon?limit=${limit}&offset=${offset}`);
    const data = await res.json();
    const pokemonPromises = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url)
      const data = await res.json();
      return data;
    });
    const results = await Promise.all(pokemonPromises);
    setAllPokemons([...allPokemons, ...results]);
    setLoading(false);
  };
  const getAllPokemons = async () => {
    const baseUrl = "https://pokeapi.co/api/v2/";
    const res = await fetch(`${baseUrl}pokemon?limit=100000&offset=0`)
    const data = await res.json();
    const pokemonPromises = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url)
      const data = await res.json();
      return data;
    });
    const results = await Promise.all(pokemonPromises);
    setGlobalPokemons(results);
    setLoading(false);
  };

  const getPokemonById = async (id) => {
    const baseUrl = "https://pokeapi.co/api/v2/";
    const data = await (await fetch(`${baseUrl}pokemon/${id}`)).json();
    return data;
  };

  useEffect(() => {
    getAllPokemons();
  }, []);
  useEffect(() => {
    getPokemonByLimit();
  }, []);

  return (
    <PokemonContext.Provider
      value={{
        valueSearch,
        onInputChange,
        onResetForm,
        allPokemons,
        globalPokemons,
        getPokemonById,
        active
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export default PokemonProvider;
