# syncano-cli-plugin-postman

## How it works?

1) Install plugin in your project:
```js
npm install --save-dev @eyedea/syncano-cli-plugin-postman
```

2) Add plugin config to your syncano.yml project config:
```yml
plugins:
  postman: "@eyedea/syncano-cli-plugin-postman"
```

3) Create empty collection in Postman

4) Set variables used by the plugin:
```bash
export POSTMAN_API_KEY=<api key>
export POSTMAN_COLLECTION_ID=<collection id>
```
> You can find collection ID in the Postman URL - when you will onpen collection docs)

5) Run it:
```bash
npx s postman <friendly name of the collection>
```
