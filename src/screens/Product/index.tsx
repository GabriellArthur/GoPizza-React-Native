import React, { useState } from 'react';
import { ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useRoute } from '@react-navigation/native';

import { ProductNavigationProps } from '@src/@types/navigation'

import { InputPrice } from '../../components/InputPrice';
import { ButtonBack } from '../../components/ButtonBack';
import { Button } from '../../components/Button';
import { Photo } from '../../components/Photo';
import { Input } from '../../components/Input';

import {
	Container,
	Header,
	Title,
	DeleteLabel,
	Upload,
	PickImageButton,
	Form,
	Label,
	InputGroup,
	InputGroupHeader,
	MaxCharacters,
} from './styles';

export function Product() {
	const [image, setImage] = useState('');
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [priceSizeP, setPriceSizeP] = useState('');
	const [priceSizeM, setPriceSizeM] = useState('');
	const [priceSizeG, setPriceSizeG] = useState('');
	const [isLoading, setIsLoading] = useState(false);

  const route = useRoute();
  const { id } = route.params as ProductNavigationProps;
  console.log('ID DO PRODUTO SELECIONADO => ', id);

	async function handlePickerImage() {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (status === 'granted') {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				aspect: [4, 4],
			});

			if (!result.cancelled) {
				setImage(result.uri);
			}
		}
	}

	async function handleAdd() {
		if (!name.trim()) {
			Alert.alert('Cadastro', 'Informe o nome da Pizza');
			return;
		}

		if (!description.trim()) {
			Alert.alert('Cadastro', 'Informe a descrição da Pizza');
			return;
		}

		if (!image) {
			Alert.alert('Cadastro', 'Selecione a imagem da Pizza');
		}

		if (!priceSizeP || !priceSizeM || !priceSizeG) {
			Alert.alert('Cadastro', 'Informe o preço de todos os tamanhos da Pizza');
			return;
		}

		setIsLoading(true);

		const fileName = new Date().getTime();
		const reference = storage().ref(`pizzas/${fileName}.png`);

		await reference.putFile(image);
		const photo_url = await reference.getDownloadURL();

		firestore()
			.collection('pizzas')
			.add({
				name,
				name_insensitive: name.toLowerCase().trim(),
				description,
				prices_sizes: {
					p: priceSizeP,
					m: priceSizeM,
					g: priceSizeG,
				},
				photo_url,
				photo_path: reference.fullPath,
			})
			.then(() => {
				Alert.alert('Cadastro', 'Pizza cadastrada com sucesso!');
			})
			.catch(() => {
				Alert.alert('Cadastro', 'Não foi possível cadastrar a Pizza');
			});

		setIsLoading(false);
	}

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
				<Header>
					<ButtonBack />
					<Title>Cadastrar</Title>
					<TouchableOpacity onPress={() => {}}>
						<DeleteLabel>Deletar</DeleteLabel>
					</TouchableOpacity>
				</Header>
				<Upload>
					<Photo uri={image} />
					<PickImageButton
						title="Carregar"
						type="secondary"
						onPress={() => {
							handlePickerImage();
						}}
					/>
				</Upload>
				<Form>
					<InputGroup>
						<Label>Nome</Label>
						<Input
							onChangeText={(text) => {
								setName(text);
							}}
							value={name}
						/>
					</InputGroup>

					<InputGroup>
						<InputGroupHeader>
							<Label>Descrição</Label>
							<MaxCharacters>0 de 60 caracteres</MaxCharacters>
						</InputGroupHeader>

						<Input
							multiline
							maxLength={60}
							style={{ height: 80 }}
							onChangeText={(text) => {
								setDescription(text);
							}}
							value={description}
						/>
					</InputGroup>

					<InputGroup>
						<Label>Tamanhos e Preços</Label>

						<InputPrice
							size="P"
							onChangeText={(text) => {
								setPriceSizeP(text);
							}}
							value={priceSizeP}
						/>
						<InputPrice
							size="M"
							onChangeText={(text) => {
								setPriceSizeM(text);
							}}
							value={priceSizeM}
						/>
						<InputPrice
							size="G"
							onChangeText={(text) => {
								setPriceSizeG(text);
							}}
							value={priceSizeG}
						/>
					</InputGroup>

					<Button
						title="Cadastrar pizza"
						isLoading={isLoading}
						onPress={() => {
							handleAdd();
						}}
					/>
				</Form>
			</Container>
		</ScrollView>
	);
}
