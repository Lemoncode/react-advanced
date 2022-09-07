# Contexto - Refactor

## Resumen

Que vamos a implementar:

- En el contexto de login vamos a hacer una separación de lo que es el contexto del provider.
- Vamos a implementar un helper para traernos el contexto, y vamos a dejar interno el contexto en si.
- Vamos a llevarnos la lista de usuarios de github a un contexto y veremos como podemos navegar y mostrar datos.

## Pasos

- Lo primero separamos contexto de proveedor:

_./profile.context.ts_

_Renombramos a ts_

```diff
import React from "react";
import { UserProfile, createEmptyUserProfile } from "./profile.vm";

export interface ProfileContextVm extends UserProfile {
  setUserProfile: (userProfile: UserProfile) => void;
}

const noUserLogin = "no user login";

export const ProfileContext = React.createContext<ProfileContextVm>({
  userName: noUserLogin,
  setUserProfile: () =>
    console.warn(
      "** If you area reading this, likely you have forgotten to add the provider on top of your app"
    ),
});

-interface Props {
-  children: React.ReactNode;
- }
-
- export const ProfileProvider: React.FC<Props> = ({ children }) => {
-  const [userProfile, setUserProfile] = React.useState<UserProfile>(
-    createEmptyUserProfile()
-  );
-
-  return (
-    <ProfileContext.Provider
-      value={{
-        userName: userProfile.userName,
-        setUserProfile,
-      }}
-    >
-      {children}
-    </ProfileContext.Provider>
-  );
- };
```

- Vamos a llevar el contenido al provider:

_./profile.provider.tsx_

```tsx
import React fro m "react";
import { UserProfile, createEmptyUserProfile } from "./profile.vm";
import { ProfileContext } from "./profile.context";

interface Props {
  children: React.ReactNode;
}

export const ProfileProvider: React.FC<Props> = ({ children }) => {
  const [userProfile, setUserProfile] = React.useState<UserProfile>(
    createEmptyUserProfile()
  );

  return (
    <ProfileContext.Provider
      value={{
        userName: userProfile.userName,
        setUserProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
```

- Esta separación hace que sea más clara la separación entre contexto y proveedor.

- Además de esto nos podemos hacer un helper para no tener que usar _useContext_ a
  secas y controlar errores.

_profile.provider.tsx_

```diff
    </ProfileContext.Provider>
  );
};

+ export const useProfileContext = () => {
+  const context = React.useContext<ProfileContextVm>(ProfileContext);
+  if(!context) {
+    throw new Error('useProfileContext must be used within a ProfileProvider');
+  }
+  return context;
+ };
```

Ahora en el index sólo tenemos que exponer la parte del provider:

_./src/core/providers/profile/index.ts_

```diff
- export * from "./profile.context";
- export * from "./profile.vm";
+ export * from './profile.provider';
```

- Vamos a utilizar el nuevo helper en _loginContainer_ y _appLayout_

_./src/pods/login/login.container.tsx_

```diff
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "core";
import { LoginComponent } from "./login.component";
import { doLogin } from "./login.api";
+ import { useProfileContext } from "core/providers";

const useLoginHook = () => {
  const navigate = useNavigate();
-  const { setUserProfile } = React.useContext(ProfileContext);
+  const { setUserProfile } = useProfileContext();
```

_./src/layouts/appLayout.component.tsx_

```diff
import React from "react";
- import { ProfileContextVm } from "@/core/providers";
+ import { useProfileContext } from "core/providers";

interface Props {
  children: React.ReactNode;
}

export const AppLayout: React.FC<Props> = ({ children }) => {
-  const { userName } = React.useContext(ProfileContext);
+  const { userName } = useProfileContext();

  return (
    <div className="layout-app-container">
      <div className="layout-app-header">{userName}</div>
      {children}
    </div>
  );
};
```

- Asi tenemos una clara separación entre contexto y provider y por otro lado, con la función
  helper podemos controlar errores, y simplificar el uso del context.

- Ahora vamos a llevar la lista de usuarios de github a un contexto, ¿Por qué? Porque queremos
  mejorar la usabilidad de nuestra página:
  - Si navegamos a otra página, cuando volvemos queremos mostrar datos.
  - Mientras en background la consulta se vuelve a ejecutar.
