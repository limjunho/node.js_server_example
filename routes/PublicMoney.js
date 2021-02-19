"use strict";

// Router init
const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// DB Connection init
const connection = require("../Database/dbConn");
let sql;
let insert_params;

/**
 * @swagger
 * tags:
 *  name: PublicMoney
 * definitions:
 *  PublicMoney:
 *      type: object
 *      properties:
 *          Idx:
 *              type: number
 *              description: Index
 *          Time:
 *              type: datetime
 *              description: 시간
 *          Name:
 *              type: string
 *              description: 작성자
 *          Deposit:
 *              type: number
 *              description: 입금
 *          Withdraw:
 *              type: number
 *              description: 출금
 *          Contents:
 *              type: string
 *              description: 본문
 *          Balance:
 *              type: number
 *              description: 잔금
 */

// Internal Route Start

/**
 * @swagger
 *  /publicmoney/table:
 *    post:
 *      tags: [PublicMoney]
 *      summary: 공금 내역 작성 API
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "공금 내역 작성"
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  Time:
 *                      type: string
 *                      example: 2021-02-18 14:44:55
 *                  Name:
 *                      type: string
 *                  Deposit:
 *                      type: number
 *                  Withdraw:
 *                      type: number
 *                  Contents:
 *                      type: string
 *                  Balance:
 *                      type: number
 *      responses:
 *       200:
 *        description: Contents create success
 *       500:
 *        description: Server Error
 */
router.post("/table", function (req, res) {
  console.log("\nCreate public money contents POST request");

  sql =
    "INSERT INTO PublicMoney(Idx, Time, Name, Deposit, Withdraw, Contents, Balance) VALUES(?,?,?,?,?,?,?)";
  insert_params = [
    ,
    req.body.Time,
    req.body.Name,
    req.body.Deposit,
    req.body.Withdraw,
    req.body.Contents,
    req.body.Balance,
  ];

  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else {
      console.log("Contents create success");
      res.status(200).send("Contents create success");
    }
  });
});

/**
 * @swagger
 *  /publicmoney/table:
 *    get:
 *      tags: [PublicMoney]
 *      summary: 공금 목록 조회 API
 *      produces:
 *      - application/json
 *      responses:
 *       200:
 *        description: Empty or Data
 *        schema:
 *            type: object
 *            properties:
 *                Board:
 *                    type: object
 *                    properties:
 *                        Time:
 *                            type: string
 *                            example: 2021-02-18 14:44:55
 *                        Name:
 *                            type: string
 *                        Deposit:
 *                            type: number
 *                        Withdraw:
 *                            type: number
 *                        Contents:
 *                            type: string
 *                        Balance:
 *                            type: number
 *       404:
 *        description: NotFound
 *       500:
 *        description: Server Error
 */
router.get("/table", function (req, res) {
  console.log("\nSelect public money list GET request");

  sql = "SELECT * FROM PublicMoney";
  connection.query(sql, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else if (rows[0] == null) {
      console.log("Empty");
      res.status(200).send("Empty");
    } else {
      console.log("PublicMoney inquiry success");
      res.status(200).send(rows);
    }
  });
});

/**
 * @swagger
 *  /publicmoney/table:
 *    put:
 *      tags: [PublicMoney]
 *      summary: 공금 내역 수정 API
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "수정할 공금내역 Index, 시간, 수정자, 입금내역, 출금내역, 내용, 잔액 입력"
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  Idx:
 *                      type: number
 *                  Time:
 *                      type: string
 *                      example: 2021-02-18 14:44:55
 *                  Name:
 *                      type: string
 *                  Deposit:
 *                      type: number
 *                  Withdraw:
 *                      type: number
 *                  Contents:
 *                      type: string
 *                  Balance:
 *                      type: number
 *      responses:
 *       200:
 *        description: PublicMoney update success
 *       404:
 *        description: NotFound
 *       500:
 *        description: Server Error
 */
router.put("/table", function (req, res) {
  console.log("\nPUT");

  let idx = req.body.Idx;
  let time = req.body.Time;
  let name = req.body.Name;
  let deposit = req.body.Deposit;
  let withdraw = req.body.Withdraw;
  let contents = req.body.Contents;
  let balance = req.body.Balance;

  sql = "SELECT Idx FROM PublicMoney WHERE Idx=?";
  insert_params = [idx];
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else if (rows[0] == null) {
      console.log("NotFound");
      res.status(404).send("NotFound");
    } else {
      sql =
        "UPDATE PublicMoney SET Time=?, Name=?, Deposit=?, Withdraw=?, Contents=?, Balance=? WHERE Idx=?";
      insert_params = [time, name, deposit, withdraw, contents, balance, idx];
      connection.query(sql, insert_params, function (err, rows, fields) {
        if (err) {
          console.log(err);
          res.status(500).send("Server Error");
        } else {
          console.log("PublicMoney update Success");
          res.status(200).send("PublicMoney update Success");
        }
      });
    }
  });
});

/**
 * @swagger
 *  /publicmoney/table:
 *    delete:
 *      tags: [PublicMoney]
 *      summary: 공금 내역 삭제 API
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: query
 *          name: "Idx"
 *          description: "공금 내역 Index 입력"
 *          required: true
 *      responses:
 *       200:
 *        description: PublicMoney delete (success or failed)
 *       404:
 *        description: NotFound
 *       500:
 *        description: Server Error
 */
router.delete("/table", function (req, res) {
  console.log("\nDELETE");

  let idx = req.query.Idx;
  insert_params = [idx];

  sql = "SELECT Idx FROM PublicMoney WHERE Idx=?";
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else if (rows[0] == null) {
      console.log("NotFound");
      res.status(404).send("NotFound");
    } else {
      sql = "DELETE FROM PublicMoney WHERE Idx=?";
      connection.query(sql, insert_params, function (err, rows, fields) {
        if (err) {
          console.log(err);
          res.status(500).send("Server Error");
        } else {
          console.log("PublicMoney delete success");
          res.status(200).send("PublicMoney delete success");
        }
      });
    }
  });
});

// publicmoney Router Start
module.exports = router;
