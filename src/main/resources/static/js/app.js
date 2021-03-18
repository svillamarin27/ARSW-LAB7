const API = apiclient
app = (function () {

    function getBlueprintsByNameAndAuthor(author, bpName) {
        $("#current").text(bpName);
        return API.getBlueprintsByNameAndAuthor(author, bpName, draw);
    }

    function run() {
        var autor = $('#autor').val();
        API.getBlueprintsByAuthor(autor, generateTable);
    }

    function addCanvas() {
        $("#canvasContainer").empty();
        $('#canvasContainer')
            .append(
                "<label for='myCanvas'>"
                + "Current Blueprint: <b id='current'></b>"
                + "</label>"
                + "<canvas id='myCanvas' width='500px' height='300px' style='border:1px solid #000000;'>"
                + "</canvas>"
                + "&nbsp;&nbsp;<button id='delete' onclick='app.deletePrint()'>Delete</button>"
                + "&nbsp;&nbsp;<button id='update' onclick='app.update()'>Update/save</button>"
            );
    }

    function addCanvasCreate() {
        $("#canvasContainer").empty();
        $('#canvasContainer')
            .append(
                "<h2>Creador de planos</h2>"
                + "<br></br>"
                +"<input type='text' id='name' placeholder='Name'></br>"
                + "<br></br>"
                + "<label for='myCanvas'>"
                + "Dibuje el nuevo plano:"
                + "<br></br>"
                + "</label>"
                + "<canvas id='myCanvas' width='500px' height='300px' style='border:1px solid #000000;'>"
                + "</canvas>"
                + "<br></br>"
                + "<br></br>"
                + "&nbsp;&nbsp;<button id='create' onclick='app.postNew()'>Create</button>"
                + "&nbsp;&nbsp;<button id='cancel' onclick='app.cancellation()'>Cancel</button>"
            );
    }

    function deleteCanvas() {
        $("#canvasContainer").empty();
    }

    function create() {
        drawNew([]);
    }

    function update() {
        API.put(updatePrint, confirmation);
    }

    var toDeletePrint = null; 

    function deletePrint(){
        console.log(toDeletePrint);
        if(confirm('Esta apunto de eliminar un plano, ¿esta seguro?')){
            API.delete(toDeletePrint, confirmation);
        }else{
            cancelacion(toDeletePrint);
        }
    }

    function confirmation(funcion) {
        alert("El plano fue actualizado");
        deleteCanvas();
        API.getBlueprintsByAuthor(funcion.author, generateTable);
    }

    function cancelation(funcion) {
        alert("Cancelado.");
        deleteCanvas();
        API.getBlueprintsByAuthor(funcion.author, generateTable);
    }

    function postNew(){
        if(newpoints.length === 0 || $("#name").val() === ""){
            alert("No ha ingresado un nombre o aun no ha dibujado un plano.");
        }else{
            API.post({"author": $('#autor').val(),"points": newpoints,"name": $("#name").val()}, confirmation);
        }
    }

    var updatePrint = null;
    
    function draw(funcion) {
        toDeletePrint = funcion;
        deleteCanvas();
        addCanvas();
        var c = canvas(funcion.points);
        var xPos = $("#myCanvas").offset().left + window.screenX;
        var yPos = $("#myCanvas").offset().top + window.screenY;
        if (window.PointerEvent) {
            c.addEventListener("pointerdown", function (event) {
                funcion.points.push({ "x": event.pageX - xPos, "y": event.pageY - yPos });
                c = canvas(funcion.points);
                updatePrint = funcion;
            });
        } else {
            c.addEventListener("mousedown", function (event) {
                funcion.points.push({ "x": event.pageX - xPos, "y": event.pageY - yPos });
                c = canvas(funcion.points);
                updatePrint = funcion;
            });
        }
    }

    var newpoints = null;
    
    function drawNew(funcion) {
        deleteCanvas();
        addCanvasCreate();
        var c = canvas(funcion);
        var xPos = $("#myCanvas").offset().left + window.screenX;
        var yPos = $("#myCanvas").offset().top + window.screenY;
        if (window.PointerEvent) {
            c.addEventListener("pointerdown", function (event) {
                funcion.push({ "x": event.pageX - xPos, "y": event.pageY - yPos });
                c = canvas(funcion);
                newpoints = funcion;
            });
        } else {
            c.addEventListener("mousedown", function (event) {
                funcion.push({ "x": event.pageX - xPos, "y": event.pageY - yPos });
                c = canvas(funcion);
                newpoints = funcion;
            });
        }
    }
    
    function canvas(funcion) {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.clearRect(0, 0, c.width, c.height);
        funcion.map(function (f) {
            ctx.lineTo(f.x, f.y);
            ctx.stroke();
        });
        ctx.closePath();
        return c;
    }

    function generateTable(funcion) {
        $("#nombre").text($('#autor').val() + "'s");
        $("#cuerpo").empty();
        $("#botoncrear").empty();
        var total = 0;
        $('#botoncrear')
                .append(
                    "<button id='create' onclick='app.create()'>Crear un nuevo plano</button><br></br>"
                );
        funcion.map(function (f) {
            $('#cuerpo')
                .append(
                    "<tr>" +
                    "<td>" + f.name + "</td>" +
                    "<td>" + f.points.length + "</td>" +
                    "<td><form><button type='button' onclick='onclick=app.getBlueprintsByNameAndAuthor( \"" + f.author + '" , "' + f.name + "\")')'>Abrir</button></form></td>" +
                    "</tr>"
                );
            total += f.points.length;
        });
        $("#total").text(total);
    }

    return {
        run: run,
        getBlueprintsByNameAndAuthor: getBlueprintsByNameAndAuthor,
        update: update,
        create: create,
        postNew: postNew,
        cancelation: cancelation,
        deletePrint: deletePrint
    };
})();