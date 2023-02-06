$(document).ready(function() {
    const Toast = Swal.mixin({
        toast: true, position: 'top-end', color: '#80FF00', showConfirmButton: false, timer: 3000,   width: 250, timerProgressBar: true, didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

        document.getElementById("cards").value = getSavedValue("cards");
        function saveValue(e){
            var id = e.id;
            var val = e.value;
            localStorage.setItem(id, val);
        }
        function getSavedValue  (v){
            if (!localStorage.getItem(v)) {
                return "";
            }
            return localStorage.getItem(v);
        }
    $('.show-live-cvv').click(function() {
      var type = $('.show-live-cvv').attr('type');
      $('#live-cvv').slideToggle();
      if (type == 'show') {
        $('.show-live-cvv').html('<i class="fa fa-eye"></i>');
        $('.show-live-cvv').attr('type', 'hidden');
      } else {
        $('.show-live-cvv').html('<i class="fa fa-eye-slash"></i>');
        $('.show-live-cvv').attr('type', 'show');
      }});
    $('.show-live-ccn').click(function() {



      var type = $('.show-live-ccn').attr('type');

      $('#live-ccn').slideToggle();
      if (type == 'show') {
        $('.show-live-ccn').html('<i class="fa fa-eye"></i>');
        $('.show-live-ccn').attr('type', 'hidden');
      } else {
        $('.show-live-ccn').html('<i class="fa fa-eye-slash"></i>');
        $('.show-live-ccn').attr('type', 'show');
      }});
    $('.show-dead').click(function() {
      var type = $('.show-dead').attr('type');
      $('#dead-list').slideToggle();
      if (type == 'show') {
        $('.show-dead').html('<i class="fa fa-eye"></i>');
        $('.show-dead').attr('type', 'hidden');
      } else {
        $('.show-dead').html('<i class="fa fa-eye-slash"></i>');
        $('.show-dead').attr('type', 'show');
      }});

    $('.btn-dead-trash').click(function() {
        Toast.fire({
            icon: 'success', title: '<h6 class="title mb-2">Deleted Dead List!</h6>',background: '#27293d'
        });
      $('#dead-list').text('');
    });
    $('.btn-cvv-trash').click(function() {
        Toast.fire({
            icon: 'success', title: '<h6 class="title mb-2">Deleted Live List!</h6>',background: '#27293d'
        });
      $('#live-cvv').text('');
    });
    $('.btn-ccn-trash').click(function() {
        Toast.fire({
            icon: 'success', title: '<h6 class="title mb-2">Deleted Ccn List!</h6>',background: '#27293d'
        });
      $('#live-ccn').text('');
    });

    $('.btn-copy-cvv').click(function() {
        Toast.fire({
            icon: 'success', title: '<h6 class="title mb-2">Copied CVV List!</h6>',background: '#27293d'
        });
      var lista_lives = document.getElementById('live-cvv').innerText;
      var textarea = document.createElement("textarea");
      textarea.value = lista_lives;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy'); document.body.removeChild(textarea);
    });
    $('.btn-copy-ccn').click(function() {

        Toast.fire({
            icon: 'success', title: '<h6 class="title mb-2">Copied CCN List!</h6>',background: '#27293d'
        });
      var lista_lives = document.getElementById('live-ccn').innerText;
      var textarea = document.createElement("textarea");
      textarea.value = lista_lives;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy'); document.body.removeChild(textarea);
    });

    $('.btn-play').click(function() {
    var creditcard = $('.form-checker').val().trim();
    var api = $('#api').val();
    var array = creditcard.split('\n');
    var live = 0;
    var ccn = 0;
    var dead = 0;
    var tested = 0;
    txt = '';
    if(!creditcard){
        Toast.fire({
            icon: 'error', title: '<h6 class="title mb-2">Error: Empty List!</h6>',background: '#27293d'
});
        return false;
    }
    if(!api){
        Toast.fire({
            icon: 'error', title: '<h6 class="title mb-2">Select an api to proceed!</h6>',background: '#27293d'
        });
        return false;
    }

    //if isset creditcard
        Toast.fire({
            icon: 'success', title: '<h6 class="title mb-2">Started..</h6>',background: '#27293d'
        });
document.getElementById("time").innerHTML = "Fired up!🔥";

    var raw = array.filter(function(value){
        if(value.trim() !== ""){
            txt += value.trim() + '\n';
            return value.trim();
        }
    });
    var total = raw.length; 
    
    $('.form-checker').val(txt.trim());
    if(total > 6000){
        Toast.fire({
            icon: 'error', title: '<h6 class="title mb-2">List Limit Exceeded.</h6>',background: '#27293d'
        });
        return false;
    }
    
    $('.carregadas').text(total);
    $('.btn-play').attr('disabled', true);
    $('.btn-stop').attr('disabled', false);
    
    raw.forEach(function(data) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function(){
  if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        if(httpRequest.responseText.match("#CVV")){
                 Toast.fire({
                     icon: 'success', title: '<h6 class="title mb-2">+1 CVV!</h6>' ,background: '#27293d'});
   liveappend(httpRequest.responseText + "");
              removeline();
             live = live +1;
            }
   else if (httpRequest.responseText.match("#CCN")){
       Toast.fire({
           icon: 'success', title: '<h6 class="title mb-2">+1 CCN!</h6>' ,background: '#27293d'});
   ccnappend(httpRequest.responseText + "");
              removeline();
             ccn = ccn +1;
            }
            else{
    deadappend(httpRequest.responseText + "");
                removeline();
             dead = dead +1;
                
            }
            setTime();
            tested = live + dead + ccn;
            $('.aprovadas').text(live);
            $('.reprovadas').text(dead);
            $('.ccn-count').text(ccn);
            $('.testadas').text(tested);
            
            if(tested == total){
                Toast.fire({
                     icon: 'success', title: '<h6 class="title mb-2">DONE!</h6>' ,background: '#27293d'});
              $('.btn-play').attr('disabled', false);
              $('.btn-stop').attr('disabled', true);
            }
        }
        
        }
        httpRequest.open('GET', api + '?lista=' + data);
        httpRequest.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
        httpRequest.send();
        $('.btn-stop').click(function() {
            Toast.fire({
                     icon: 'warning', title: '<h6 class="title mb-2">Stopped!</h6>' ,background: '#27293d'});
          $('.btn-play').attr('disabled', false);
          $('.btn-stop').attr('disabled', true);
          httpRequest.abort();
          return false;
        });
    });
    
    });
  });
  function liveappend(string){
  $('#live-cvv').append(string + '<br>');
  }
  function ccnappend(string){
  $('#live-ccn').append(string + '<br>');
  }
  function deadappend(string){
  $('#dead-list').append(string + '<br>');
  }
  
  function getTimeStamp() {
       var now = new Date();
       return (now.getHours() + ':'
                     + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now
                     .getSeconds()) : (now.getSeconds())));
}
  function setTime() {
document.getElementById("time").innerHTML = getTimeStamp();
}
  var myVar = setInterval(function(){myTimer()},1000);
  function myTimer() {
    var d = new Date();
    document.getElementById("current-time").innerHTML = d.toLocaleTimeString();
}
function removeline() {
    var line = $('.form-checker').val().split('\n');
    line.splice(0, 1);
    $('.form-checker').val(line.join("\n"));
}
function genmodal(){
    $('#gen-modal').modal('show');
}
function bincmodal(){
    $('#modalBin').modal('show');
}

