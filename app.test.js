const request = require("supertest");
const app = require('./app');

describe("/POST user", () => {
    describe("Testing la chiamata di register", () => {
        //Verifico che mi venga passato un json
        test("Status code of register return 200", async () => {
            const response = await request(app).post('/api/user/register').send(
                {
                    "name": "Admin di test",
                    "email" : "admin@admin.it",
                    "password": "admin",
                    "roles" : {
                        "ADMIN": "admin"
                    }
                }
            )
            expect(response.statusCode).toBe(200)
        })
    })
    describe("Voglio che il valore di ritorno di Register sia un json", () => {
        test("Content Type must be a json", async () => {
            const response = await request(app).post('/api/user/register').send(
                {
                    "name": "User di test",
                    "email" : "users@users.it",
                    "password": "users",
                    "roles" : {
                        "USERS": "users"
                    }
                }
            )
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    })
    describe("Testing chiamata di login", () => {
        test("Status code of login must be 200", async () => {
            const response = await request(app).post('/api/user/login').send(
                {
                    "email" : "admin@admin.it",
                    "password": "admin"
                }
            )
            expect(response.statusCode).toBe(200)
        }),
        test("Check if content type is json", async () => {
            const response = await request(app).post('/api/user/login').send(
                {
                    "email" : "users@users.it",
                    "password": "users"
                }
            )
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    })
})

describe("/POST Token", () => {
    describe("Testo la chiamata di revoca token", () => {
        //Verifico che mi venga passato un json
        test("Verifico che ritori 401 con un token non valido", async () => {
            const response = await request(app).post('/api/tokens/revoke')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJfaWQiOiI2Mjc1OTA0Y2RjM2UzZTRhNGNiMThmODkiLCJyb2xlcyI6WyJ1c2VycyJdfSwiaWF0IjoxNjUxODcxODgyLCJleHAiOjE2NTE4NzU0ODJ9.hGuk3brocS7eaFQA_CpWpD49adf-ghmQP-lJ2qC0Ohw')
            .send(
                {
                    "token" : "",
                    "created_by" : "2022-05-10"
                }
            )
            expect(response.statusCode).toBe(401)
        }),
        test("Verifico che ritorni 200 con un token valido e di un Admin", async () => {
            const response = await request(app).post('/api/tokens/revoke')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJfaWQiOiI2MjczY2UxNGMzMjk0ODk1ZGRiNDJkYmUiLCJyb2xlcyI6WyJhZG1pbiJdfSwiaWF0IjoxNjUxODcxODU5LCJleHAiOjE2NTE4NzU0NTl9.HQziMGm2vJZKVaelonOkprwAdbIEyCjm7IHLy1roniA')
            .send(
                {
                    "token" : "",
                    "created_by" : "2022-05-10"
                }
            )
            expect(response.statusCode).toBe(200)
        }),
        test("Verifico che ritorni 200 se passo un admin token e un token esistente", async () => {
            const response = await request(app).post('/api/tokens/revoke')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJfaWQiOiI2MjczY2UxNGMzMjk0ODk1ZGRiNDJkYmUiLCJyb2xlcyI6WyJhZG1pbiJdfSwiaWF0IjoxNjUxODcxODU5LCJleHAiOjE2NTE4NzU0NTl9.HQziMGm2vJZKVaelonOkprwAdbIEyCjm7IHLy1roniA')
            .send(
                {
                    "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJfaWQiOiI2MjczY2UxNGMzMjk0ODk1ZGRiNDJkYmUiLCJyb2xlcyI6WyJhZG1pbiJdfSwiaWF0IjoxNjUxODcxODU5LCJleHAiOjE2NTE4NzU0NTl9.HQziMGm2vJZKVaelonOkprwAdbIEyCjm7IHLy1roniA",
                    "created_by" : ""
                }
            )
            expect(response.statusCode).toBe(200)
        })
    })
})

describe("/POST Permission", () => {
    describe("Testo la chiamata cambio permessi", () => {
        //Verifico che mi venga passato un json
        test("Verifico che tramite un token admin mi restituisca 200", async () => {
            const response = await request(app).post('/api/permissions/change')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJfaWQiOiI2MjczY2UxNGMzMjk0ODk1ZGRiNDJkYmUiLCJyb2xlcyI6WyJhZG1pbiJdfSwiaWF0IjoxNjUxODc1MjY0LCJleHAiOjE2NTE4Nzg4NjR9.N0etcCu59KoqC3kcw2P9Yb_9ejtQy8lx6Xx32Ary-c8')
            .send(
                {
                    "email": "users@users.it",
                    "roles": {
                        "USERS" : "users"
                    }
                }
            )
            expect(response.statusCode).toBe(200)
        }),
        test("Verifico che tramite un token non admin mi restituisca 401", async () => {
            const response = await request(app).post('/api/permissions/change')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJfaWQiOiI2Mjc1OTA0Y2RjM2UzZTRhNGNiMThmODkiLCJyb2xlcyI6WyJ1c2VycyJdfSwiaWF0IjoxNjUxODcxODgyLCJleHAiOjE2NTE4NzU0ODJ9.hGuk3brocS7eaFQA_CpWpD49adf-ghmQP-lJ2qC0Ohw')
            .send(
                {
                    "email": "users@users.it",
                    "roles": {
                        "USERS" : "users"
                    }
                }
            )
            expect(response.statusCode).toBe(401)
        })
    })
})

describe("/POST Password", () => {
    describe("Testo la chiamata per la password dimenticata", () => {
        //Verifico che mi venga passato un json
        test("Se manca la email deve restituire 422", async () => {
            const response = await request(app).post('/api/password/forgot-password')
            .send(
                {
                    "mail" : "test@test.it"
                }
            )
            expect(response.statusCode).toBe(422)
        }),
        test("Se non trovo l'utente errore 404", async () => {
            const response = await request(app).post('/api/password/forgot-password')
            .send(
                {
                    "email" : "test@test.it"
                }
            )
            expect(response.statusCode).toBe(404)
        }),
        test("Ritorno 200 se la procedura va fino in fondo", async () => {
            const response = await request(app).post('/api/password/forgot-password')
            .send(
                {
                    "email" : "admin@admin.it"
                }
            )
            expect(response.statusCode).toBe(200)
        })
    }),
    describe("Testo la chiamata per il reset della password", () => {
        //Verifico che mi venga passato un json
        test("Deve tornare un json se va fino in fondo", async () => {
            const response = await request(app).post('/api/password/reset-password')
            .send(
                {
                    "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjczY2UxNGMzMjk0ODk1ZGRiNDJkYmUiLCJpYXQiOjE2NTE4Nzk1NjcsImV4cCI6MTY1MTg4MzE2N30.yxy26XPRyBDi1hRBJHNp8bs316P4FFBQOBUdo3CXTQA",
                    "password" : "password",
                    "password_confirmation": "password"
                }
            )
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
        test("Se il token é revocato deve tornare 401", async () => {
            const response = await request(app).post('/api/password/reset-password')
            .send(
                {
                    "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjczY2UxNGMzMjk0ODk1ZGRiNDJkYmUiLCJpYXQiOjE2NTE4Nzg1MzIsImV4cCI6MTY1MTg4MjEzMn0.aVKrYaq-zvpUwruxZWrUx8PE6k3rRxJUbj2ruEHL2rg",
                    "password" : "password",
                    "password_confirmation": "password"
                }
            )
            expect(response.statusCode).toBe(401)
        })
    })
})


