
// Importar Firebase desde módulos ES6
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Configuración de Firebase
 // configuramos Firebase
 const firebaseConfig = {
    apiKey: "AIzaSyCK30bbiWxwv6n7R2lvOLFxaQJG9yzrVsQ",
    authDomain: "comida-d9e9e.firebaseapp.com",
    projectId: "comida-d9e9e",
    storageBucket: "comida-d9e9e.appspot.com",
    messagingSenderId: "180969552848",
    appId: "1:180969552848:web:668b671be1d003c1ce57d5"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variables y funciones
const foodForm = document.getElementById('food-form');
const foodList = document.getElementById('food-list');
const clearAllButton = document.getElementById('clear-all');

foodForm.addEventListener('submit', addFood);
foodList.addEventListener('click', handleFoodActions);
clearAllButton.addEventListener('click', clearAllFoods);

async function addFood(event) {
    event.preventDefault();

    const foodName = document.getElementById('food-name').value;
    const foodCalories = document.getElementById('food-calories').value;

    try {
        const docRef = await addDoc(collection(db, 'foods'), {
            name: foodName,
            calories: foodCalories,
            liked: false
        });

        const li = document.createElement('li');
        li.setAttribute('data-id', docRef.id);
        li.innerHTML = `
            ${foodName} - ${foodCalories} Calorías 
            <button class="like-btn">Me Gusta</button>
            <button class="dislike-btn">No Me Gusta</button>
            <button class="delete-btn">Eliminar</button>
        `;
        foodList.appendChild(li);
        foodForm.reset();
    } catch (e) {
        console.error("Error añadiendo documento: ", e);
    }
}

async function handleFoodActions(event) {
    const id = event.target.parentElement.getAttribute('data-id');
    const foodRef = doc(db, 'foods', id);

    if (event.target.classList.contains('like-btn')) {
        await updateDoc(foodRef, {
            liked: true
        });
        event.target.parentElement.classList.toggle('like');
    } else if (event.target.classList.contains('dislike-btn')) {
        await updateDoc(foodRef, {
            liked: false
        });
        event.target.parentElement.classList.toggle('dislike');
    } else if (event.target.classList.contains('delete-btn')) {
        await deleteDoc(foodRef);
        event.target.parentElement.remove();
    }
}

async function clearAllFoods() {
    const querySnapshot = await getDocs(collection(db, 'foods'));
    querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
    });
    foodList.innerHTML = '';
}

// Cargar datos desde Firestore al inicio
async function loadFoods() {
    const querySnapshot = await getDocs(collection(db, 'foods'));
    querySnapshot.forEach((doc) => {
        const food = doc.data();
        const li = document.createElement('li');
        li.setAttribute('data-id', doc.id);
        li.innerHTML = `
            ${food.name} - ${food.calories} Calorías 
            <button class="like-btn">Me Gusta</button>
            <button class="dislike-btn">No Me Gusta</button>
            <button class="delete-btn">Eliminar</button>
        `;
        if (food.liked) {
            li.classList.add('like');
        } else {
            li.classList.add('dislike');
        }
        foodList.appendChild(li);
    });
}

loadFoods();
