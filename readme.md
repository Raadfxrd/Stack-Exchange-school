[[_TOC_]]

## Opdrachtomschrijving

Dit is het project voor Software Engineering in blok 2 (2023 - 2024).

In blok 1 heb je gewerkt aan je eerste project, Dokkie. Waarschijnlijk heb je hier je eerste stappen gezet om te leren programmeren en te bouwen aan een echte webapplicatie! Tijdens het bouwen aan Dokkie heb je gebruik gemaakt van door de opleiding geselecteerde bronnen, zoals webcourses, websites, e-books en workshops om te leren over de verschillende technieken die je nodig had.

Naast deze bronnen heb je vast en zeker ook gebruik gemaakt van een zoekmachine om bijvoorbeeld op te zoeken hoe je een loop programmeert in TypeScript of wat die vervelende error-melding in Visual Studio Code nu precies betekent. Het overzicht met (IT-gerelateerde) resultaten in je zoekmachine bevat bijna altijd een of meerdere links naar een heel handige website: Stack Overflow, waar je meestal wel een antwoord op je vraag vindt. Stack Overflow omschrijft zichzelf als:

> "Empowering the world to develop technology through collective knowledge. Our public platform serves millions of people every month, making it one of the most popular websites in the world."

Het is natuurlijk een heel handige website, maar je vindt er bijvoorbeeld geen antwoord op specifieke vragen over bijvoorbeeld de API van de HBO-ICT Cloud. Zou het daarom niet handig zijn als er een community is waar je als student van HBO-ICT vragen en antwoorden kunt posten over (HBO-ICT gerelateerde) programmeerproblemen en ontwikkelomgevingen?

## Wat je gaat maken

In blok 2 ga je werken aan Code Exchange, een klein platform waarmee bovenstaande mogelijk is. Schrik niet, er wordt niet van je verwacht dat je een tweede Stack Overflow gaat bouwen. Een groot verschil met Dokkie is dat iedereen nu in duo's aan de slag gaat. Je bouwt dus met z'n tweeën aan hetzelfde project. Dat betekent dat je afhankelijk wordt van je medestudent en dus goed moet communiceren over bijvoorbeeld werkverdeling. Ook werk je samen in dezelfde GitLab repository. Het veelvuldig committen van je code met een informatieve beschrijving wordt dus heel belangrijk! En zo zijn er nog veel meer zaken waar je aan moet denken als je met z'n tweeën aan hetzelfde project werkt.

Om ideeën op te doen voor het platform mag je best kijken naar wat Stack Overflow of vergelijkbare platforms te bieden hebben. Tijdens dit blok is het erg belangrijk dat de user interface van je website, de front-end, intuïtief is en voldoet aan de verwachtingen van de gebruiker. Je gaat dan ook een gebruikersonderzoek doen en verschillende versies van je user interface bouwen en testen. Vanzelfsprekend schrijf je ook weer code om alle benodigde functionaliteiten te realiseren en de front- en back-end met elkaar te laten samenwerken. Vergeet niet om hetgeen je tijdens blok 1 geleerd hebt ook weer toe te passen. Dus denk bijvoorbeeld aan de coding conventions, het toepassen van de basisconcepten van programmeren en het documenteren van je werk. Verder ga je je meer verdiepen in databases en leer je een nieuwe vorm van programmeren: Object Oriented Programming (OOP).

## Learning stories

Tijdens dit project werk je weer aan **learning stories**. Daarin staan de te leren vaardigheden en competenties binnen dit project. Ze geven je houvast bij wat je moet leren. Je vindt ze onder `Issues > Boards > Selecteer <Product Backlog> in de dropdown`. Een learning story hoeft niet aan een `Milestone` te worden gekoppeld.

## User stories

Ook voor deze opdracht zijn user stories opgesteld. Die ga je weer gebruiken om de webapplicatie te bouwen. Iedere usere story bevat een aantal acceptatiecriteria en taken, die je houvast geven bij het bouwen. Wat je ook gaat doen is een aantal eigen user stories opstellen. Houd hiervoor onderstaand format aan.

