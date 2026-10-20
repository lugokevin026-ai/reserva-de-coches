# Guia d'Arxius de Configuració: deploy.yml i mkdocs.yml

En aquesta secció s'explica quina és la funció dels arxius clau per al funcionament i publicació de la nostra documentació web amb MkDocs.

---

## 1. Què és i quina funció té el `mkdocs.yml`?

El **`mkdocs.yml`** és el fitxer de configuració global de generació de la web[cite: 13]. 

* **Funció:** Defineix el títol del lloc web, el tema visual utilitzat (com ara *windmill-dark*), el logotip corporatiu, les extensions de Markdown habilitades i l'estructura del menú de navegació (`nav`)[cite: 13].
* **Exemple de modificació:** Per afegir una nova secció al menú lateral de la nostra web, hem modificat l'apartat `nav` afegint la línia corresponent:

```yaml
nav:
  - Inici: index.md
  - Configuració web: configuracio-web.md
  - Desplegament i MkDocs: deploy-mkdocs.md