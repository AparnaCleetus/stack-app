var express = require('express');
var router = express.Router();

const sw = require('stopword')
const sql = require("mssql");
const template = require("sql-template-strings")

router.get('/', function(req, res) {

    var title_q = req.query.q_string;
    title_q = "%"+title_q+"%";
    title_q = title_q.replace(" ","%");
    //ret = sw.removeStopwords(title_q);
    // data = queryDB(title_q, resp)
    var config = {
    user: 'sa',
    password: '123456',
    server: 'DESKTOP-NSSN00J\\SQLEXPRESS', 
    database: 'StackOverflow2010' ,
    port: 1433,
    connectionTimeout: 30000,
    requestTimeout: 30000
    };
    sql.connect(config, function (err) {
        if (err) console.log(err); 
        // create Request object
        var sqlReq = new sql.Request();
        //console.log(sqlReq); 
        sqlReq.input('tagParams', sql.VarChar, title_q);
        let querynew =  `select p.Title, left(p.Body, 140) Description, p.Tags, count(v.Id) NumberOfVotes, pac.TotalAnswers
            , (case when p.OwnerUserId=-1 then NULL else u.DisplayName end) as 'Name', u.Reputation
        
            from Posts p
            join Votes v on p.Id = v.PostId
            join 
            (
                select SUM(CASE WHEN PostTypeId=2 THEN 1 ELSE 0 END) as 'TotalAnswers', Posts.ParentId
                from Posts
                Group by ParentId
            ) pac on pac.ParentId=p.Id
            join Users u on p.OwnerUserId=u.Id
            where
            p.Tags like @tagParams
            group by p.Id, p.Body, p.Tags, p.Title, pac.TotalAnswers, p.OwnerUserId, u.DisplayName, u.Reputation;`
            sqlReq.query(querynew, function (err, recordset) {

                if (err) {
                    console.log(err);
                    throw new Error(res.statusText);
                }

                res.json(recordset);
            });
    });

});

module.exports = router;