Wat is een user story ook al weer? Op [scrumguide.nl](https://scrumguide.nl/user-story/) vind je de volgende definitie:

> “Een User Story is een korte beschrijving (Story) van wat een gebruiker (User) wil. User Stories worden gebruikt bij het ontwikkelen van producten of software binnen Agile raamwerken, waaronder Scrum. Een User Story bestaat uit enkele zinnen waarin staat wat de gebruiker van het product moet / wil doen. Een User Story is eigenlijk weinig gedetailleerd en zou moeten kunnen passen op een post-it. Via de User Story heeft de gebruiker invloed op het ontwikkelen van een systeem of product en uiteindelijk de functionaliteit ervan.”

Een user story noteer je volgens een vast format:

_Als … (soort gebruiker) wil ik … (feature/actie), zodat … (doel/voordeel)._

Een voorbeeld van een user story:

_“Als gamer wil ik met mijn ruimteschip kunnen schieten als ik op de spatiebalk druk, zodat ik vijandige aliens kan uitschakelen.”_

### De product backlog van deze opdracht

Omdat we werken volgens Scrum staan de user stories en de learning stories voor deze opdracht op de Product Backlog. De product backlog vind je in deze Gitlab-repository onder `Issues > Boards > Selecteer <Product Backlog> in de dropdown`. **Je bouwt user stories om de learning stories te kunnen voltooien.**

## Sprints

Je werkt weer in sprints. Tijdens een sprint selecteer je de user stories van de `Product Backlog` die je denkt te kunnen gaan bouwen tijdens een sprint. In totaal zijn er 3 sprints:

- Sprint 1, duurt 2 weken en loopt van 20 november - 3 december;
- Sprint 2, duurt 2 weken en loopt van 4 december - 17 december;
- Sprint 3, duurt 3 weken en loopt van 8 januari - 28 januari.

Om een user story toe te wijzen aan een sprint wijs je deze toe aan een `Milestone`. Dit kun je doen bij de eigenschappen van een user story. Zie hiervoor wederom de pagina `Issues`. **Aan het eind van een sprint moet er altijd een bruikbaar product zijn voor de eindgebruiker.** User stories die niet af zijn gaan door naar de volgende sprint. Test een user story dus goed voordat je deze op _Done_ zet!

## Definition of Done (DoD)

Binnen scrum dient iedere user story te voldoen aan een zogenaamde Definition of Done (DoD). Door het opstellen en aanhouden van een Definition Of Done, zorg je ervoor dat het werk wat je aflevert ook daadwerkelijk gebruikt kan worden. Als je een user story hebt afgebouwd zet je 'm in _verify_ en controleer je of deze voldoet aan de _Definition of Done_ (zie hieronder). Pas als dat in orde is kun je de user story op _Done_ zetten.

### DoD generiek

- [ ] Alle acceptatiecriteria zijn afgevinkt.
- [ ] Het werk is (technisch) gedocumenteerd en relevant voor collega-ontwikkelaars. Denk o.a. aan ERD, UML, leerproces, testen en testresultaten.
- [ ] Het werk is geschreven in Standaardnederlands.
- [ ] Het werk staat in de GitLab repository.
- [ ] Het werk is gereviewd door een peer.
- [ ] Het werk voldoet aan het Think-Make-Check (TMC) principe.
- [ ] De code is opgesteld volgens de HBO-ICT coding conventions.
- [ ] De code is handmatig functioneel getest op fouten.
- [ ] De code werkt zonder fouten bij normaal gebruik.
- [ ] De webapplicatie dient zowel op mobiele- als desktop-apparaten gebruikt te kunnen worden.

### DoD specifiek
- [ ] Behoeftes van de gebruiker zijn terug te zien in de applicatie op basis van o.a. een mindmap en Guerilla test(en).
- [ ] Gebruikerservaring van de applicatie is aangepast en verbeterd op basis van een Inspiratie analyse, bevindigen uit Guerilla test(en) en gebruikerstesten.
- [ ] Er is visuele feedback wanneer een gebruiker een actie uitvoert in de applicatie.

## Wanneer is Code Exchange klaar?

Voor het bouwen van deze opdracht heb je 3 sprints de tijd. Aan het einde van die periode moet je applicatie aan een aantal verwachtingen voldoen. We noemen dit de kwaliteitscriteria. Voor dit blok zien de kwaliteitscriteria er als volgt uit:

| Cat | Nr | Kwaliteitscriteria | HBO-i model |
|-----|----|--------------------|-------------|
| 1 | K1 | Je hebt (een groot deel van) de user stories afgerond. | G, S |
| 1 | K2 | Je hebt de behoeftes van de doelgroep onderzocht en gebruikt om zelf een aantal user stories te schrijven. | G-A |
| 1 | K3 | Je hebt de gebruikersinterface van jouw product aangepast door prototyping toe te passen. | G-A, G-O, G-R |
| 1 | K4 | Je hebt een testplan geschreven en gebruikt om een gebruikerstest uit te voeren. | G-R |
| 2 | K5 | Je hebt object georiënteerd geprogrammeerd en maakt gebruik van objectgeoriënteerde technieken zoals abstraction, inheritance en encapsulation. | S-O, S-R |
| 2 | K6 | Je hebt een genormaliseerde relationele database ontworpen en gebruikt om informatie uit je project in op te slaan, op te halen en te bewerken. | S-O, S-R |
| 2 | K7 | Je hebt je werk beschreven met behulp van UML-technieken. | S-R, S-MC |

## Gedragscriteria

Om een IT-project succesvol op te leveren, is het noodzakelijk dat je leert om je als een professional te gedragen. Je hebt hiervoor vaardigheden nodig, die we binnen het hbo professional skills noemen. Voor dit project dient je gedrag aan de volgende criteria te voldoen:

| Cat. | Nr | Gedragscriteria | HBO-i model |
|------|----|-----------------|-------------|
| 3 | G1 | Je neemt verantwoordelijkheid voor je eigen handelen. Je aanvaardt consequenties van jouw gedrag. Je geeft op constructieve feedback aan medestudenten en ontvangt feedback. Je geeft aan hoe je die feedback gaat gebruiken. Je werkt resultaat gericht aan je opdracht of taak. Je hebt een actieve werkhouding. Je leert van en met elkaar en bent aanwezig op contactmomenten. Je herkent waar je leerbehoeftes zitten en stelt doelen op om deze te vervullen. Je reflecteert op je handelen en je evalueert je doelen.| PL-PO |
| 4 | G4 | Je werkt volgens (gegeven) kwaliteitsnormen. | TO-M |
| 4 | G5 | Je kan constructief samenwerken in een duo. | DI-P |
| 4 | G6 | Je gebruikt bronnen om antwoorden te vinden op een passende manier. | OP-O |
| 4 | G7 | Je kunt je doel door middel van een presentatie begrijpelijk overbrengen aan de doelgroep. | DI-C |
| 4 | G8 | Je schrijft gestructureerde en begrijpelijke documentatie. | DI-C |
| 4 | G10 | Je bent je bewust van de invloed die je uitoefent met jouw werk. | TO-E |

## Lesmateriaal

In de learning stories staan verwijzingen naar het lesmateriaal. Bijvoorbeeld de Knowledge Base, de Digitale Leeromgeving (DLO), videocourses, websites, etc.

## HBO-i

_Binnen deze opdracht ligt de focus op de volgende beroepstaken:_

- Software ontwerpen (S-O) : niveau 1
- Software realiseren (S-R) : niveau 1
- Software manage & control (S-MC) : niveau 1
- Gebruikersinteractie analyseren (G-I) : niveau 1
- Gebruikersinteractie ontwerpen (G-O) : niveau 1
- Gebruikersinteractie realiseren (G-R) : niveau 1

_Binnen deze opdracht ligt de focus op de volgende professional skills:_

- Persoonlijk leiderschap (PL) :
  - Ondernemend zijn (PL-O) : niveau 1
  - Persoonlijke ontwikkeling (PL-PO): niveau 1
- Toekomstgericht organiseren (TO)
  - Managen (TO-M) : niveau 1
  - Ethiek (TO-E) : niveau 1
- Doelgericht interacteren (DI)
  - Communiceren (DI-C) : niveau 1
- Onderzoekend probleemoplossen (OP) :
  - Onderzoeken (OP-O) : niveau 1

++++++++++++++++++++++++++++++++

## Hoe installeer ik het?
Het startproject is gebaseerd op het startproject van Dokkie. Alles wat je daar moest installeren en gebruiken heb je voor dit project dus ook nodig.

- `Clone` dit project met Git en open de map in Visual Studio Code.
- Klik op de `package.json` en in het "NPM Scripts" paneel dat beschikbaar komt, klik met rechts op "package.json" en klik op "Run Install". Als alternatief kun je ook een terminal gebruiken door het command `npm install` te gebruiken.
- Ga naar de website van [HBO-ICT.Cloud](https://hbo-ict.cloud), log in met Surfconext en ga naar het project dat is aangemaakt voor Blok 2. Gebruik dus niet de gegevens van Blok 1!
- Vul de API-key én de volledige naam van de database die je lokaal wilt gebruiken in bij het `.env`-bestand.

In het project zit een login-pagina als voorbeeld. Als je deze lokaal werkend zou willen krijgen, dan heb je de volgende tabel in je database nodig.

```sql
CREATE TABLE `user` (
  `id` int(12) NOT NULL,
  `username` varchar(28) NOT NULL,
  `password` varchar(28) NOT NULL,
  `email` varchar(50) NOT NULL,
  `firstname` varchar(200) NOT NULL,
  `lastname` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user` (`id`, `username`, `password`, `email`, `firstname`, `lastname`) VALUES
(1, 'test', 'test', 'email@email.nl', 'Sinter', 'Klaas');

```

## Hoe gebruik ik het?
- Start de webapplicatie in Visual Studio Code door op de pijl te klikken naast "dev" in het "NPM Scripts" paneel. Of gebruik de terminal: `npm run dev`.
- Nadat alles is opgestart kun je op http://localhost:3000 de website zien.

## Wat zit er in deze repository?
- De broncode in de vorm van een startproject gemaakt met HTML, CSS en TypeScript. Je kunt je website verder bouwen met het startproject als basis
- Een `raw-data`-map. Deze bevat een Excel die je kunt gebruiken om een database mee te ontwerpen
- Een `docs`-map waar je documentatie kunt neerzetten
- Een `src`-map waar TypeScript bestanden staan; elke pagina heeft hier een eigen mapje om het overzichtelijk te houden. In de `config`-map staat het HBO-ICT.Cloud configuratiebestand. Daar hoef je niets mee te doen als je je `.env`-bestanden correct configureert.
- Een `wwwroot`-map waar HTML, CSS en afbeeldingen in zitten.

- Boards
  - Onder de pagina `Issues > Boards `(te vinden via de balk links 👈🏽) vind je verschillende boards:
    - Learning stories;
    - Product backlog met user stories;
    - Sprint 1 backlog (20 november - 3 december);
    - Sprint 2 backlog (4 december - 17 december);
    - Sprint 3 backlog (8 januari - 28 januari).

- Technische documentatie 📄 
    - In de `docs` folder van de broncode komt de technische documentatie. Per learning story schrijf je uit wat je geleerd hebt. Belangrijk is dat de documentatie onderdeel wordt van de broncode. Zo kan je vanuit de ontwikkelomgeving documentatie bijhouden.
