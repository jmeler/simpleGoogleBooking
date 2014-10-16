/*
Un petit script per generar events en un calendari automàticament a partir de l'enviament d'un formulari.
Comprova si hi ha solapament amb un event amb el mateix recurs i envia un correu amb el resultat de la reserva (OK, No disponible)
Author: Xavi Meler (jmeler@xtec.cat) 
*/

function updateCalendarAndSendMail(e) {
  
  // Fiqueu aquí el vostre identificador de calendari. 
  var idcalendar='ID_CALENDARI'; 
  
  var url='https://www.google.com/calendar/render?cid='+idcalendar;
  
  // Recuperem les dades del full de càlcul
  var destinatari = e.values[0];
  var timestamp = e.values[1];
  var recurs = e.values[2]; 
  var euro_dia = e.values[3];
  var hora_fin = e.values[4];
  var comentari = e.values[5];
  
  var dia=euro_dia.split(" ")[0].split("/").reverse().join("/");
  var hora_inici=euro_dia.split(" ")[1].split(":");
  hora_inici=hora_inici[0]+":"+hora_inici[1];
  
  hora_fin=hora_fin.split(":");
  hora_fin=hora_fin[0]+":"+hora_fin[1];
  
  var avis="\nRESERVA FETA AMB ÈXIT.";
  var resultat="OK";
  var asterisk="*";
  
  // Comprovem que no s'ha reservat abans aquest recurs
  var calendar = CalendarApp.getOwnedCalendarById(idcalendar);
  var events=calendar.getEvents(new Date(dia+" "+hora_inici),new Date(dia+" "+hora_fin));
  
  for	(index = 0; index < events.length; index++) {
    // s'ha reservat abans, s'apunta en el calendari però s'envia un correu d'advertiment
    if (events[index].getTitle().replace("*","")==recurs){
      avis="ATENCIO: S'ha registrat la reserva però hi ha un solapament amb una reserva anterior. Reviseu el calendari.";
      resultat="NO DISPONIBLE";
      asterisk="";
    }
  }
  
  var eventCreated=calendar.createEvent(asterisk+recurs, new Date(dia+" "+hora_inici),new Date(dia+" "+hora_fin),{description: "Reservat per "+destinatari+" a les "+timestamp+"<br>"+comentari});
  
  if (eventCreated){
    MailApp.sendEmail(destinatari, "Reserva " + recurs + " "+resultat, recurs+"\n\nInici:"+euro_dia.split(" ")[0]+" "+hora_inici+"\nFinal:"+hora_fin+"\nComentari:"+comentari+"\n"+avis+"\n\nEnllaç al calendari:"+url);
  }
  
}
