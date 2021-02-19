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
 *  name: UserInfo
 * definitions:
 *  UserInfo:
 *      type: object
 *      properties:
 *          Name:
 *              type: string
 *              description: 이름
 *          studentID:
 *              type: int
 *              description: 학번
 *          Password:
 *              type: string
 *              description: 비밀번호
 *          Department:
 *              type: string
 *              description: 학과
 *          Grade:
 *              type: int
 *              description: 학차
 *          PhoneNumber:
 *              type: string
 *              description: 전화번호
 *          Email:
 *              type: string
 *              description: 메일주소
 *          Part:
 *              type: string
 *              description: 분야
 *          Status:
 *              type: string
 *              description: 재적상태
 *          Warning:
 *              type: int
 *              description: 경고
 *          Permission:
 *              type: string
 *              description: 권한
 */

// Internal Route Start

/**
 * @swagger
 *  /user/sign-up:
 *    post:
 *      tags: [UserInfo]
 *      summary: User 회원가입 API
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "회원가입 정보 입력"
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  Name:
 *                      type: string
 *                  studentID:
 *                      type: number
 *                  Password:
 *                      type: string
 *                  Department:
 *                      type: string
 *                  Grade:
 *                      type: number
 *                  PhoneNumber:
 *                      type: string
 *                  Email:
 *                      type: string
 *                  Part:
 *                      type: string
 *                  Status:
 *                      type: string
 *                  Warning:
 *                      type: number
 *                  Permission:
 *                      type: string
 *      responses:
 *       200:
 *        description: User sign-up success
 *       500:
 *        description: Server Error
 */
router.post("/sign-up", function (req, res) {
  console.log("\nsign-up POST request");

  sql =
    "INSERT INTO UserInfo(Name, studentID, Password, Department, Grade, PhoneNumber, Email, Part, Status, Warning, Permission) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
  insert_params = [
    req.body.Name,
    req.body.studentID,
    req.body.Password,
    req.body.Department,
    req.body.Grade * 1,
    req.body.PhoneNumber,
    req.body.Email,
    req.body.Part,
    req.body.Status,
    0,
    "False",
  ];

  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("User sign-up success");
    } else {
      res.status(200).send("Success");
    }
  });
});

/**
 * @swagger
 *  /user/dupcheck:
 *    get:
 *      tags: [UserInfo]
 *      summary: ID 중복확인
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: query
 *          name: name
 *          required: true
 *      responses:
 *       200:
 *        description: ID (Duplicate or Non-Duplicate)
 *       500:
 *        description: Server Error
 */
router.get("/dupcheck", function (req, res) {
  let Name = req.query.name;

  console.log("\nID duplicate check GET request");

  sql = "SELECT Name FROM UserInfo WHERE Name=?";
  insert_params = [Name];
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else {
      if (rows[0] == null) {
        console.log("ID Non-Duplicate");
        res.status(200).send("ID Non-Duplicate");
      } else {
        console.log("ID Duplicate");
        console.log(rows);
        res.status(200).send("ID Duplicate");
      }
    }
  });
});

/**
 * @swagger
 *  /user/sign-in:
 *    post:
 *      tags: [UserInfo]
 *      summary: User 로그인 API
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "ID & PWD 입력"
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  studentID:
 *                      type: number
 *                  Password:
 *                      type: string
 *      responses:
 *       200:
 *        description: Sign-in (Success or Failed)
 *       500:
 *        description: Server Error
 */
router.post("/sign-in", function (req, res) {
  let id = req.body.studentID;
  let pwd = req.body.Password;

  console.log("\nLogin POST request");

  sql =
    "SELECT studentID, Password FROM UserInfo WHERE studentID=? AND Password=?";
  insert_params = [id, pwd];
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else {
      if (rows[0] == null) {
        // login failed
        console.log("Sign-in Failed");
        console.log(rows);
        res.status(200).send("Sign_in Failed");
      } else if (rows[0].studentID == id && rows[0].Password == pwd) {
        // login success
        console.log("Sign-in Success");
        res.status(200).send("Sign-in Success");
      }
    }
  });
});

/**
 * @swagger
 *  /user/password:
 *    post:
 *      tags: [UserInfo]
 *      summary: Password 찾기 API
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "ID, 이름, 전화번호, 이메일 입력"
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  studentID:
 *                      type: number
 *                  Name:
 *                      type: string
 *                  PhoneNumber:
 *                      type: string
 *                  Email:
 *                      type: string
 *      responses:
 *       200:
 *        description: (Failed or Success) to find password
 *       500:
 *        description: Server Error
 */
router.post("/password", function (req, res) {
  let id = req.body.studentID;
  let name = req.body.Name;
  let phoneNumber = req.body.PhoneNumber;
  let email = req.body.Email;

  console.log("\nPassword finding POST request");

  sql =
    "SELECT Password FROM UserInfo WHERE studentID=? AND name=? AND PhoneNumber=? AND email=?";
  insert_params = [id, name, phoneNumber, email];
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else {
      if (rows[0] == null) {
        // Failed to find password
        console.log("Failed to find password");
        res.status(200).send("Failed to find password");
      } else {
        // Success to find password
        console.log("Success to find password");
        res.status(200).send(rows[0].Password);
      }
    }
  });
});

