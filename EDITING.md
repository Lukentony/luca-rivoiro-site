# Come modificare il sito (guida semplice)

## Le due regole da sapere prima di iniziare

1. **Il sito è bilingue nel codice**: ogni testo ha due versioni fianco a fianco, dentro
   `<span class="lang-it">...testo IT...</span><span class="lang-en">...testo EN...</span>`.
   Modifica sempre entrambe, altrimenti chi guarda in inglese vede il testo vecchio.
2. **Zona sicura**: puoi cambiare solo il testo tra `>` e `<`. Non toccare mai `<`, `class="..."`,
   `href="..."` — quella è la struttura, se la rompi il sito smette di funzionare o perde lo stile.

## Modo più semplice: da GitHub, senza installare nulla

1. Vai su https://github.com/Lukentony/luca-rivoiro-site
2. Apri `index.html` (homepage) oppure il file dentro `progetti/` che vuoi cambiare
3. Clicca l'icona a matita in alto a destra del file (modalità modifica)
4. Cambia il testo
5. In fondo alla pagina scrivi una riga che descrive la modifica, poi clicca "Commit changes"
6. Il sito si aggiorna da solo in circa 1 minuto (Cloudflare Pages fa il deploy a ogni commit)

Funziona da telefono o computer, zero installazioni.

## Modo alternativo: da terminale

Il repo è già clonato su questa macchina in `~/luca-personal-site`.

```bash
cd ~/luca-personal-site
# modifica index.html con un editor qualsiasi
git add index.html
git commit -m "descrizione della modifica"
git push
```

## Ricette pronte (copia-incolla)

### Aggiungere un nuovo progetto

Dentro `index.html`, cerca `<div class="projects-grid">` e incolla questo blocco
subito prima del `</div>` di chiusura della sezione:

```html
<article class="card">
  <h3 class="card-title"><a href="LINK">Nome Progetto</a></h3>
  <p class="card-desc"><span class="lang-it">Descrizione in italiano.</span><span class="lang-en">Description in English.</span></p>
  <div class="tags"><span class="tag">Tech1</span><span class="tag">Tech2</span></div>
</article>
```

`LINK` è `/progetti/nome-pagina` se hai creato una sottopagina, oppure un link GitHub diretto
(aggiungi `target="_blank" rel="noopener"` nel tag `<a>`) se è un progetto piccolo senza sottopagina.

### Aggiungere una competenza

Trova la categoria giusta dentro `<div class="skills-grid">` e aggiungi dentro il `<div class="tags">`
corrispondente:

```html
<span class="tag">NomeTecnologia</span>
```

### Modificare un testo esistente

Cerca la frase italiana (Ctrl+F nel browser), sostituiscila dentro il suo `<span class="lang-it">...</span>`,
poi fai lo stesso subito dopo nel `<span class="lang-en">...</span>` corrispondente.

## Cosa non toccare mai

- Non cancellare i tag `<span class="lang-it">` / `<span class="lang-en">`, solo il testo dentro
- Non toccare `class="..."` — sono gli agganci dello stile grafico
- Se non sei sicuro: su GitHub, prima di confermare, guarda la scheda "Preview" per vedere il diff
