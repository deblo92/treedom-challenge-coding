# Treedom-challenge-coding

Lista delle funzionalita integrate in questo progetto
    - Registrazione
    - Login
    - Cambio ruolo utente
    - Forgot and Reset Password
    - Revoca token sia singolo che per data

## Chiamata di registrazione
La chiamata di registrazione e'fatta passando "name", "email", "password" e "roles" che mi serviranno poi per fare dei controlli a livello di autorizzazione nelle varie funzionalita, metto qui sotto due esempi di utenti, uno Admin e l'altro Users
```shell
{
    "name": "User Di test",
    "email" : "users@users.it",
    "password": "users",
    "roles" : {
        "USERS": "users"
    }
}
```

```shell
{
    "name": "Admin Di test",
    "email" : "admin@admin.it",
    "password": "admin",
    "roles" : {
        "ADMIN": "admin"
    }
}
```
## Login
Endpoint: "/api/user/login".

Se va a buon fine la fase di login verra creato un token JWT con all'interno l'id dell'utente e i suoi ruoli ed innestato nell'Authorization header.
In questa fase verra salvato nel database, nella tabella Tokens, il suo token con la data di scadenza, la data di creazione e un campo booleano che servirá per revocare quel token.

## Cambio password
Endpoints: "/api/password/forgot-password", "/api/password/reset-password".

Per il cambio della password l'utente dovra come prima cosa inserire la propria email. 
Una volta verificato che esista un utente con quella email verra creato un token, salvato nella tabella Tokens, e mandato all'utente un'email con un link per resettarla.
Il salvataggio della nuova password avverrá solamente, se viene passato sia il token che la password e verificata la validatá del token.

## Revoca token
Endpoint "/api/tokens/revoke".
La revoca dei token é possibile solamente se viene mandato nell'Authorization header un token valido, non scaduto ne gia revocato.
Questa chiamata prevede che vengano passati due campi ma non tutti e due insieme cioe, token e created_by.
Passare solo il token indica che si voglia revocare quello specifico token e quest'operazione la puo fare un utente ADMIN oppure se l'auth user sta cercando di revocare un suo token.
Mentre passandro il created_by si vuole revocare tutti i token emessi da una specifica data e questa operazione la puo fare solo un ADMIN.

## Cambio permessi
Endpoint: "/api/permissions/change".
Questo endpoint vuole che gli vengano passati due campo, "email" e roles:
```shell
{
    "email": "users@users.it",
    "roles": {
        "EDITOR" : "editor"
    }
}
```
Questo endpoint é protetto da due middleware uno verifica che ci sia nell'Authorization header un token valido e il secondo verifica che quello specifico utente possa eseguire questa operazione, in questo caso lo potra fare solamente un ADMIN.
Una volta cambiato i permessi a quello speficico utente verranno revocati tutti i suoi token in modo tale che sará constretto a rieffettuare il login e quindi utilizzare un nuovo token di autorizzazione.