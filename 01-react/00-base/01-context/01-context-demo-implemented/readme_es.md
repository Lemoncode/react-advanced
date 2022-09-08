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

- Para ver que problema resolvemos vamos a meterle un retraso de 3 segundos a la api que nos pide
  datos de github

_./src/pods/list/list.api.ts_

```diff
import { MemberEntityApi } from "./list.api-model";
import { MemberEntity } from "./list.vm";

- export const getMemberCollection = (): Promise<MemberEntityApi[]> =>
-  fetch(`https://api.github.com/orgs/lemoncode/members`).then((response) =>
-    response.json()
-  );

+ export const getMemberCollection = (): Promise<MemberEntityApi[]> => {
+  const promise = new Promise<MemberEntityApi[]>((resolve, reject) => {
+    setTimeout(() => {
+      fetch(`https://api.github.com/orgs/lemoncode/members`).then((response) =>
+        resolve(response.json()));
+    }, 3000);
+  });
+
+  return promise;
+ }
```

- En este caso podríamos plantear si poner el context y provider dentro de correo o dentro del pod en
  el que se usa, en este caso lo vamos a poner dentro del pod ya que sólo lo usaremos allí, si más
  adelante lo usáramos en más de una ventana podríamos plantear moverlo a creo (a nivel de imports
  es más correcto tenerlo allí, a nivel de código es más correcto tenerlo en el pod).

_./src/pods/list/list.context.ts_

```ts
import React from "react";
import { MemberEntity } from "./list.vm";

export interface MemberListContextVm {
  memberList: MemberEntity[];
  loadMemberList: () => void;
}

export const MemberListContext = React.createContext<MemberListContextVm>({
  memberList: [],
  loadMemberList: () => {
    console.log(
      "If you are reading this, likely you forgot to wrap your component with the MemberListContext.Provider"
    );
  },
});
```

_./src/pods/list/list.provider.ts_

```ts
import React from "react";
import { MemberEntity } from "./list.vm";
import { MemberListContext, MemberListContextVm } from "./list.context";
import { getMemberCollection } from "./list.repository";

interface Props {
  children: React.ReactNode;
}

export const MemberListProvider: React.FC<Props> = ({ children }) => {
  const [memberList, setMemberList] = React.useState<MemberEntity[]>([]);

  const loadMemberList = () =>
    getMemberCollection().then((memberCollection) =>
      setMemberList(memberCollection)
    );

  return (
    <MemberListContext.Provider
      value={{
        memberList,
        loadMemberList,
      }}
    >
      {children}
    </MemberListContext.Provider>
  );
};

export const useMemberListContext = () => {
  const context = React.useContext<MemberListContextVm>(MemberListContext);
  if (!context) {
    throw new Error("MemberListContext must be used within a ProfileProvider");
  }
  return context;
};
```

Vamos a exponer el provider en el _index_

```diff
export * from "./list.container";
+ export * from "./list.provider";
```

Vamos a definirlo por encima del router:

_./src/app.tsx_

```diff
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RouterComponent } from "@/core";
import { ProfileProvider } from "@/core/providers";
+ import { MemberListProvider } from "@/pods/list";

export const App = () => {
  return (
    <ProfileProvider>
+     <MemberListProvider>
        <RouterComponent />
+      </MemberListProvider>
    </ProfileProvider>
  );
};
```

Y ahora darle uso en _list.container.tsx_:

_./src/pods/list/list.container.tsx_

```diff
import React from "react";
import { ListComponent } from "./list.component";
import { MemberEntity } from "./list.vm";
import { getMemberCollection } from "./list.repository";
import { mapMemberCollectionFromApiToVm } from "./list.mapper";
import { MemberEntityApi } from "./list.api-model";
+ import { useMemberListContext } from "./list.provider";

export const ListContainer: React.FC = () => {
-  const [members, setMembers] = React.useState<MemberEntity[]>([]);
+  const {memberList, loadMemberList} = useMemberListContext();


  React.useEffect(() => {
-    getMemberCollection().then((memberCollection) =>
-      setMembers(memberCollection)
-    );
+    loadMemberList();
  }, []);

-  return <ListComponent members={members} />;
+  return <ListComponent members={memberList} />;

};

```

Si ahora ejecutamos podemos ver que la segunda vez que navegamos a la página, mostramos la lista
que se cargo anteriormente mientras se carga la nueva, ofreciendo una mejor experiencia de usuario.

Nos puede surgir una duda aquí y es ¿Y que hacemos con la primera carga? Sería buena idea mostrar
un indicador de que la página está cargando
