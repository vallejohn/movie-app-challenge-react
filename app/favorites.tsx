import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { getFavorites } from "./_database";
import Movie from "./models/movie";
import styles from "./styles";

const Stack = createNativeStackNavigator();

const API_KEY = "b9bd48a6";
const SEARCH_TERM = "batman";

export default function FavoritesScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Favorites"
        component={Body}
      />
    </Stack.Navigator>
  );
}

function Body() {
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(50), (val, index) => ({
    label: (currentYear - index).toString(),
    value: currentYear - index,
  }));

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("batman");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedYear, setYear] = useState(null);
  const [selectedSortingMethod, setSelectedSortingMethod] = useState("ASC");
  const [sortType, setSortType] = useState("Title");


  const fetchMovies = async (query: string, year: any, pageNumber: number) => {
    console.log('fetching movies:::', pageNumber)
    if (!query) return;

    setLoading(true);

    var yearParam = ``;
    if (year != null || year != 0) {
      yearParam = `&y=${year}`;
    }

    setLoading(true);

    let savedMoviesRaw = await getFavorites();
    console.log('saved favorites', savedMoviesRaw);

    let savedMovies: Movie[] = savedMoviesRaw.map((item: any) => ({
      imdbID: item.imdbID,
      Year: item.Year,
      Poster: item.Poster,
      Title: item.Title,
      Type: item.Type
    }));

    setMovies(savedMovies);
    setLoading(false);

  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.trim().length > 0) {
        setPage(1)
        fetchMovies(search, selectedYear, 1);
      } else {
        setMovies([])
      }
    }, 500)

    return () => {
      clearTimeout(handler);
    }
  }, [search]);

  const loadMore = () => {
    console.log('loading more:::');
    console.log('movie length: ', movies.length);
    console.log('total results: ', totalResults);
    console.log('loading: ', loading);

    if (movies.length < totalResults && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(search, selectedYear, nextPage)
    }
  };

  const onUpdateYear = (item: any) => {
    console.log("Year is updated", item)
    setYear(item.value)
    setPage(1);
    fetchMovies(search, item.value, 1)
  }

  const onSortList = (method: string, type: string) => {
    setSortType(type);
    setSelectedSortingMethod(method);

    let sortedMovies: Movie[] = [];

    if (type == "Year") {
      if (method == "ASC") {
        sortedMovies = movies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year))
      } else {
        sortedMovies = movies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year))
      }
    }

    if (type == "Title") {
      if (method == "ASC") {
        sortedMovies = movies.sort((a, b) => parseInt(a.Title) - parseInt(b.Title))
      } else {
        sortedMovies = movies.sort((a, b) => parseInt(b.Title) - parseInt(a.Title))
      }
    }

    setMovies(sortedMovies);
  }

  const renderItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity style={styles.item} onPress={() => router.push(`/details/${item.imdbID}`)}>
      <ImageBackground
        source={{ uri: item.Poster }}
        style={[styles.item, { margin: 0 }]}
        imageStyle={{ borderRadius: 10 }}
      >
        <View style={styles.overlay}>
          <Text style={{ color: "#ffff", fontSize: 12, fontWeight: "bold" }}>{item.Title}</Text>
          <Text style={{ color: "#ffff", fontSize: 10 }}>{item.Year}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginTop: 50, marginHorizontal: 20 }}>
      <FlatList
        data={movies}
        numColumns={3}
        keyExtractor={(item) => item.imdbID}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          loading ? <ActivityIndicator size="large" /> : null
        }
      />
    </View>
  );
}