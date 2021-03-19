const chai = require('chai')

const assert = chai.assert;
const supertest = require("supertest");
const should = require("should");

var server = supertest.agent("http://52.41.87.175:3001");
var toke;

describe("Splitwise Mocha Test", function () {
  it("should login with email and password", function (done) {
    server
      .post("/login")
      .send({
        email: "and@email.com",
        password: "1234",
      })
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        toke = JSON.parse(res.text)["token"]
        assert.typeOf(toke, "string")
        done();
      });
  });

  it("should register email, password, fname, lname using put", function (done) {
    server
      .put("/register")
      .send({
        email: "bru@email.com",
        password: "1234",
        fname: "Bruce",
        lname: "Wayne"
      })
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(404);
        done();
      });
  });

  it("should retrive all email in the system", function (done) {
    server
      .get("/groupSuggest")
      .send({
      })
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        let sug = JSON.parse(res.text)["list"]
        assert.typeOf(sug, "array")
        done();
      });
  });

  it("should retrive profile details in the system", function (done) {
    server
      .post("/profile/initialPull")
      .send({
          token: toke
      })
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        let sug = JSON.parse(res.text)
        assert.typeOf(sug, "object")
        let keys = Object.keys(sug)
        keys.length.should.equal(9)
        done();
      });
  });

  it("should retrive dashboard details in the system", function (done) {
    server
      .post("/getDash")
      .send({
          token: toke
      })
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        let sug = JSON.parse(res.text)
        assert.typeOf(sug, "object")
        let keys = Object.keys(sug)
        keys[0].should.equal('accounts')
        done();
      });
  });
});
