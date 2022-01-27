import React, { useEffect, useState } from 'react';
import { Alert, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import happyEmoji from '@assets/happy.png';

import { Search } from '../../components/Search';
import { ProductCard, ProductProps } from '../../components/ProductCard';

import {
	Container,
	Header,
	Greeting,
	GreetingEmoji,
	GreetingText,
	Title,
	MenuHeader,
	MenuItemsNumber,
} from './styles';

export function Home() {
	const [pizzas, setPizzas] = useState<ProductProps[]>([]);
	const [search, setSearch] = useState('');

	const { COLORS } = useTheme();
	const navigation = useNavigation();

	function fetchPizzas(value: string) {
		const formattedValue = value.toLowerCase().trim();

		firestore()
			.collection('pizzas')
			.orderBy('name_insensitive')
			.startAt(formattedValue)
			.endAt(`${formattedValue}\uf8ff`) // como um "LIKE"
			.get()
			.then((response) => {
				const data = response.docs.map((doc) => {
					return {
						id: doc.id,
						...doc.data(),
					};
				}) as ProductProps[];

				setPizzas(data);
			})
			.catch(() =>
				Alert.alert('Consulta', 'Não foi possível realizar a consulta')
			);
	}

	function handleSearch() {
		if (search.length > 0) {
			fetchPizzas(search);
		}
	}

	function handleSearchClear() {
		setSearch('');
		fetchPizzas('');
	}

	function handleOpen(id: string) {
		navigation.navigate('product', { id });
	}

	useEffect(() => {
		fetchPizzas('');
	}, []);

	return (
		<Container>
			<Header>
				<Greeting>
					<GreetingEmoji source={happyEmoji} />
					<GreetingText>Olá, Admin!</GreetingText>
				</Greeting>

				<TouchableOpacity onPress={() => {}}>
					<MaterialIcons name="logout" size={24} color={COLORS.TITLE} />
				</TouchableOpacity>
			</Header>

			<Search
				onChangeText={setSearch}
				value={search}
				onSearch={() => {
					handleSearch();
				}}
				onClear={() => {
					handleSearchClear();
				}}
			/>

			<MenuHeader>
				<Title>Cardápio</Title>
				<MenuItemsNumber>3 pizzas</MenuItemsNumber>
			</MenuHeader>

			<FlatList
				data={pizzas}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<ProductCard
						data={item}
						onPress={() =>
              handleOpen(item.id)
            }
					/>
				)}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingTop: 20,
					paddingBottom: 125,
					marginHorizontal: 24,
				}}
			/>
		</Container>
	);
}
