

comentar strict mode

```diff
+    <React.StrictMode>
      <HashRouter>
        <Routes>
          <Route path="/" element={<CharacterCollectionPage />} />
          <Route path="/:characterId" element={<CharacterDetailPage />} />
        </Routes>
      </HashRouter>
+    </React.StrictMode>
```

https://blog.bitsrc.io/react-v18-0-useeffect-bug-why-do-effects-run-twice-39babecede93

Se llama dos veces y comentar, en producción no pasa.

Y comentar que dicen que no es buena idea useEffect para Fetch
porque además condiciones de carrera

la API loca... con el interval.





