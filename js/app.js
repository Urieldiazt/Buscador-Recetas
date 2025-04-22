

const colocarCategorias = document.querySelector('#categorias');
const resultadoModal = document.querySelector('#resultado');
const modal =  new bootstrap.Modal('#modal', {});
const favoritosDiv = document.querySelector('.favoritos');


if(favoritosDiv){
    obtenerFavoritos();
}


document.addEventListener('DOMContentLoaded', ()=>{
    if(colocarCategorias){
        agregarCategorias();
        colocarCategorias.addEventListener('change', seleccionarCategoria);
        function mostrarCategorias(categorias = []){
            categorias.forEach(categoria => {
             //Destructuring
             const {strCategory} = categoria;
         
             //Insertar scripting
             const option = document.createElement('OPTION');
             option.value = strCategory;
             option.textContent = strCategory;
         
             colocarCategorias.appendChild(option);
         
            });
         }
    }

    function agregarCategorias(){
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
    
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarCategorias(resultado.categories));
    }
});

function seleccionarCategoria(e){
    const categoria = e.target.value;
    const  url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => imprimirCategoria(resultado.meals));

}

function imprimirCategoria(categorias = []){
    limpiarHTMl(resultadoModal);
    for(let i = 0; i <= 20; i++){
       if(categorias[i]){

            const {idMeal, strMeal, strMealThumb} = categorias[i];

            const recetaConetenedor = document.createElement('DIV');
            recetaConetenedor.classList.add('col-md-4');

            const recetCard = document.createElement('DIV');
            recetCard.classList.add('card', 'mb-4')

            const platillo = document.createElement('H3');+
            platillo.classList.add('card-title', 'mb-3', 'text-center')
            platillo.textContent = strMeal ?? categorias[i].title;

            const platilloImg = document.createElement('IMG');
            platilloImg.classList.add('card-img-top');
            platilloImg.alt = `Imagen de la receta ${strMeal} ?? categorias[i].title`;
            platilloImg.src = strMealThumb ?? categorias[i].img;

            const recetaCardBody = document.createElement('DIV');
            recetaCardBody.classList.add('card-body');

            const recetaButton = document.createElement('BUTTTON');
            recetaButton.classList.add('btn', 'btn-danger', 'w-100', 'mt-2')
            recetaButton.textContent = 'Ver Receta';
            // recetaButton.dataset.bsTarget = "#modal";
            // recetaButton.dataset.bsToggle = "modal";
            //EventListener no funciona por que aparece hasta que tu creas el contenido
            recetaButton.onclick = ()=>{
                seleccionarReceta(idMeal ?? categorias[i].id);
            }
            

            recetaCardBody.appendChild(platilloImg);
            recetaCardBody.appendChild(platillo);
            recetaCardBody.appendChild(recetaButton);

            recetCard.appendChild(recetaCardBody);
            recetaConetenedor.appendChild(recetCard);

            resultadoModal.appendChild(recetaConetenedor);

       }

    }
}


function seleccionarReceta(id){
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarReceta(resultado.meals[0]));
}

function mostrarReceta(receta){
    const {idMeal,strInstructions, strMeal,strMealThumb} = receta;  

    //Añadir contenido al modal
    const modalTittle = document.querySelector('.modal  .modal-title');
    const modalBody = document.querySelector('.modal .modal-body');

    //innner cuando bienen de uan API sani los datos , cuando es un formulario que alguien va a llenar es inseguro

    modalTittle.textContent = strMeal;
    modalBody.innerHTML = `

        <img class="img-fluid" src="${strMealThumb}" alt="receta ${strMeal}"/>
        <h3 class="my-3">Intrucciones</h3>
        <p>${strInstructions}</p>
        <h3 class="my-3">Ingredientes y Cantidades<h3/>
    `;

    const ul = document.createElement('UL');
    ul.classList.add('list-group');

    //Mostrar cantidades e ingredientes
    for(let i = 1; i <= 20; i++){
        if(receta[`strIngredient${i}`]){
            const ingredientes = receta[`strIngredient${i}`];
            const cantidades = receta[`strMeasure${i}`];

            const li = document.createElement('LI');
            li.classList.add('list-group-item');
            li.textContent = `${ingredientes} - ${cantidades}`;
    
            ul.appendChild(li);
            
        }
    }

    modalBody.appendChild(ul);


    const modalFooter = document.querySelector('.modal-footer');
    limpiarHTMl(modalFooter);

    const btnFavoritos = document.createElement('BUTTON');
    btnFavoritos.classList.add('btn', 'btn-danger', 'col');
    btnFavoritos.textContent = existeStorage(idMeal) ? 'Eliminar Favoritos' : 'Guardar Favoritos';
    btnFavoritos.onclick = ()=>{

        if(existeStorage(idMeal)){
            eliminarStorage(idMeal);
            btnFavoritos.textContent = 'Guardar Favoritos';
            mostrarToast('Eliminado Correctamente');
            return;
        }

        agregarFavorito({
            id : idMeal,
            title : strMeal,
            img : strMealThumb
        });
        btnFavoritos.textContent = 'Eliminar Favoritos';
        mostrarToast('Agregado Correctamente');
    }

    const btnCerrar = document.createElement('BUTTON');
    btnCerrar.classList.add('btn', 'btn-secondary', 'col');
    btnCerrar.textContent = 'Cerrar';
    btnCerrar.onclick = ()=>{
        modal.hide();
    }
     
    modalFooter.appendChild(btnFavoritos);
    modalFooter.appendChild(btnCerrar);


    //Muestra el modal
    modal.show();
}

//Local storage Favoritos
function agregarFavorito(receta){
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
    localStorage.setItem('favoritos', JSON.stringify([...favoritos, receta]));

}
//Local storage Favoritos eliminar
function eliminarStorage(id){
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
    const nuevosFavoritos = favoritos.filter(favorito => favorito.id !== id);
    localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
}

function existeStorage(id){
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
    return favoritos.some(favorito => favorito.id === id);
}
//Si existe un elemneto dentro del localStorage
function mostrarToast(mensaje){
    const toastDiv = document.querySelector('#toast');
    const toastBody = document.querySelector('.toast-body');
    const toast = new bootstrap.Toast(toastDiv);
    toastBody.textContent = mensaje;
    toast.show();
}

function obtenerFavoritos(){
    const favorito = JSON.parse(localStorage.getItem('favoritos')) ?? [];
    if(favorito.length){
        imprimirCategoria(favorito);
        return;
    }

    const noFavoritos = document.createElement('H1');
    noFavoritos.classList.add('text-center', 'mt-3', 'py-4');
    noFavoritos.textContent = 'No hay favoritos guardados'

    resultadoModal.appendChild(noFavoritos);

}

function limpiarHTMl(selector){
    while(selector.firstChild){
        selector.removeChild(selector.firstChild);
    }
}


