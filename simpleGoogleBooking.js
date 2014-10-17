/*
Un petit script per generar events en un calendari automàticament a partir de l'enviament d'un formulari.
Comprova si hi ha solapament amb un event amb el mateix recurs i envia un correu amb el resultat de la reserva (OK, No disponible)
Author: Xavi Meler (jmeler@xtec.cat) 

Una plantilla del formulari i full de càlcul associat que podeu copiar és:
https://docs.google.com/spreadsheets/d/1g1uTnMcTmLtXHnPn5gC_5EuuW-sPr8y_AzIzIPzEL_s/edit?usp=sharing

*/

function updateCalendarAndSendMail(e) {
  
  // Obtenim el id del calendari del segon full (Configuració)
  var full_actiu = SpreadsheetApp.getActiveSpreadsheet();
  SpreadsheetApp.setActiveSheet(full_actiu.getSheets()[1]);
  var data = full_actiu.getDataRange().getValues();
  var idcalendar = data[0][1]; 
 
  var url='https://www.google.com/calendar/render?cid='+idcalendar;
  
  // Recuperem les dades del full de càlcul
  var timestamp = e.values[0];
  var destinatari = e.values[1];
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
