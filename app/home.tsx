import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import Movie from "./models/movie";

import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import { onRequestMovieList } from "./apiClient";
import styles from "./styles";

const Stack = createNativeStackNavigator();

export default function HomeScreen() {
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(50), (val, index) => ({
    label: (currentYear - index).toString(),
    value: currentYear - index,
  }));

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedYear, setYear] = useState(null);
  const [selectedSortingMethod, setSelectedSortingMethod] = useState("ASC");
  const [sortType, setSortType] = useState("Title");


  const fetchMovies = async (query: string, year: any, pageNumber: number) => {
    setLoading(true);

    let responseData = await onRequestMovieList(query, year, pageNumber);

    if (!responseData) {
      setMovies([]);
      setTotalResults(0);
    } else {
      const responseMovies = Array.from(
        new Map(responseData.Search?.map((movie) => [movie.imdbID, movie])).values()
      );
      if (pageNumber == 1) {
        setMovies(responseMovies);
      } else {
        setMovies(movies => [...movies, ...responseMovies]);
      }
      setTotalResults(Number(responseData.totalResults) || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.trim().length > 0) {
        setPage(1)
        fetchMovies(search, selectedYear, 1);
      } else {
        setLoading(false)
        setMovies([])
      }
    }, 500)

    return () => {
      clearTimeout(handler);
    }
  }, [search]);

  const loadMore = () => {
    if (movies.length < totalResults && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(search, selectedYear, nextPage)
    }
  };

  const onUpdateYear = (item: any) => {
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
        sortedMovies = movies.sort((a, b) => a.Title.localeCompare(b.Title))
      } else {
        sortedMovies = movies.sort((a, b) => b.Title.localeCompare(a.Title))
      }
    }

    setMovies(sortedMovies);
  }

  const FilterDropdown = ({ data, placeholder, value, onChange }: { data: any, placeholder: string, value: any, onChange: (item: any) => void }) => (
    <Dropdown
      style={styles.dropdown}
      data={data}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      selectedTextStyle={{ fontSize: 14, }}
      itemTextStyle={{ fontSize: 14, }}
    />
  );

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

  const sortingMethod = ["ASC", "DESC"].map((item) => ({ label: item, value: item }));
  const sortingType = ["Year", "Title"].map((item) => ({ label: item, value: item }));

  function emptyListMessage() {
    if (search != "" && movies.length == 0) {
      return "No results";
    } else if (search == "" && movies.length == 0) {
      return "Search movies";
    }else{
      return "";
    }
  }

  return (
    <View style={{ marginTop: 50, marginHorizontal: 20 }}>
      <View style={[styles.searchRow, { justifyContent: "space-between", }]}>
        <Text style={styles.title}>Movie Database</Text>
        <TouchableOpacity onPress={() => router.push('/favorites')}>
          <Text style={{ color: "#007AFF", fontSize: 16 }}>Favorites</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.searchRow, styles.verticalSpacingMedium]}>
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholder="Search movies..."
        />
      </View>
      <View style={styles.filterRow}>
        <FilterDropdown
          data={years}
          placeholder="Year"
          value={selectedYear}
          onChange={(item) => { onUpdateYear(item) }}
        />
        <FilterDropdown
          data={sortingMethod}
          placeholder="Sort"
          value={selectedSortingMethod}
          onChange={(item) => { onSortList(item.value, sortType) }}
        />
        <FilterDropdown
          data={sortingType}
          placeholder="Type"
          value={sortType}
          onChange={(item) => { onSortList(selectedSortingMethod, item.value) }}
        />
      </View>
      {!loading && movies.length == 0? <View style={{ justifyContent: "center", alignItems: "center", height: 200 }}>
        <Text style={[styles.title, { color: "#c9c9c9" }]}>{emptyListMessage()}</Text>
      </View> : null}
      <FlatList
        data={movies}
        numColumns={3}
        keyExtractor={(item) => item.imdbID}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={1}
        ListEmptyComponent={
          loading ? <ActivityIndicator size="large" /> : null
        }
      />
    </View>
  );
}

