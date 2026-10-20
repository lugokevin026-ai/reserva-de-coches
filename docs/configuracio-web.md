# Configuració i publicació de la web

## 1. El fitxer mkdocs.yml

El fitxer mkdocs.yml és el fitxer principal de configuració de MkDocs. Serveix per definir el nom de la web el tema visual el logotip i les pàgines del menú.

En el nostre projecte utilitzem el tema windmill-dark i hem afegit una nova pàgina al menú anomenada Configuració web. També hem configurat extensions de Markdown per afegir avisos i contingut desplegable.

### Exemple del canvi

Hem afegit la pàgina configuracio-web.md a la navegació perquè es pugui obrir des del menú principal.

[Afegir captura del fitxer mkdocs.yml]

## 2. El fitxer deploy.yml

El fitxer deploy.yml defineix un flux de treball de GitHub Actions. En el nostre projecte s'executa quan es publiquen canvis a la branca main.

Primer descarrega el repositori i prepara Python. Després instal·la el tema windmill-dark construeix la web i publica els fitxers generats a GitHub Pages.

### Exemple del canvi

Hem afegit el nom Construir la web al pas que executa mkdocs build. Això permet identificar millor aquesta fase als registres de GitHub Actions.

[Afegir captura del fitxer deploy.yml]

## 3. Plugins i extensions

Els plugins i les extensions permeten ampliar les funcions de MkDocs. En aquest projecte utilitzem windmill-dark com a tema visual i extensions de Markdown per millorar la presentació dels continguts.

## 4. Conclusió

El fitxer mkdocs.yml controla la configuració i la navegació de la web. El fitxer deploy.yml automatitza la construcció i la publicació a GitHub Pages. D'aquesta manera podem actualitzar la documentació i publicar els canvis sense fer tot el procés manualment.