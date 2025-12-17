import { describe } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';

import app from '../app';
import { create, getAll } from '../functions/api/case';
import prisma from '../common/client';
import { Sql } from '@prisma/client/runtime/library';

chai.use(chaiHttp);

describe("case tests", () => {
    before(() => {
        prisma.$executeRaw`
          DELETE FROM "Case"
        `;
    });

    describe("unit tests", () => {
        describe("getAll", () => {
            it("should return 200 and be an array", async () => {
                const result = await getAll();
                expect(result.body).to.be.an("array");
            });
        });
    });

    describe("intergration tests", () => {
        describe("POST /api/case/create", () => {
            it("should receive 200", () => {
                chai.request(app)
                .post("/api/case/create")
                .send({content: "Hello there"})
                .end((err, res) => {
                    expect(res.status).to.equal(StatusCodes.CREATED);
                });
            });

            it("should receive 400", () => {
                chai.request(app)
                .post("/api/case/create")
                .send({content: ""})
                .end((err, res) => {
                    expect(res.status).to.equal(StatusCodes.BAD_REQUEST);
                });
                chai.request(app)
                .post("/api/case/create")
                .send({content: 1337})
                .end((err, res) => {
                    expect(res.status).to.equal(StatusCodes.BAD_REQUEST);
                });
                chai.request(app)
                .post("/api/case/create")
                .send({content: "            "})
                .end((err, res) => {
                    expect(res.status).to.equal(StatusCodes.BAD_REQUEST);
                });
            });
            it("should trim", () => {
                chai.request(app)
                .post("/api/case/create")
                .send({content: "hello there        \n           "})
                .end((err, res) => {
                    expect(res.status).to.equal(StatusCodes.CREATED);
                    expect(res.body.body.content).to.equal("hello there");
                });
            });
        });

        describe("GET /api/case/all", () => {
            it("should receive 401 without token", () => {
                chai.request(app)
                .get("/api/case/all")
                .end((err, res) => {
                    expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
                });
            });

            it("should receive 200 with valid token", () => {
                chai.request(app)
                .get("/api/case/all")
                .set("Authorization", "Bearer admin")
                .end((err, res) => {
                    expect(res.status).to.equal(StatusCodes.OK);
                    expect(res.body.body).to.be.an("array");
                });
            });
        });

        describe("POST /api/case/answer/:id", () => {
            it("should receive 401 without token", () => {
                chai.request(app)
                .post("/api/case/answer/-1")
                .end((err, res) => {
                    expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
                });
            });

            it("should receive 200 with valid token", async () => {
                const id = (await create("", "Hej hej", "d-sys@d.kth.se", null, null)).body.id;
                chai.request(app)
                .post(`/api/case/answer/${id}`)
                .set("Authorization", "Bearer admin")
                .end((err, res) => {
                    expect(res.status).to.equal(StatusCodes.OK);
                });
            });
        });

        describe("DELETE /api/case/:id", () => {
            it("should receive 401 without token", () => {
                chai.request(app)
                .delete("/api/case/-1")
                .end((err, res) => {
                    expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
                });
            });

            it("should receive 200 with valid token", async () => {
                const id = (await create("", "Hej hej", "", null, null)).body.id;
                chai.request(app)
                .delete(`/api/case/${id}`)
                .set("Authorization", "Bearer admin")
                .end((err, res) => {
                    expect(res.status).to.equal(StatusCodes.OK);
                });
            });
        });
    });
});
