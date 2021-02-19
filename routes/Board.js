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
 *  name: Board
 * definitions:
 *  Board:
 *      type: object
 *      properties:
 *          Idx:
 *              type: number
 *              description: Index
 *          Header:
 *              type: string
 *              description: 제목
 *          Body:
 *              type: string
 *              description: 본문
 *          CreatedTime:
 *              type: datetime
 *              description: 생성시간
 *          UpdateTime:
 *              type: datetime
 *              description: 수정시간
 *          Name:
 *              type: string
 *              description: 작성자

 */

// Internal Route Start

/**
 * @swagger
 *  /board/table:
 *    post:
 *      tags: [Board]
 *      summary: 게시글 작성 API
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "게시글 작성"
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  Header:
 *                      type: string
 *                  Body:
 *                      type: string
 *                  CreatedTime:
 *                      type: string
 *                      example: 2021-02-18 12:44:55
 *                  UpdateTime:
 *                      type: string
 *                  Name:
 *                      type: string
 *      responses:
 *       200:
 *        description: Success
 *       404:
 *        description: NotFound
 *       500:
 *        description: Server Error
 */
router.post("/table", function (req, res) {
    console.log("\nCreate posts POST request");

    sql = "INSERT INTO Board(Idx, Header, Body, CreatedTime, UpdateTime, Name) VALUES(?,?,?,?,?,?)"
    insert_params = [, req.body.Header, req.body.Body, req.body.CreatedTime, req.body.UpdateTime, req.body.Name];
    connection.query(sql, insert_params, function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Failed");
        } else {
            console.log("Create post success");
            res.status(200).send("Create post success");
        }
    });
});

/**
 * @swagger
 *  /board/table:
 *    get:
 *      tags: [Board]
 *      summary: 게시글 목록 조회 API
 *      produces:
 *      - application/json
 *      responses:
 *       200:
 *        description: Success
 *        schema:
 *            type: object
 *            properties:
 *                Board:
 *                    type: object
 *                    properties:
 *                        Idx:
 *                            type: number
 *                        Header:
 *                            type: string
 *                        Body:
 *                            type: number
 *                        CreatedTime:
 *                            type: string
 *                        UpdateTime:
 *                            type: string
 *                        Name:
 *                            type: string
 *       403:
 *        description: Forbidden
 *       404:
 *        description: NotFound
 *       500:
 *        description: Server Error
 */
router.get("/table", function (req, res) {
    console.log("\nBoard posts list GET request");

    sql = "SELECT * FROM Board";
    connection.query(sql, function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Failed");
        } else {
            console.log("Posts list return Success");
            res.status(200).send(rows);
        }
    });
});

/**
 * @swagger
 *  /board/table:
 *    put:
 *      tags: [Board]
 *      summary: 게시글 수정 API
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "수정할 게시글 번호, 제목, 본문, 수정시간 입력"
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  Idx:
 *                      type: number
 *                  Header:
 *                      type: string
 *                  Body:
 *                      type: string
 *                  UpdateTime:
 *                      type: string
 *                  Name:
 *                      type: string
 *      responses:
 *       200:
 *        description: Post update (success or failed)
 *       403:
 *        description: Forbidden
 *       404:
 *        description: NotFound
 *       500:
 *        description: Server Error
 */
router.put("/table", function (req, res) {
    console.log("\nposts PUT request");

    var idx = req.body.Idx;
    var header = req.body.Header;
    var body = req.body.Body;
    var updateTime = req.body.UpdateTime;
    var name = req.body.Name;

    sql = "UPDATE Board SET Header=?, Body=?, UpdateTime=?, Name=? WHERE Idx=?";
    connection.query(sql, [header, body, updateTime, name, idx], function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Server Error");
        } else {
            console.log("Post update success");
            res.status(200).send("Post update success");
        }
    });
});

/**
 * @swagger
 *  /board/table:
 *    delete:
 *      tags: [Board]
 *      summary: 게시글 삭제 API
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: query
 *          name: "Idx"
 *          description: "게시글 Idx입력"
 *          required: true
 *      responses:
 *       200:
 *        description: User delete (success or failed)
 *       500:
 *        description: Server Error
 */
router.delete("/table", function (req, res) {
    console.log("\nBoard post DELETE request");

    var idx = req.query.Idx;

    sql = "DELETE FROM Board WHERE Idx=?";
    insert_params = [idx]
    connection.query(sql, insert_params, function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Failed");
        } else {
            console.log("Success delete posts");
            res.status(200).send("Success");
        }
    });
});

/**
 * @swagger
 *  /board/table/{Idx}:
 *    get:
 *      tags: [Board]
 *      summary: 특정 게시글 조회 API
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *          name: Idx
 *          description: 게시글 번호 입력
 *          required: true
 *      responses:
 *       200:
 *        description: Success
 *        schema:
 *            type: object
 *            properties:
 *                Board:
 *                    type: object
 *                    properties:
 *                        Idx:
 *                            type: number
 *                        Header:
 *                            type: string
 *                        Body:
 *                            type: number
 *                        CreatedTime:
 *                            type: string
 *                        UpdateTime:
 *                            type: string
 *                        Name:
 *                            type: string
 *       403:
 *        description: Forbidden
 *       404:
 *        description: NotFound
 *       500:
 *        description: Server Error
 */
router.get("/table/:Idx", function (req, res) {
    console.log("\nBoard post GET request");

    sql = "SELECT * FROM Board WHERE Idx=?";
    insert_params = [req.params.Idx];
    console.log(req.params.Idx);
    connection.query(sql, insert_params, function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Server Error");
        } else {
            if (rows[0] == null) {
                console.log("NotFound");
                res.status(404).send("NotFound");
            } else {
                console.log("Post inquiry success");
                res.status(200).send(rows);
            }
        }
    });
});

// board Router Start
module.exports = router;