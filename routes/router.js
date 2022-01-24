const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('./../config/db');
const userMiddleware = require('../middleware/users.js');

const MEMBER_INFO_TBL = 'memberinfotbl';
const TRACKER_USERLOG_TBL = 'tracker_userlog';


// Registration for User
router.post('/auth/register', (req, res, next) => {
    const checkQuery = `SELECT * FROM ${MEMBER_INFO_TBL} WHERE MCode = ${db.escape(req.body.mcode)} AND MemberCode = ${db.escape(req.body.membercode)} AND MemberName = ${db.escape(req.body.membername)};`;
    db.query(checkQuery,(err, result) => {
        if (result.length) {
            return res.status(400).send({ 
                status: 400,
                msg: 'This member is already in use!' 
            });
        }

        // username is available
        const insertUser = `INSERT INTO ${MEMBER_INFO_TBL}(MCode, MemberCode, MemberName, MemberPoint, PhoneID, MemberLevelId, RedeemPoints) VALUES(${db.escape(req.body.mcode)}, ${db.escape(req.body.membercode)}, ${db.escape(req.body.membername)}, '0', ${db.escape(req.body.phoneid)},'100001','0');`;
        db.query( insertUser, (err, result) => {
            if (err) {
                return res.status(400).send({ 
                    status: 400,
                    msg: err 
                });
            }
            return res.status(201).send({ 
                status: 201,
                msg: 'Seccessful Registered!'
            });
        });
    });
});


// Log In user
router.post('/auth/login', (req, res, next) => {
    const checkQuery = `SELECT * FROM ${MEMBER_INFO_TBL} WHERE MemberName = ${db.escape(req.body.membername)} AND MemberCode = ${db.escape(req.body.membercode)} AND PhoneID = ${db.escape(req.body.phoneid)};`;
    db.query(checkQuery, (err, result) => {
        // user does not exists
        if (err) {
            return res.status(400).send({
                status: 400, 
                msg: err 
            });
        }
        if (!result.length) {
            return res.status(400).send({ 
                status: 400,
                msg: 'Member is incorrect!' 
            });
        }
        
        const token = jwt.sign({
            username: result[0].username,
            userId: result[0].id
        },
        process.env.JWT_SECRET, {
            algorithm:'HS512',
            expiresIn: 86400
        });

        return res.status(200).send({ 
            status: 200,
            msg: 'Logged in Successful', 
            token 
        });
    });
  });


// Log In user
router.post('/memberinfo', (req, res, next) => {
    const checkQuery = `SELECT memberinfotbl.Id, memberinfotbl.MCode,memberinfotbl.MemberCode,memberinfotbl.MemberName,memberinfotbl.MemberPoint,memberinfotbl.PhoneID,memberinfotbl.MemberLevelId,memberinfotbl.RedeemPoints,memberlevelinfotbl.MemberLevel FROM memberinfotbl INNER JOIN memberlevelinfotbl ON memberinfotbl.MemberLevelId = memberlevelinfotbl.Id where memberinfotbl.MemberCode=${db.escape(req.body.membercode)} and memberinfotbl.MemberName=${db.escape(req.body.membername)} and memberinfotbl.PhoneID=${db.escape(req.body.phoneid)};`;
    db.query(checkQuery, (err, result) => {
        return res.status(200).send({ 
            status: 200,
            msg: result
        });
    });
  });

router.get('/briefnews', (req, res, next) => {
    const checkQuery = `SELECT BriefNews FROM newsinfotbl;`;
    db.query(checkQuery, (err, result) => {
        return res.status(200).send({ 
            status: 200,
            briefnews: result
        });
    });
});

router.get('/detailnewsall', (req, res, next) => {
    const checkQuery = `SELECT * FROM newsinfotbl;`;
    db.query(checkQuery, (err, result) => {
        return res.status(200).send({ 
            status: 200,
            detailnews: result
        });
    });
});

router.post('/detailnews', (req, res, next) => {
    const checkQuery = `SELECT * FROM newsinfotbl limit ${db.escape(req.body.from)},${db.escape(req.body.to)};`;
    console.log(checkQuery);
    db.query(checkQuery, (err, result) => {
        return res.status(200).send({ 
            status: 200,
            detailnews: result
        });
    });
});


router.post('/updatepoint',(req,res) => {
    const updateQuery = `UPDATE ${MEMBER_INFO_TBL} SET MemberPoint=${db.escape(req.body.memberpoint)} WHERE MemberName = ${db.escape(req.body.membername)} AND MemberCode = ${db.escape(req.body.membercode)} AND PhoneID = ${db.escape(req.body.phoneid)};`;
    db.query(updateQuery, (err, result) => {
        if (err) {
            return res.status(400).send({ 
                status: 400,
                msg: err 
                });
            }
            return res.status(200).send({
                status: 200,
                memberpoint: req.body.memberpoint
            });
        });
});

module.exports = router;