/**
 * @swagger
 *  /user/password:
 *    put:
 *      tags: [UserInfo]
 *      summary: Password 변경 API
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "ID, 기존 Password, 변경할 Password입력"
 *          required: true
 *
 *          schema:
 *              type: object
 *              properties:
 *                  studentID:
 *                      type: number
 *                  currentPwd:
 *                      type: string
 *                  changePwd:
 *                      type: string
 *      responses:
 *       200:
 *        description: Password change Failed or Password change Success
 *       500:
 *        description: Server Error
 */
router.put("/password", function (req, res) {
  let id = req.body.studentID;
  let currentPwd = req.body.currentPwd;
  let changePwd = req.body.changePwd;

  console.log("\nPassword changing PUT request");

  sql = "SELECT Password FROM UserInfo WHERE studentID=?";
  insert_params = [id];
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else if (
      rows[0] == null ||
      rows[0].Password == changePwd ||
      rows[0].Password != currentPwd
    ) {
      console.log("Password change Failed");
      res.status(200).send("Password change Failed");
    } else {
      sql = "UPDATE UserInfo SET Password=? WHERE studentID=?";
      insert_params = [changePwd, id];
      connection.query(sql, insert_params, function (err, rows, fields) {
        if (err) {
          console.log(err);
          res.status(500).send("Server Error");
        } else {
          // Success to changing password
          console.log("Password change Success");
          res.status(200).send("Password change Success");
        }
      });
    }
  });
});

/**
 * @swagger
 *  /user/info:
 *    get:
 *      tags: [UserInfo]
 *      summary: User 정보 조회 API
 *      produces:
 *      - application/json
 *      responses:
 *       200:
 *        description: Empty or Data
 *        schema:
 *            type: object
 *            properties:
 *                UserInfo:
 *                    type: object
 *                    properties:
 *                        Name:
 *                            type: string
 *                        studentID:
 *                            type: number
 *                        Department:
 *                            type: string
 *                        Grade:
 *                            type: number
 *                        PhoneNumber:
 *                            type: string
 *                        Email:
 *                            type: string
 *                        Part:
 *                            type: string
 *                        Status:
 *                            type: string
 *                        Warning:
 *                            type: number
 *                        Permission:
 *                            type: string
 *       500:
 *        description: Server Error
 */
router.get("/info", function (req, res) {
  console.log("\nUser data GET request");

  sql =
    "SELECT Name, studentID, Department, Grade, PhoneNumber, Email, Part, Status, Warning, Permission FROM UserInfo";
  connection.query(sql, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else if (rows[0] == null) {
      console.log("Empty");
      res.status(200).send("Empty");
    } else {
      console.log("User infomation inquiry success");
      res.status(200).send(rows);
    }
  });
});

/**
 * @swagger
 *  /user/info:
 *    put:
 *      tags: [UserInfo]
 *      summary: User 정보 수정 API
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "학번(ID), 학과, 학차, 전화번호, 이메일, 분야, 재적 입력"
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  studentID:
 *                      type: number
 *                  Department:
 *                      type: string
 *                  Grade:
 *                      type: number
 *                  PhoneNumber:
 *                      type: string
 *                  Email:
 *                      type: string
 *                  Part:
 *                      type: string
 *                  Status:
 *                      type: string
 *      responses:
 *       200:
 *        description: Infomation change success
 *       404:
 *        description: NotFound
 *       500:
 *        description: Server Error
 */
router.put("/info", function (req, res) {
  console.log("\nUser infomation update PUT request");

  let id = req.body.studentID;
  let department = req.body.Department;
  let grade = req.body.Grade;
  let phonenumber = req.body.PhoneNumber;
  let email = req.body.Email;
  let status = req.body.Status;

  sql = "SELECT studentID FROM UserInfo WHERE studentID=?";
  insert_params = [id];
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else if (rows[0] == null) {
      // 수정할 User가 없는 경우
      res.status(404).send("NotFound");
    } else {
      sql =
        "UPDATE UserInfo SET Department=?, Grade=?, PhoneNumber=?, Email=?, Status=? WHERE studentID=?";
      insert_params = [department, grade, phonenumber, email, status, id];
      connection.query(sql, insert_params, function (err, rows, fields) {
        if (err) {
          console.log(err);
          res.status(500).send("Server Error");
        } else {
          console.log("Infomation change success");
          res.status(200).send("Infomation change success");
        }
      });
    }
  });
});

/**
 * @swagger
 *  /user/info:
 *    delete:
 *      tags: [UserInfo]
 *      summary: User 삭제 API
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: query
 *          name: "studentID"
 *          description: "ID 입력"
 *          required: true
 *        - in: query
 *          name: "Password"
 *          description: "Password 입력"
 *          required: true
 *      responses:
 *       200:
 *        description: User delete (success or failed)
 *       404:
 *        description: NotFound
 *       500:
 *        description: Server Error
 */
router.delete("/info", function (req, res) {
  let id = req.query.studentID;
  let pwd = req.query.Password;
  insert_params = [id, pwd];

  console.log("\nUser unsubscribe DELETE request");

  sql =
    "SELECT studentID, Password FROM UserInfo WHERE studentID=? AND Password=?";
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else if (rows[0] == null) {
      // 삭제할 User가 없는 경우
      res.status(404).send("NotFound");
    } else {
      sql = "DELETE FROM UserInfo WHERE studentID=? AND Password=?";
      connection.query(sql, insert_params, function (err, rows, fields) {
        if (err) {
          console.log(err);
          res.status(500).send("Server Error");
        } else {
          console.log("User delete success");
          res.status(200).send("User delete success");
        }
      });
    }
  });
});

// user Router Start
module.exports = router;
