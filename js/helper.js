// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function Ocultar_headers (idMenu) {

  let urlParams = new URLSearchParams(window.location.search);
  let mostrar = true;
  let entries = urlParams.entries();
  
  for(pair of entries) {
    if(pair[0] == 'vHeaders') {
      mostrar = pair[1];
    } 
  }

  let headers = document.getElementById(idMenu);
  
  if (mostrar == true) {
    headers.style.display = "inline";
  } else {
    headers.style.display = "none";
  }

}
