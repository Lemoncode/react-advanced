# 01 React 19 - No Forward Ref

## Resumen

Lo de `Forward Ref` es algo un poco raro, los chicos de Facebook se han dado cuenta y en React 19 lo han eliminado y nos dejan usar `Ref` directamente.

Vamos a ver cómo hacerlo.

## Paso a Paso

- Partimos del ejemplo anterior.

- Vamos a actualizar a React 19 Beta:

Repetimos los mismos pasos que en el otro ejemplo que migramos a 19 Beta

Vamos a parar el server y vamos a instalar la versión 19 de React (ojo aquí esta como Beta, en cuando este en Release no hará falta liar tanto pollo):

Vamos a actualizar las dependencias de react y react dom para tirar con esta Beta (puede que ya este en RC o Release)

```bash
npm install react@beta react-dom@beta --force
```

Y para actualizar los tipos, ahora que estamos en beta tenemos que hacer algún truco de magía

_./package.json_

```diff
  "dependencies": {
    "react": "^19.0.0-beta-26f2496093-20240514",
    "react-dom": "^19.0.0-beta-26f2496093-20240514",
    "react-router-dom": "^6.23.1"
  },
  "devDependencies": {
-    "@types/react": "^18.2.66",
-    "@types/react-dom": "^18.2.66",
+    "@types/react": "npm:types-react@beta",
+    "@types/react-dom": "npm:types-react-dom@beta",
    "@typescript-eslint/eslint-plugin": "^7.2.0",
    "@typescript-eslint/parser": "^7.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  },
+   "overrides": {
+    "@types/react": "npm:types-react@beta",
+    "@types/react-dom": "npm:types-react-dom@beta"
+  }

```

Vamos a hacer otro _npm install force_

```bash
npm install --force
```

y volemos a ejecutar para ver que no hemos roto nada:

```bash
npm run dev
```

> Más info: https://react.dev/blog/2024/04/25/react-19-upgrade-guide#typescript-changes

Más adelante cuando esté publicado podremos usar:

```bash
npm install @types/react@beta @types/react-dom@beta
```


- Ahora vamos a eliminar el `Forward Ref` y vamos a usar `Ref` directamente.

_./src/common/input.component.tsx_

```diff
import React from "react";

export interface InputProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
+ ref: React.RefObject<HTMLInputElement>;  
}

- export const InputComponent = React.forwardRef<
-  HTMLInputElement,
-  InputProps
- >((props, ref) => {
+ export const InputComponent = (props: InputProps) => {
-  const { label, value, onChange } = props;
+  const { label, value, onChange, ref } = props;

  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <input
      ref={ref}
      placeholder={label}
      value={value}
      onChange={handleChange}
    />
  );
- });
+ }
```