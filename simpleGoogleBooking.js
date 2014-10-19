/*
Un petit script per generar events en un calendari automàticament a partir de l'enviament d'un formulari.
Comprova si hi ha solapament amb un event amb el mateix recurs i envia un correu amb el resultat de la reserva (OK, No disponible)

Aquest document és un model i inclou el script:
https://docs.google.com/spreadsheets/d/1I64dAuDxKYxuvprbZtgDIAcXR57Q0Ad_u_C4AG6Qy-0/edit?usp=sharing

Author: Xavi Meler (jmeler@xtec.cat) 
*/

// Crea un menú amb la opció "Activa" que crida a la funció activate
function onOpen(){ 
  var ui = SpreadsheetApp.getUi();
    ui.createMenu('Reserves')
        .addItem('Activa', 'activate')
        .addToUi();
}

/* 
Escriu l'identificador del formulari en una cella (necessari per generar el codi embed del formulari) i crea un disparador
que provoca la inserció d'un event en el calendari per cada formulari enviat.
*/
function activate(){
 
  var full_configuracio = SpreadsheetApp.getActiveSpreadsheet();
  SpreadsheetApp.setActiveSheet(full_configuracio.getSheets()[1]);
  
  var idForm= full_configuracio.getFormUrl();
  
  full_configuracio.getRange('B6').setValue(idForm);
  
  var data = full_configuracio.getDataRange().getValues();
  var idcalendar = data[0][1]; 

  // Generem el trigger que conecta el formulari amb el calendari
  var triggers = ScriptApp.getProjectTriggers();
  if (triggers.length==0) {
    ScriptApp.newTrigger("createCalendarEvent")
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onFormSubmit()
    .create();
  } 
}

// Crea un event en el calendari definit en una cella i envia un email amb el resultat de la reserva 

function createCalendarEvent(e) {
  
  // Obtenim les dades de configuració
  var full_configuracio = SpreadsheetApp.getActiveSpreadsheet();
  SpreadsheetApp.setActiveSheet(full_configuracio.getSheets()[1]);
  var data = full_configuracio.getDataRange().getValues();
  var idcalendar = data[0][1]; 
 
  var url='https://www.google.com/calendar/render?cid='+idcalendar;
  
  var timestamp = e.values[0];
  var destinatari = e.values[1];
  var recurs = e.values[2]; 
  var euro_dia = e.values[3]; //El dia en format europeu
  var hora_fi = e.values[4];
  var comentari = e.values[5];
  
  var dia=euro_dia.split(" ")[0].split("/").reverse().join("/");
  var hora_inici=euro_dia.split(" ")[1].split(":");
  hora_inici=hora_inici[0]+":"+hora_inici[1];
  
  hora_fi=hora_fi.split(":");
  hora_fi=hora_fi[0]+":"+hora_fi[1];
  
  var avis="\nRESERVA FETA AMB ÈXIT.";
  var resultat="OK";
  var asterisk="*";
  
  // Comprovem que no s'ha reservat aquest recurs abans
  var calendar = CalendarApp.getOwnedCalendarById(idcalendar);
  var events=calendar.getEvents(new Date(dia+" "+hora_inici),new Date(dia+" "+hora_fi));
  
  for	(index = 0; index < events.length; index++) {
    // s'ha reservat abans, s'apunta en el calendari però s'envia un correu d'advertiment
    if (events[index].getTitle().replace("*","")==recurs){
      avis="ATENCIO: S'ha registrat la reserva però hi ha un solapament amb una reserva anterior. Reviseu el calendari.";
      resultat="NO DISPONIBLE";
      asterisk="";
      break;
    }
  }
  
  var eventCreated=calendar.createEvent(asterisk+recurs, new Date(dia+" "+hora_inici),new Date(dia+" "+hora_fi),{description: "Reservat per "+destinatari+" a les "+timestamp+"<br>"+comentari});
  
  if (eventCreated){
    MailApp.sendEmail(destinatari, "Reserva " + recurs + " "+resultat, recurs+"\n\nInici:"+euro_dia.split(" ")[0]+" "+hora_inici+"\nFi:"+hora_fi+"\nComentari:"+comentari+"\n"+avis+"\n\nEnllaç al calendari:"+url);
  } else{
    MailApp.sendEmail(destinatari,"ERROR en la reserva",recurs+"\n\nInici:"+euro_dia.split(" ")[0]+" "+hora_inici+"\nFi:"+hora_fi);
  }
  
}
