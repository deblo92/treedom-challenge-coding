# Treedom-challenge-coding

Lista delle funzionalita integrate in questo progetto
    - Registrazione
    - Login
    - Cambio ruolo utente
    - Forgot and Reset Password
    - Revoca token sia singolo che per data

## Chiamata di registrazione
La chiamata di registrazione è fatta passando "name", "email", "password" e "roles" 
I "roles" mi serviranno poi per fare dei controlli a livello di autorizzazione nelle varie funzionalita, metto qui sotto due esempi di utenti, uno Admin e l'altro Users
```shell
{
    "name": "Admin di test",
    "email" : "admin@admin.it",
    "password": "admin",
    "roles" : {
        "ADMIN": "admin"
    }
}
```
```shell
{
    "name": "User di test",
    "email" : "users@users.it",
    "password": "users",
    "roles" : {
        "USERS": "users"
    }
}
```
## Login
Endpoint: "/api/user/login".

Se va a buon fine la fase di login verra creato un token JWT che conterrá al suo interno l'id dell'utente e i suoi ruoli inoltre verrà nell'Authorization header
In questa fase verra salvato nel database, nella tabella Tokens, il token appena generato, con la data di scadenza, la data di creazione, un campo booleano che servirá per revocare quel token e l'id user.

## Cambio password
Endpoints: "/api/password/forgot-password", "/api/password/reset-password".

Per il cambio della password l'utente dovra come prima cosa inserire la propria email. 
Una volta verificato che esista un utente con quella email viene creato un token, salvato nella tabella Tokens e mandata un'email con un link per resettarla (invio email non implementato).
Il salvataggio della nuova password avverrá solamente se viene passato sia il token che la nuova password e verificata la validità del token.

## Revoca token
Endpoint "/api/tokens/revoke".

La revoca dei token é possibile solamente se viene mandato nell'Authorization header un token valido, non scaduto ne gia revocato.
Questa chiamata prevede che vengano passati due campi ma non tutti e due contemporaneamente cioe, token e created_by.
Passando solo il token si vuole revocare quello specifico token e quest'operazione la puo fare un utente ADMIN oppure se l'auth user é il "proprietario" del token da revocare.
Mentre passandro il created_by si vuole revocare tutti i token emessi da una specifica data e questa operazione la puo fare solo un ADMIN.

## Cambio permessi
Endpoint: "/api/permissions/change".

Questo endpoint vuole che gli vengano passati due campo, "email" e roles, metto qui sotto il json di prova:
```shell
{
    "email": "users@users.it",
    "roles": {
        "EDITOR" : "editor"
    }
}
```
Questo endpoint é protetto da due middleware uno verifica che ci sia nell'Authorization header un token valido e il secondo verifica che quello specifico utente possa eseguire questa operazione, in questo caso lo potra fare solamente un ADMIN.
Una volta cambiato i permessi a quello speficico utente verranno revocati tutti i suoi token in modo tale che sará constretto a rieffettuare il login e utilizzare un nuovo token di autorizzazione, dove all'iterno ci saranno i nuovi permessi.