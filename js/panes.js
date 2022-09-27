let productosJSON = [];
let lista;
let car = JSON.parse(localStorage.getItem("car")) || [];


const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarritoDeCompras = document.querySelector("#items");
const contenedorFooterDeCarrito = document.querySelector("#panes");


window.onload=()=>{
    lista=document.getElementById("milista");
};
function agregarACarrito(productoNuevo) {
    let encontrado = car.find(p => p.id == productoNuevo.id);
    if (encontrado == undefined) {
        let prodACarrito = {
            ...productoNuevo,
            cantidad: 1
        };
        car.push(prodACarrito);
       ;
        //agregamos una nueva fila a la tabla de carrito
        document.getElementById("items").innerHTML += (`
            <tr id='fila${prodACarrito.id}'>
            <td> ${prodACarrito.id} </td>
            <td> ${prodACarrito.nombre}</td>
            <td id='${prodACarrito.id}'> ${prodACarrito.cantidad}</td>
            <td>$ ${prodACarrito.precio}</td>
            <td> <button type="button" class="btn btn-danger" onclick='eliminar(${prodACarrito.id})'><i class="bi bi-trash-fill"></button>`);
        
    } else {
        //el producto ya existe en el carro
        //pido al carro la posicion del producto 
        let posicion = car.findIndex(p => p.id == productoNuevo.id);
        
        car[posicion].cantidad += 1;
        //con querySelector falla
        document.getElementById(productoNuevo.id).innerHTML = car[posicion].cantidad;
    }
    //siempre debo recalcular el total
    localStorage.setItem("carrito", JSON.stringify(car));
    // FINALIZAR COMPRA
    let finalizar = document.querySelector('#finalizar')
    finalizar.onclick = () => {
        Swal.fire({
            title: 'Orden confirmada!',
            text: 'Gracias por su compra!',
            icon: 'success',
            confirmButtonText: 'Cerrar'
        })
        contenedorCarritoDeCompras.innerHTML = "";
        contenedorFooterDeCarrito.innerHTML = `
            <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
    }
    productosJSON.length == 0 ? contenedorFooterDeCarrito.innerHTML = `
            <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        ` : contenedorFooterDeCarrito.innerHTML = `
          <th scope="row" colspan="5">Total de la compra: $${calcularTotal()}</th>
         `;
    
}

function calcularTotal() {
    let suma = 0;
    for (const elemento of car) {
        suma = suma + (elemento.precio * elemento.cantidad);
    }
    return suma;
}
// ELIMINAR PROD
function eliminar(id) {
    let indice = car.findIndex(prod => prod.id == id);
    car.splice(indice, 1);//eliminando del carro
    let fila = document.getElementById(`fila${id}`);
    document.getElementById("items").removeChild(fila);//eliminando de la tabla
    document.getElementById("gastoTotal").innerText = (`Total: $ ${calcularTotal()}`);
    localStorage.setItem("car", JSON.stringify(car));
    Swal.fire("Producto eliminado del carro!")
}


//RENDERIZAR PRODUCTOS
function renderizarProductos() {
    for (const prod of productosJSON) {
        lista.innerHTML += (`<section class="d-flex justify-content-center mt-5  ">
        <article class="container">
         <div id="contenedor-productos" class="row row-cols-1 row-cols-md-2 g-4 ">
            <div class="card m-2 p-2">
                <img src="${prod.foto}" class="card-img-top" alt="Brownie">
                    <div class="card-body">
                        <h5>${prod.nombre}</h5>
                        <h6>${prod.ingredientes}</h6>
                        <p>$ ${prod.precio}</p>
                        <div>
                        <button class="btn btn-success" id='btn${prod.id}'>Comprar</button>
                        </div>
                    </div>
            </div>
            </div>
            </article>
            </section>`);
        
    }

    //EVENTOS
    productosJSON.forEach(prod => {
        document.getElementById(`btn${prod.id}`).onclick = function () {

            agregarACarrito(prod);

            swal({
                title: "¡Producto agregado!",
                text: `${prod.nombre} agregado al carrito de compra.`,
                icon: "success",
                buttons: {
                    cerrar: {
                        text: "Cerrar",
                        value: false
                    },
                    carrito: {
                        text: "Ir a carrito",
                        value: true
                    }
                }
            }).then((irACarrito) => {

                if (irACarrito) {

                    const myModal = new bootstrap.Modal(document.getElementById('exampleModal'), { keyboard: true });
                    const modalToggle = document.getElementById('toggleMyModal');
                    myModal.show(modalToggle);

                }
            });
        };
    });
}

function buscarCarro(productoNuevo){
    
}

//GETJSON de productos.json
async function obtenerJSON() {
    const URLJSON="productos.json"
    const resp=await fetch(URLJSON)
    const data= await resp.json()
    productosJSON = data;
    renderizarProductos();
}
obtenerJSON();
    