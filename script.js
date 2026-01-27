/* =========================
   CONFIG
========================= */
const telefono = "5492612423824";

const contenedor = document.getElementById("info-productos");
const buscador = document.getElementById("buscador");

const lista = document.getElementById("lista-pedido");
const totalSpan = document.getElementById("total");
const enviarBtn = document.getElementById("enviarPedido");
const panel = document.querySelector(".pedido");

/* =========================
   ESTADO
========================= */
let pedido = [];
let total = 0;

/* =========================
   PRODUCTOS
========================= */
const productos = [
  {
    nombre: "Ignite 30k",
    precio: 18000,
    imagen: "ig.jpg",
    descripcion: "Gran sabor y excelente rendimiento.",
    masVendido: true
  },
  {
    nombre: "Supreme",
    precio: 15000,
    imagen: "sp.jpg",
    descripcion: "Compacto y fácil de usar."
  },
  {
    nombre: "Fume 30k",
    precio: 26000,
    imagen: "fm.jpg",
    descripcion: "Variedad de sabores y buena duración."
  },
  {
    nombre: "Lost Angel 20k",
    precio: 20000,
    imagen: "la.jpg",
    descripcion: "Excelente sabor y duración."
  },
  {
    nombre: "Play Boy 25k",
    precio: 22000,
    imagen: "pb.jpg",
    descripcion: "Diseño moderno y gran vapor."
  },
  {
    nombre: "Nikbar 30k",
    precio: 25000,
    imagen: "nik.jpg",
    descripcion: "Diseño elegante y larga duración."
  },
  {
    nombre: "Oxbar 30k",
    precio: 35000,
    imagen: "ox.jpg",
    descripcion: "Vapor potente y calidad premium."
  },
  {
    nombre: "Black Sheep 30k",
    precio: 35000,
    imagen: "bs.jpg",
    descripcion: "Sabor intenso y diseño moderno."
  },
  {
    nombre: "Elfbar 30k",
    precio: 35000,
    imagen: "el.jpg",
    descripcion: "Equilibrio perfecto entre sabor y rendimiento."
  }
];

/* =========================
   RENDER CATÁLOGO
========================= */
function renderCatalogo(filtro = "") {
  contenedor.innerHTML = "";

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  filtrados.forEach(p => {
    const card = document.createElement("div");
    card.className = "producto";

    card.innerHTML = `
      ${p.masVendido ? '<div class="badge-mas-vendido">🔥 Más vendido</div>' : ''}
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <span>$${p.precio.toLocaleString()}</span>
      <p>${p.descripcion}</p>
      <button 
        class="btn-agregar"
        data-nombre="${p.nombre}"
        data-precio="${p.precio}">
        Agregar al pedido
      </button>
    `;

    contenedor.appendChild(card);
  });

  activarBotones();
}

/* =========================
   BOTONES AGREGAR
========================= */
function activarBotones() {
  const botones = document.querySelectorAll(".btn-agregar");

  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const nombre = btn.dataset.nombre;
      const precio = parseInt(btn.dataset.precio);
const existente = pedido.find(p => p.nombre === nombre);

if (existente) {
  existente.cantidad++;
} else {
  pedido.push({ nombre, precio, cantidad: 1 });
}

total += precio;
renderPedido();

    });
  });
}

/* =========================
   RENDER PEDIDO
========================= */
function renderPedido() {
  lista.innerHTML = "";

  if (pedido.length === 0) {
    panel.classList.remove("activo");
    lista.innerHTML = '<li class="vacio">No hay productos agregados</li>';
    totalSpan.textContent = "$0";
    return;
  }

  panel.classList.add("activo");

  pedido.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "item-pedido";

li.innerHTML = `
  <div class="nombre">
    <strong>${item.nombre}</strong><br>
    <small>
      $${item.precio.toLocaleString()} x ${item.cantidad}
      → <strong>$${(item.precio * item.cantidad).toLocaleString()}</strong>
    </small>
  </div>

  <div class="controles">
    <button class="btn-menos" data-index="${index}">−</button>
    <span class="cantidad">${item.cantidad}</span>
    <button class="btn-mas" data-index="${index}">+</button>
    <button class="btn-quitar" data-index="${index}">❌</button>
  </div>
`;

    lista.appendChild(li);
  });

  totalSpan.textContent = `$${total.toLocaleString()}`;

  activarControles();
}
  function activarControles() {
  document.querySelectorAll(".btn-mas").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = btn.dataset.index;
      pedido[i].cantidad++;
      total += pedido[i].precio;
      animarPanel();
      renderPedido();
    });
  });

  document.querySelectorAll(".btn-menos").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = btn.dataset.index;

      pedido[i].cantidad--;
      total -= pedido[i].precio;

      if (pedido[i].cantidad <= 0) {
        pedido.splice(i, 1);
      }

      animarPanel();
      renderPedido();
    });
  });

  document.querySelectorAll(".btn-quitar").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = btn.dataset.index;
      total -= pedido[i].precio * pedido[i].cantidad;
      pedido.splice(i, 1);
      animarPanel();
      renderPedido();
    });
  });
}

function activarQuitar() {
  const botonesQuitar = document.querySelectorAll(".btn-quitar");

  botonesQuitar.forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;

      total -= pedido[index].precio;
      pedido.splice(index, 1);

      renderPedido();
    });
  });
}



/* =========================
   BUSCADOR
========================= */
buscador.addEventListener("input", () => {
  renderCatalogo(buscador.value);
});

/* =========================
   ENVIAR PEDIDO
========================= */
enviarBtn.addEventListener("click", () => {
  if (pedido.length === 0) return;

  let mensaje = "Hola! Quiero hacer el siguiente pedido:%0A%0A";

  pedido.forEach(item => {
    mensaje += `- ${item.nombre} ($${item.precio.toLocaleString()})%0A`;
  });

  mensaje += `%0A Total: $${total.toLocaleString()}`;

  window.open(
    `https://wa.me/${telefono}?text=${mensaje}`,
    "_blank"
  );
});

/* =========================
   INIT
========================= */
renderCatalogo();
renderPedido();
function animarPanel() {
  panel.classList.remove("activo");
  void panel.offsetWidth; // truco para reiniciar animación
  panel.classList.add("activo");
}
