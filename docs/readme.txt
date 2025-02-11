----
npm run start
npm run build
npx electron .
npx electron --disable-gpu --disable-http-cache .
npm start --no-sandbox
----
**Setup** --TO DO 
Trenutno si sve ručno podesila, ali postoji bolji način da se to automatizuje.  
Primeri:  
- [Electron Vite - Uvod](https://electron-vite.org/guide/introduction)  
- [Zašto Electron Vite?](https://electron-vite.github.io/guide/why-electron-vite.html)  
- Build sistem koji koriste je [Vite](https://vite.dev/)  

📌 **Predlog:**  
Sredi strukturu fajlova kako preporučuju:  
[Primer strukture](https://github.com/daltonmenezes/electron-app/blob/main/docs/STRUCTURE.md)  

Ukratko, imala bi:  
- 📂 `/src/main/*` → gde bi bio kod za server  
- 📂 `/src/renderer/*` → gde bi bio kod za aplikaciju  

### 🔄 **Zašto Vite?**  
Vite omogućava **brzi razvoj i optimizovano buildovanje** aplikacije:  
- **Automatski rebuild** → Kada promeniš kod, ne moraš ručno osvežavati aplikaciju, Vite odmah reflektuje promene.  
- **Brzo pokretanje** → Koristi napredne optimizacije kako bi pokrenuo aplikaciju bez čekanja.  
- **Optimizovano buildovanje** → Kada eksportuješ aplikaciju, Vite pravi najmanji mogući izvršni fajl sa svim potrebnim zavisnostima.  

---
