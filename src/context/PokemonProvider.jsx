import { useEffect, useState } from "react";
import { useForm } from "../hooks/useForm";
import { PokemonContext } from "./PokemonContext";

const PokemonProvider = ({ children }) => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [globalPokemons, setGlobalPokemons] = useState([]);
  const [offset, setOffset] = useState(0);

  const { valueSearch, onInputChange, onResetForm } = useForm({
    valueSearch: "",
  });

  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);

  const getPokemonByLimit = async (limit = 50) => {
    const baseUrl = "https://pokeapi.co/api/v2/";
    const res = await fetch(
      `${baseUrl}pokemon?limit=${limit}&offset=${offset}`
    );
    const data = await res.json();
    const pokemonPromises = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      return data;
    });
    const results = await Promise.all(pokemonPromises);
    setAllPokemons([...allPokemons, ...results]);
    setLoading(false);
  };
  const getAllPokemons = async () => {
    const baseUrl = "https://pokeapi.co/api/v2/";
    const res = await fetch(`${baseUrl}pokemon?limit=100000&offset=0`);
    const data = await res.json();
    const pokemonPromises = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
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
  }, [offset]);

  const onClickLoadMore = () => {
    setOffset(offset + 50);
  };

  const [typeSelected, setTypeSelected] = useState({
    grass: false,
    normal: false,
    fighting: false,
    flying: false,
    poison: false,
    ground: false,
    rock: false,
    bug: false,
    ghost: false,
    steel: false,
    fire: false,
    water: false,
    electric: false,
    psychic: false,
    ice: false,
    dragon: false,
    dark: false,
    fairy: false,
    unknow: false,
    shadow: false,
  });

  const [filteredPokemons, setFilteredPokemons] = useState([]);

  const handleCheckbox = (e) => {
    setTypeSelected({
      ...typeSelected,
      [e.target.name]: e.target.checked,
    });
    if (e.target.checked) {
      const filteredResults = globalPokemons.filter((pokemon) =>
        pokemon.types.map((type) => type.type.name).includes(e.target.name)
      );
      setFilteredPokemons([
        ...filteredPokemons, ...filteredResults
      ]);
    }else{
      const filteredResults = filteredPokemons.filter((pokemon) =>
        !pokemon.types.map((type) => type.type.name).includes(e.target.name)
      );
      setFilteredPokemons([...filteredResults]);
    }
  };

  return (
    <PokemonContext.Provider
      value={{
        valueSearch,
        onInputChange,
        onResetForm,
        allPokemons,
        globalPokemons,
        getPokemonById,
        active,
        setActive,
        loading,
        setLoading,
        onClickLoadMore,
        handleCheckbox,
        filteredPokemons
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export default PokemonProvider;
