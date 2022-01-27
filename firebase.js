import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';
import 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration -- from firebase console
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
   apiKey: "AIzaSyCIHpEfvlkcjfJ1j8dtdMob_LlkQ_9neyU",
   authDomain: "gopizza-3f0d2.firebaseapp.com",
	databaseURL: "https://gopizza-c17f4.firebaseio.com",
   projectId: "gopizza-3f0d2",
   storageBucket: "gopizza-3f0d2.appspot.com",
   messagingSenderId: "840434409828",
   appId: "1:840434409828:web:4112658cf32cde5c0eda71"
 };

// Nome do projeto
// gopizza
// Código do projeto

// Número do projeto
// 1008040733183
// Local padrão dos recursos do GCP
// southamerica-east1
// Chave de API da Web

// Configurações públicas
// Essas configurações controlam instâncias do seu projeto que são mostradas ao público
// Nome exibido ao público
// project-1008040733183


// Initialize Firebase
const Firebase = initializeApp(firebaseConfig);
const firestore = getFirestore(); // <--- our added firestore module
export default [Firebase, firestore];
