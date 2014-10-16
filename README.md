simpleGoogleBooking
===================

Sistema de reserves simple que funciona amb Google Forms i Google Calendar. 
<ul>
<li>Generar events en un calendari automàticament a partir de l'enviament d'un formulari.
<li>Comprova si hi ha solapament amb un event amb el mateix recurs i envia un correu amb el resultat de la reserva.
</ul>

**Instruccions**:
<ol>
<li>Crear un formulari de Google amb aquests opcions marcades:
<ul>
<li>Solicita l'inici de sessió...
<li>Recopila automàticament el nom de l'usuari...
</ul>
<li>Crea els següents camps dins del formulari. Pots canviar el nom però no l'ordre ni el tipus de camp: 
<ul>
<li>Aula o recurs. <strong>Esculliu d'una llista</strong> (fiqueu les opcions que vulgueu). Obligatori.
<li>Inici. <strong>Data</strong>, inclou l'any i l'hora. Obligatori.
<li>Fin. <strong>Hora</strong>. Obligatori.
<li>Comentari. <strong>Text</strong>
</ul>
<li>Anar al full de càlcul associat al formulari, fent clic a l'opció del menú superior **Mostra les respostes**
<li>Dins del mateix full, aneu a **Eines** | **Editor de scripts**
<li>Enganxeu el codi <a href="https://raw.githubusercontent.com/jmeler/simpleGoogleBooking/master/simpleGoogleBooking.js">simpleGoogleBooking.js</a> substituint **ID_CALENDARI** pel identificador del calendari que vulgueu vincular amb la reserva de recursos.
<li>Inserir el codi d'inserció del formulari i del calendari a la vostra pàgina.

**Demostració:** http://agora.xtec.cat/nodes/reserva-de-recursos
