simpleGoogleBooking
===================

Sistema de reserves simple que funciona amb Google Forms i Google Calendar. 
<ul>
<li>Genera events en un calendari a partir de l'enviament d'un formulari.
<li>Comprova si hi ha solapament en la reserva d'un recurs i envia un correu amb el resultat de la reserva.
</ul>

**Instruccions**:
<ol>
<li>Crea un calendari de Google i guarda l'identificador (exemple ID: xtec.cat_r4rrdscqs23mgt9r20q8f4cq3g@group.calendar.google.com)
<li>Crear un formulari de Google amb aquests opcions marcades:
<ul>
<li>Solicita l'inici de sessió [...]
<li>Recopila automàticament el nom de l'usuari [...]
</ul>
<li>Crea els següents camps dins del formulari. Pots canviar el nom però no l'ordre ni el tipus de camp: 
<ul>
<li>Aula o recurs. <strong>Esculliu d'una llista</strong> (fiqueu les opcions que vulgueu). Obligatori.
<li>Inici. <strong>Data</strong>, inclou <strong>l'any</strong> i <strong>l'hora</strong>. Obligatori.
<li>Fin. <strong>Hora</strong>. Obligatori.
<li>Comentari. <strong>Text</strong>
</ul>
<li>Anar al full de càlcul associat al formulari, fent clic a l'opció del menú superior **Mostra les respostes**
<li>Dins del mateix full, aneu a **Eines** | **Editor de scripts** i trieu un script del tipus **Full de càlcul**
<li>Elimineu el codi preexistent i enganxeu el codi <a href="https://raw.githubusercontent.com/jmeler/simpleGoogleBooking/master/simpleGoogleBooking.js">simpleGoogleBooking.js</a> substituint **ID_CALENDARI** per l'identificador del calendari que heu guardat anteriorment.
<li>Anar a la opció del menú <strong>Recursos</strong> | <strong>Disparadors del projecte actual</strong> i afegir un disparador per la funció <strong>UpdateCalendarAndSendMail</strong> amb esdeveniments <strong>Del full de càlcul / Enviament del formulari</strong>
<li>Inserir el codi d'inserció del formulari i del calendari a la vostra pàgina.

**Demostració:** http://agora.xtec.cat/nodes/reserva-de-recursos
