# IWISmartCoffee Backend

Lokal muss eine PostgreSQL DB installiert sein mit folgendem Benutzer:
  ```
  username: postgres
  password: postgres
  ```

Anschließend muss eine Datenbank mit folgendem Namen erstellt werden:
  ```
  smartcoffee
  ```

Der Spring Server wird über die IDE gestartet als Run Configuration.
 Wichtig ist, dass folgendes Profil als VM-Argument aktiviert wird:
  ```
  -Dspring.profiles.active=develop
  ```
Diese Einstellung verwendet die application-develop.properties aus dem src/main/resources Ordner.
Beim Starten werden die benötigten Tabellen in der Datenbank angelegt und mit initialen Werten befüllt.
Der Server ist unter http://localhost:8080 erreichbar. Die meisten Schnittstellen werden unterhalb von /api zu finden sein.