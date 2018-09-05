# Falcor onboarding exercises

Types:

```js
type JsonGraph = {};
type Key = string | boolean | number | null;
type Path = Key[];
type Range = { from: number, to: number };
type KeySet = Key | Range | (Key | Range)[];
type PathSet = KeySet[];
```