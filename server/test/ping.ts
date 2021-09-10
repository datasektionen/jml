import { describe } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { ping } from '../functions/api/ping';
import { StatusCodes } from 'http-status-codes';

import app from '../app';

chai.use(chaiHttp);

describe("ping", () => {
    describe("unit tests", () => {   
        it("body should be pong", () => {
            const result = ping();
            expect(result.body).to.equal("pong");
        });
    });

    // Integration test
    describe("integration tests", () => {
        it("/api/ping should return 200 OK and 'pong'", () => {
            chai.request(app)
            .get("/api/ping")
            .end((err, res) => {
                expect(res.status).to.equal(StatusCodes.OK);
                expect(res.body.body).to.equal("pong");
                expect(err).to.equal(null);
            });
        });
    });
});