
//Variables
const modal = new bootstrap.Modal('#modal', {});
const sCategorias = document.querySelector('#categorias')
const divResultado = document.querySelector('#resultado');
const divFavoritos = document.querySelector('.favoritos');



//EventsListenners
document.addEventListener('DOMContentLoaded',()=>{
    colocarCategorias();
    //Si existe elemento divFavoritos colocar las cards
    if(divFavoritos){
        colocarFavoritos();
    }
});

if(sCategorias){
    sCategorias.addEventListener('change', buscarPlatillo);
}


//Class

class UI{
    imprimirCategorias(categorias = []){
//Ieterar en cada una de las categorias
    categorias.forEach(categoria =>{
        //Destructuring
        const {strCategory} = categoria;
   
        const option = document.createElement('OPTION');
        option.value = strCategory;
        option.textContent = strCategory;

        if(sCategorias){
            sCategorias.appendChild(option);
        }

        })

    }

    imprimirPlatillo(platillos){

        this.limpiarHTML(divResultado);

       if(platillos){
        platillos.forEach(platillo =>{
            const {idMeal,strMeal,strMealThumb} = platillo;

            //Columnas
            const colums = document.createElement('DIV');
            colums.classList.add('col-md-4');
            //Card
            const card = document.createElement('DIV');
            card.classList.add('card', 'mb-4');
            //Title
            const tilte = document.createElement('H3');
            tilte.classList.add('card-title', 'mb-3', 'text-center');
            tilte.textContent = strMeal ?? platillo.titulo;
            //Imagen
            const img = document.createElement('IMG');
            img.classList.add('card-img-top');
            img.alt = `Imagen del paltillo`, strMeal ?? platillo.titulo;
            img.src = strMealThumb ?? platillo.imagen;
            
            const divBody = document.createElement('DIV');
            divBody.classList.add('card-body');

            const buttonVer = document.createElement('BUTTON');
            buttonVer.classList.add('btn','text-center', 'w-100', 'bg-danger', 'text-white', 'mt-2');
            buttonVer.textContent = 'Ver receta';
            buttonVer.onclick = ()=>{
                seleccionarReceta(idMeal ?? platillo.id);
            }
            
            divBody.appendChild(tilte);
            divBody.appendChild(img);
            divBody.appendChild(buttonVer);
            card.appendChild(divBody);
            colums.appendChild(card);
            //Colocar cards
            divResultado.appendChild(colums);

         });
       }
    }

    imprimirFAvoritos(platillos) {
      if(divFavoritos){
        this.limpiarHTML(divFavoritos);

        //Si exsiten platillos
        if(platillos){
         platillos.forEach(platillo =>{
             const {idMeal,strMeal,strMealThumb} = platillo;
 
            //Columnas
             const colums = document.createElement('DIV');
             colums.classList.add('col-md-4');
            //Card
             const card = document.createElement('DIV');
             card.classList.add('card', 'mb-4');
            //Title
             const tilte = document.createElement('H3');
             tilte.classList.add('card-title', 'mb-3', 'text-center');
             tilte.textContent = strMeal ?? platillo.titulo;
            //Imagen
             const img = document.createElement('IMG');
             img.classList.add('card-img-top');
             img.alt = `Imagen del paltillo`, strMeal ?? platillo.titulo;
             img.src = strMealThumb ?? platillo.imagen;
 
            //Body DIV
             const divBody = document.createElement('DIV');
             divBody.classList.add('card-body');
 
             const buttonVer = document.createElement('BUTTON');
             buttonVer.classList.add('btn','text-center', 'w-100', 'bg-danger', 'text-white', 'mt-2');
             buttonVer.textContent = 'Ver receta';
             buttonVer.onclick = ()=>{
                 seleccionarReceta(idMeal ?? platillo.id);
             }
             
             divBody.appendChild(tilte);
             divBody.appendChild(img);
             divBody.appendChild(buttonVer);
             card.appendChild(divBody);
             colums.appendChild(card);
             //Colocar cards dentro del HTML
             divFavoritos.appendChild(colums);
           
 
          });
        }
    }
}

