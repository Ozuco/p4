let indexPregunta = 0; //indice de las 10 preguntas traidas desde la API
let TAMAÑO_CUESTIONARIO=10;

let datos;
//variables de llamada a la api
let preguntas=[];
let respuestasCorrectas=[];
let respuestasIncorrectas=[];

//datos = await getDatosApi();

//esta función oculta los elementos del cuestionario según corresponda
let ocultar = (id) =>{
    // var elemento = document.getElementById(id);
    id.style.display="none";
}

//esta función hace que reaparezcan los elementos del cuestionario según corresponda
let aparecer = (id) =>{
    // var elementos = document.getElementById(id);
    id.style.display="block";
}


const getDatosApi = async () => {
    try {
         //llamada a API
        let peticion = await fetch("https://opentdb.com/api.php?amount=10&category=23&difficulty=hard&type=multiple", {
        method: "GET",
        });

        if(peticion.status===200){ 
            let datos = await peticion.json();
            for (let i = 0; i < TAMAÑO_CUESTIONARIO; i++) {
                preguntas.push(datos.results[i].question);
            }
            for (let i = 0; i < TAMAÑO_CUESTIONARIO; i++) {
                respuestasCorrectas.push(datos.results[i].correct_answer);
            }
            for (let i = 0; i < TAMAÑO_CUESTIONARIO; i++) {
                respuestasIncorrectas.push(datos.results[i].incorrect_answers);
            }
            return datos;
        }
        
    } catch (error) {
        console.error("Error al obtener datos de la API:", error);
    }
}

let sigPregunta = () =>{
    if (indexPregunta < TAMAÑO_CUESTIONARIO) {
        var numPregunta = document.getElementById("numPregunta");
        numPregunta.innerText = "Pregunta número " + (indexPregunta + 1); // Corrected to show the correct question number

        var enunciado = document.getElementById("enunciado");
        enunciado.innerText = preguntas[indexPregunta];

        // Shuffle answers with the correct one among them
        let opciones = [...respuestasIncorrectas[indexPregunta], respuestasCorrectas[indexPregunta]];
        opciones = opciones.sort(() => Math.random() - 0.5); // Shuffle the options

        // Assigning shuffled answers to buttons
        opciones.forEach((opcion, index) => {
            document.getElementById("opc" + (index + 1)).innerText = opcion;
            document.getElementById("opc" + (index + 1)).style.backgroundColor = ""; // Reset background color
        });

        let buttons = document.querySelectorAll('.opcion');
        buttons.forEach(button => {
            button.disabled = false; 
        });

        //ocultar boton siguiente pregunta
        ocultar(respuestaCuestionario);
        indexPregunta++;
    } else {
        console.log("Se ha llegado al final del cuestionario");
    }
}

let inicializarCuestionario = async () =>{
    await getDatosApi();
    ocultar(preguntasCuestionario);
    ocultar(respuestaCuestionario);
    
    sigPregunta();
}


let empezarJugar = async () =>{
    ocultar(inicioCuestionario);
    aparecer(preguntasCuestionario);
}

let correctCount = 0;

// Updated corregir function to change button colors based on correctness
let corregir = (idButton) => {
    let buttons = document.querySelectorAll('.opcion');
    buttons.forEach(button => {
        button.disabled = true; 
    });

    let selectedOption = document.getElementById(idButton).innerText;
    let isCorrect = selectedOption === respuestasCorrectas[indexPregunta - 1];
    if (isCorrect) {
        correctCount++; // Increment correct answer count
    }
    document.getElementById(idButton).style.backgroundColor = isCorrect ? "rgb(32, 176, 65)" : "rgb(176, 32, 32)";
    
    if (!isCorrect) {
        buttons.forEach(button => {
            if (button.innerText === respuestasCorrectas[indexPregunta - 1]) {
                button.style.backgroundColor = "rgb(32, 176, 65)";
            }
        });
    }

    // Check if quiz has ended
    if (indexPregunta === TAMAÑO_CUESTIONARIO) {
        alert(`El cuestionario ha terminado. Respuestas correctas: ${correctCount} de ${TAMAÑO_CUESTIONARIO}`);
        
    }

    //aparece boton siguiente pregunta: :)
    if (indexPregunta<TAMAÑO_CUESTIONARIO){
        aparecer(respuestaCuestionario);
    }

}

//inicioCuestionario
//preguntasCuestionario
//respuestaCuestionario

inicializarCuestionario();
console.log(respuestasCorrectas);

x = document.getElementById("Titulo");
x.innerHTML="Cuestionario histórico";