function loaded() {
let timerInterval
Swal.fire({
  title: '<h6 class="title mb-2">please wait..</h6>',
  html: '<h6 class="title mb-2"> remaining time <b></b> milliseconds.</h6>',
  timer: 3000,
  background: '#27293d',
  timerProgressBar: true,
  didOpen: () => {
    Swal.showLoading()
    const b = Swal.getHtmlContainer().querySelector('b')
    timerInterval = setInterval(() => {
      b.textContent = Swal.getTimerLeft()
    }, 100)
  },
  willClose: () => {
    clearInterval(timerInterval)
  }
}).then((result) => {
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
    console.log('I was closed by the timer')
  }
})
}
function checkbin(){
 var ccb = $('#ccBIN').val();
 if(!ccb){
     $('#binname').val('Input A Valid Bin');
 }
 $('.bincheck').attr('disabled', true);
 $.ajax({
 url: "bin_api.php",
 method:"POST",
 data:{ccb:ccb},
 dataType: "JSON",
 success: function(data){
     $('#binname').val(data.bank);
     $('#binbrand').val(data.brand);
     $('#bintype').val(data.type);
     $('#binlevel').val(data.level);
     $('#bincountry').val(data.country);
 $('.bincheck').attr('disabled', false);
 },
 error: function (textStatus, errorThrown) {
     $('#binname').val('Api is offline');
     $('#binbrand').val('Api is offline');
     $('#bintype').val('Api is offline');
     $('#binlevel').val('Api is offline');
     $('#bincountry').val('Api is offline');
       $('.bincheck').attr('disabled', false);
  }
    })
}