    imprimirSeleccionada(receta){
        const {idMeal,strMeal,strMealThumb} = receta;
        
        const modalTittle = document.querySelector('.modal .modal-title');
        const modalBody = document.querySelector('.modal .modal-body');
        
        this.limpiarHTML(modalBody);

        //Titulo del modal
        modalTittle.textContent = strMeal;
        //Imagen de ventana modal Platillo
        const imgPaltillo = document.createElement('IMG');
        imgPaltillo.src = `${strMealThumb}`;
        imgPaltillo.classList.add('img-fluid', 'p-1');

        //Texto ingredientes y cantidades
        const IngreCant = document.createElement('H3');
        IngreCant.textContent = 'Ingredientes Y Cantidades';

        //Ingredientes Platillos
        const ul = document.createElement('UL');
        ul.classList.add('list-group');

        //colcando Imagen y titulo de cantidades y ingredientes
        modalBody.appendChild(imgPaltillo);
        modalBody.appendChild(IngreCant);

            for(let i = 1; i <= 20; i++){

                const ingredientes =  receta[`strIngredient${i}`];
                if(ingredientes){
                    const cantidades = receta[`strMeasure${i}`];

                    //Colocando ingredientes y cantidades
                    const li = document.createElement('LI');
                    li.classList.add('list-group-item')
                    li.textContent = `${ingredientes} -  ${cantidades}`;
                    ul.appendChild(li);
                }
            }

            modalBody.appendChild(ul);
            
            const btnFavorito = document.createElement('BUTTON');
            btnFavorito.classList.add('btn', 'btn-danger', 'text-center', 'text-white', 'col');
            btnFavorito.textContent = favoritos.exixtePlatillo(idMeal) ? 'Eliminar' : 'Agregar Favorito';
            btnFavorito.onclick = ()=>{
                //Alerta toast 
                ui.alertaToast('Eliminado Correctamente el Paltillo');
                favoritos.agregarFavoritos(idMeal,strMeal,strMealThumb);
                if(favoritos.exixtePlatillo(idMeal)){
                    btnFavorito.textContent = 'Eliminar';
                    //Alerta toast
                    ui.alertaToast('Agregado Correctamente el Paltillo');
                    return;
                }
                    btnFavorito.textContent = 'Agregar Favorito'; 
            }

            const btnCerrar = document.createElement('BUTTON');
            btnCerrar.classList.add('btn', 'btn-danger', 'text-center', 'text-white','col');
            btnCerrar.textContent = 'Cerrar';
            btnCerrar.onclick = ()=>{
                modal.hide();
            }

            //Limpiar Button agregar y cerrar del modal
            const modalFooter = document.querySelector('.modal-footer');
            this.limpiarHTML(modalFooter);

            modalFooter.appendChild(btnFavorito);
            modalFooter.appendChild(btnCerrar);

            
            
            modal.show();
            
        }


    limpiarHTML(elemento){
        while(elemento.firstChild){
            elemento.removeChild(elemento.firstChild);
        }
    }

    alertaToast(mensaje){
        const toast = document.querySelector('#toast');
        const toastBody = document.querySelector('.toast-body');
        const toastBootstrap = new bootstrap.Toast(toast, {});
        toastBody.textContent = mensaje;
        toastBootstrap.show();
    }
    
    
}

 //Favoritos
 class Favoritos{
        agregarFavoritos(idMeal,strMeal,strMealThumb){
            //Agregar Platillo de Favoritos
            const platillo = {
                titulo: strMeal,
                imagen: strMealThumb,
                id : idMeal
            }
            //Eliminar platillo de favoritos
            if(this.exixtePlatillo(idMeal)){
                const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
                const nuevosFavoritos = favoritos.filter(favorito => favorito.id != idMeal);
                localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
                colocarFavoritos();
                return
            }
                const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
                localStorage.setItem('favoritos',JSON.stringify([...favoritos, platillo]));
                colocarFavoritos();
        }

        actualizarFavoritos(){
            const favoritos = JSON.parse(localStorage.getItem('favoritos'));
            ui.imprimirFAvoritos(favoritos)
        }

        exixtePlatillo(id){
            const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
            const existe = favoritos.some(favorito => favorito.id === id);
            return existe;
        }
 }

//Instanciar
const ui = new UI;
const favoritos = new Favoritos;

//Functions

function colocarCategorias(){
    //API de paltillo categorias
    const URL = `https://www.themealdb.com/api/json/v1/1/categories.php`;

    fetch(URL)
        .then(respuesta => respuesta.json())
        .then(resultado => ui.imprimirCategorias(resultado.categories));
}



function buscarPlatillo(e){
    const platillo = e.target.value;
    //API de platillo
    const URL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${platillo}`;

    fetch(URL)
        .then(respuesta => respuesta.json())
        .then(resultado => ui.imprimirPlatillo(resultado.meals));

}


function seleccionarReceta(id){
    //API platillo por id
    const URL = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

    fetch(URL)
        .then(respuesta => respuesta.json())
        .then(resultado => ui.imprimirSeleccionada(resultado.meals[0]))
}



function colocarFavoritos(){
    favoritos.actualizarFavoritos();
}
