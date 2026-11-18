# Configuració i publicació de la web

## 1. El fitxer mkdocs.yml

El fitxer `mkdocs.yml` és el fitxer principal de configuració de MkDocs. Serveix per definir el nom de la web, el tema visual, el logotip i les pàgines del menú.

En el nostre projecte utilitzem el tema `windmill-dark`. Hem afegit la pàgina *Configuració web* al menú i també hem configurat les extensions de Markdown que permeten fer avisos i contingut desplegable.

### Exemple del canvi

```yaml
site_name: KYNIC Company

theme:
  name: windmill-dark
  logo: Resources/kynic-logo.png

markdown_extensions:
  - admonition
  - attr_list
  - pymdownx.details
  - pymdownx.superfences

nav:
  - Inici: index.md
  - Configuració web: configuracio-web.md
  - Miembros: miembros.md
```

| Línia | Què fa |
|---|---|
| `site_name` | Nom de la web |
| `theme` | Tema visual i logotip |
| `markdown_extensions` | Avisos, identificadors de secció, contingut desplegable i blocs de codi |
| `nav` | Pàgines del menú principal |

## 2. El fitxer deploy.yml

El fitxer `deploy.yml` defineix un flux de treball de GitHub Actions. En el nostre projecte s'executa quan es publiquen canvis a la branca `main`.

Primer descarrega el repositori i prepara Python. Després instal·la el tema `windmill-dark` i les extensions de Markdown, construeix la web i publica els fitxers generats a GitHub Pages.

### Exemple del canvi

Hem afegit el nom **Construir la web** al pas que executa `mkdocs build`. Això permet identificar millor aquesta fase als registres de GitHub Actions. També hem afegit `pymdown-extensions` a la instal·lació, necessari per als desplegables.

```yaml
      - run: pip install mkdocs-windmill-dark pymdown-extensions

      - name: Construir la web
        run: mkdocs build
```

## 3. Plugins i extensions

Els plugins i les extensions permeten ampliar les funcions de MkDocs. En aquest projecte utilitzem:

| Element | Per a què serveix |
|---|---|
| `windmill-dark` | Tema visual fosc |
| `admonition` | Avisos (quadres de nota i advertència) |
| `pymdownx.details` | Contingut desplegable (preguntes freqüents) |
| `pymdownx.superfences` | Blocs de codi |
| `attr_list` | Identificadors de secció en Markdown |

!!! note "Només Markdown"
    Totes les pàgines estan escrites en Markdown, sense HTML ni CSS propi. L'aspecte visual el dóna només el tema `windmill-dark`.

## 4. Conclusió

El fitxer `mkdocs.yml` controla la configuració i la navegació de la web. El fitxer `deploy.yml` automatitza la construcció i la publicació a GitHub Pages. D'aquesta manera podem actualitzar la documentació i publicar els canvis sense fer tot el procés manualment.
