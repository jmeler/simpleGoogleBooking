/*
Un petit script per generar events en un calendari automàticament a partir de l'enviament d'un formulari.
Comprova si hi ha solapament amb un event amb el mateix recurs i envia un correu amb el resultat de la reserva (OK, No disponible)
Author: Xavi Meler (jmeler@xtec.cat) 

Aquest script funciona amb un formulari i el seu full de càlcul associat. Aquí teniu una plantilla que heu de copiar en el vostre espai Google.
https://docs.google.com/spreadsheets/d/1I64dAuDxKYxuvprbZtgDIAcXR57Q0Ad_u_C4AG6Qy-0/edit?usp=sharing

*/

function updateCalendarAndSendMail(e) {
  
  // Obtenim les dades de configuració 
  var full_configuracio = SpreadsheetApp.getActiveSpreadsheet();
  SpreadsheetApp.setActiveSheet(full_configuracio.getSheets()[1]);
  var data = full_configuracio.getDataRange().getValues();
  var idcalendar = data[0][1]; 
 
  var url='https://www.google.com/calendar/render?cid='+idcalendar;
  
  // Recuperem les dades de l'enviament del formulari
  var timestamp = e.values[0];
  var destinatari = e.values[1];
  var recurs = e.values[2]; 
  var euro_dia = e.values[3];
  var hora_fi = e.values[4];
  var comentari = e.values[5];
  
  // Convertim el format europeu a americà per fer la inserció en el calendari
  var dia=euro_dia.split(" ")[0].split("/").reverse().join("/");
  var hora_inici=euro_dia.split(" ")[1].split(":");
  hora_inici=hora_inici[0]+":"+hora_inici[1];
  
  hora_fi=hora_fi.split(":");
  hora_fi=hora_fi[0]+":"+hora_fi[1];
  
  // Missatge per defecte, tutto ok 
  var avis="\nRESERVA FETA AMB ÈXIT.";
  var resultat="OK";
  var asterisk="*";
  
  // Comprovem que no s'ha reservat aquest recurs abans
  var calendar = CalendarApp.getOwnedCalendarById(idcalendar);
  var events=calendar.getEvents(new Date(dia+" "+hora_inici),new Date(dia+" "+hora_fi));
  
  for	(index = 0; index < events.length; index++) {
    // s'ha reservat abans, s'apunta en el calendari però es canvia el missatge per defecte per un d'advertiment
    if (events[index].getTitle().replace("*","")==recurs){
      avis="ATENCIO: S'ha registrat la reserva però hi ha un solapament amb una reserva anterior. Reviseu el calendari.";
      resultat="NO DISPONIBLE";
      asterisk="";
      break;
    }
  }
  
  // Creació del event en el calendari
  var eventCreated=calendar.createEvent(asterisk+recurs, new Date(dia+" "+hora_inici),new Date(dia+" "+hora_fi),{description: "Reservat per "+destinatari+" a les "+timestamp+"<br>"+comentari});
  
  //Enviament del correu al usuari que ha fet la reserva
  if (eventCreated){
    MailApp.sendEmail(destinatari, "Reserva " + recurs + " "+resultat, recurs+"\n\nInici:"+euro_dia.split(" ")[0]+" "+hora_inici+"\nFi:"+hora_fi+"\nComentari:"+comentari+"\n"+avis+"\n\nEnllaç al calendari:"+url);
  } else{
    MailApp.sendEmail(destinatari,"ERROR en la reserva",recurs+"\n\nInici:"+euro_dia.split(" ")[0]+" "+hora_inici+"\nFi:"+hora_fi);
  }
  
}
