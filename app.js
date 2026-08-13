
const SUPABASE_URL = "https://cezsmreerzlromcyrnme.supabase.co";
const SUPABASE_KEY = "sb_publishable_vk4jQTE2edgi07tSWfRBYw_rjHNrP_E";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



let casoActual = null;


/* =========================
   ABRIR MODAL
========================= */

function abrirDonacion(caso) {

    casoActual = caso;

    document.getElementById(
        "caso-seleccionado"
    ).textContent = "#" + caso;

    document.getElementById(
        "monto"
    ).value = "";

    document.getElementById(
        "modal"
    ).classList.remove("oculto");
}


/* =========================
   CERRAR MODAL
========================= */

function cerrarModal() {

    document.getElementById(
        "modal"
    ).classList.add("oculto");

    casoActual = null;
}


/* =========================
   CONFIRMAR DONACIÓN
========================= */

function confirmarDonacion() {

    const input =
        document.getElementById("monto");

    const monto =
        Number(input.value);


    if (!Number.isInteger(monto) || monto <= 0) {

        alert(
            "Introduce un monto válido."
        );

        return;
    }


    const confirmado = confirm(

        `¿Confirmas que donaste ${formatearCOP(monto)} al caso #${casoActual}?\n\n` +

        "Una vez registrada, esta donación no podrá modificarse."
    );


    if (!confirmado) {

        return;
    }


    registrarDonacion(
        casoActual,
        monto
    );

    cerrarModal();
}


/* =========================
   REGISTRAR
========================= */
async function registrarDonacion(caso, monto) {

    const { error } = await db
        .from("donaciones")
        .insert({
            caso: caso,
            monto: monto
        });

    if (error) {

        console.error(error);

        alert(
            "No fue posible registrar la donación. Inténtalo nuevamente."
        );

        return;
    }

    await mostrarDonaciones();
}

/* =========================
   MOSTRAR DONACIONES
========================= */

async function mostrarDonaciones() {

    const lista =
        document.getElementById("lista-donaciones");

    const totalElemento =
        document.getElementById("total-donaciones");


    const { data, error } = await db
        .from("donaciones")
        .select("caso, monto")
        .order("id", { ascending: true });


    if (error) {

        console.error(error);

        lista.innerHTML = `
            <p class="sin-donaciones">
                No fue posible cargar las donaciones.
            </p>
        `;

        return;
    }


    if (!data || data.length === 0) {

        lista.innerHTML = `
            <p class="sin-donaciones">
                Todavía no hay donaciones registradas.
            </p>
        `;

        totalElemento.textContent = "$0";

        return;
    }


    lista.innerHTML = "";

    let total = 0;


    data.forEach(donacion => {

        total += Number(donacion.monto);


        const elemento =
            document.createElement("div");

        elemento.className = "donacion";


        elemento.innerHTML = `
            <span>
                Caso #${donacion.caso}
            </span>

            <strong>
                ${formatearCOP(
                    Number(donacion.monto)
                )}
            </strong>
        `;


        lista.appendChild(elemento);
    });


    totalElemento.textContent =
        formatearCOP(total);
}


/* =========================
   FORMATO COP
========================= */

function formatearCOP(
    valor
) {

    return valor.toLocaleString(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }
    );
}


/* =========================
   INICIO
========================= */

mostrarDonaciones();