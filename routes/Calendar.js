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
 *  name: Calendar
 * definitions:
 *  Calendar:
 *      type: object
 *      properties:
 *          Idx:
 *              type: number
 *              description: Index
 *          Header:
 *              type: string
 *              description: 제목
 *          startTime:
 *              type: datetime
 *              description: 시작시간
 *          endTime:
 *              type: datetime
 *              description: 종료시간
 *          Place:
 *              type: string
 *              description: 장소
 *          Name:
 *              type: string
 *              description: 작성자
 *          Body:
 *              type: string
 *              description: 본문
 */

// Internal Route Start

/**
 * @swagger
 *  /calendar/table:
 *    post:
 *      tags: [Calendar]
 *      summary: 일정 작성 API
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "일정 작성"
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  Header:
 *                      type: string
 *                  startTime:
 *                      type: string
 *                      example: 2021-02-18 12:44:55
 *                  endTime:
 *                      type: string
 *                      example: 2021-02-18 14:44:55
 *                  Place:
 *                      type: string
 *                  Name:
 *                      type: string
 *                  Body:
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
    console.log("\ncreate to calendar POST request");

    sql = "INSERT INTO Calendar(Idx, Header, startTime, endTime, Place, Name, Body) VALUES(?,?,?,?,?,?,?)"
    insert_params = [, req.body.Header, req.body.startTime, req.body.endTime, req.body.Place, req.body.Name, req.body.Body];

    connection.query(sql, insert_params, function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Server Error");
        } else {
            console.log("Create calendar Success");
            res.status(200).send("Create calendar Success");
        }
    });
});

/**
 * @swagger
 *  /calendar/table:
 *    get:
 *      tags: [Calendar]
 *      summary: 일정 목록 조회 API
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
 *                        startTime:
 *                            type: string
 *                        endTime:
 *                            type: string
 *                        Place:
 *                            type: string
 *                        Name:
 *                            type: string
 *                        Body:
 *                            type: string
 *       403:
 *        description: Forbidden
 *       404:
 *        description: NotFound
 *       500:
 *        description: Server Error
 */
router.get("/table", function (req, res) {
    console.log("\nselect to calendar GET request");

    sql = "SELECT * FROM Calendar";
    connection.query(sql, function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Server Error");
        } else {
            if (rows[0] == null) {
                console.log("Empty set error");
                res.status(200).send("Empty set Error");
            } else {
                console.log("Calendar inquiry success");
                res.status(200).send(rows);
            }
        }
    });
});

/**
 * @swagger
 *  /calendar/table:
 *    put:
 *      tags: [Calendar]
 *      summary: 일정 수정 API
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
 *                  startTime:
 *                      type: string
 *                      example: 2021-02-18 14:44:55
 *                  endTime:
 *                      type: string
 *                      example: 2021-02-18 16:44:55
 *                  Place:
 *                      type: string
 *                  Name:
 *                      type: string
 *                  Body:
 *                      type: string
 *      responses:
 *       200:
 *        description: Calendar update (success or failed)
 *       403:
 *        description: Forbidden
 *       404:
 *        description: NotFound
 *       500:
 *        description: Server Error
 */
router.put("/table", function (req, res) {
    var idx = req.body.Idx;
    var header = req.body.Header;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var place = req.body.Place;
    var name = req.body.Name;
    var body = req.body.Body;

    console.log("\nCalendar schedule update PUT request");

    sql = "UPDATE Calendar SET Header=?, startTime=?, endTime=?, Place=?, Name=?, Body=? WHERE Idx =?"
    insert_params = [header, startTime, endTime, place, name, body, idx];
    connection.query(sql, insert_params, function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Server Error");
        } else {
            console.log("Calendar update success");
            res.status(200).send("Calendar update success");
        }
    });
});

/**
 * @swagger
 *  /calendar/table:
 *    delete:
 *      tags: [Calendar]
 *      summary: 일정 삭제 API
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: query
 *          name: "Idx"
 *          description: "일정 Index 입력"
 *          required: true
 *      responses:
 *       200:
 *        description: Schedule delete (success or failed)
 *       500:
 *        description: Server Error
 */
router.delete("/table", function (req, res) {
    console.log("\nCalendar schedule DELETE request");

    let idx = req.query.Idx;

    sql = "DELETE FROM Calendar WHERE Idx=?";
    insert_params = [idx];
    connection.query(sql, insert_params, function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Server Error");
        } else {
            console.log("Schedule delete success");
            res.status(200).send("Schedule delete success");
        }
    });
});

// calendar Router Start
module.exports = router;