# Falcor onboarding exercises

To run tests:

```bash
$ npm test
```

To run tests with debug logging: 

```bash
$ LOG_LEVEL=debug npm test
```

Types:

```js
type JsonGraph = {};
type Key = string | boolean | number | null;
type Path = Key[];
type Range = { from: number, to: number };
type KeySet = Key | Range | (Key | Range)[];
type PathSet = KeySet[];
```