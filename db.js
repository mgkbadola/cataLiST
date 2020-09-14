const mysql= require('mysql2')

const connection= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Bl3s$RNG',
    database: 'clist'
});

function getalldata(condition){
    var sql=''
    switch (condition){
        case 'g':
            sql='select distinct g.Name,g.Year, g.Platform,GROUP_CONCAT(name_gamegenre.Genre) as Genres,g.Series,g.Played from games g left join name_gamegenre on g.Name=name_gamegenre.Name group by g.Name'
            break
        case 's':
            sql='select * from shows'
            break
        case 'f':
            sql='select * from films'
            break
        case 'gg':
            sql='select * from game_genres'
            break
        case 'l':
            sql='select * from languages'
            break
        case 'p':
            sql='select * from platforms'
            break
        default: console.log('no data returned')
    }
    return new Promise(function (resolve, reject){
        connection.query(
            sql,
            function (err,rows,cols) {
                if(err)
                    reject(err)
                else
                    resolve(rows)
            }
        )
    });
}
function insertgame(name,year,platform,played,series){
    return new Promise(function (resolve, reject){
        var sql=`insert ignore into games values ("${name}",${year},"${platform}",${played},${series});`
        connection.query(
            sql,
            function (err,rows,cols) {
                if(err){
                    reject(err)
                    console.log('error aa gaya!')
                }
                else
                    resolve(rows)
            }
        )
    });
}
function insertshow(name,type,language,year,watched){
    return new Promise(function (resolve, reject){
        var sql=`insert ignore into shows values ("${name}","${type}","${language}",${year},${watched});`
        connection.query(
            sql,
            function (err,rows,cols) {
                if (err) {
                    reject(err)
                    console.log('error aa gaya!')
                } else
                    resolve(rows)
            }
        )
    });
}

function insertfilm(name, year, language, series, watched) {
    return new Promise(function (resolve, reject) {
        var sql = `insert ignore into films values ("${name}",${year},"${language}",${series},${watched});`
        connection.query(
            sql,
            function (err, rows, cols) {
                if (err) {
                    reject(err)
                    console.log('error aa gaya!')
                } else
                    resolve(rows)
            }
        )
    });
}
function insertgenregame(name,genre){
    return new Promise(function (resolve, reject){
        var sql=`insert ignore into name_gamegenre values ("${name}","${genre}");`
        connection.query(
            sql,
            function (err,rows,cols) {
                if(err){
                    reject(err)
                    console.log('error aa gaya!')
                }
                else
                    resolve(rows)
            }
        )
    });
}
function insertsingle(table,value){
    return new Promise(function (resolve, reject){
        var sql=`insert ignore into ${table} values ("${value}");`
        connection.query(
            sql,
            function (err,rows,cols) {
                if(err){
                    reject(err)
                    console.log('error aa gaya!')
                }
                else
                    resolve(rows)
            }
        )
    });
}

module.exports={
    getalldata,
    insertgame,
    insertshow,
    insertfilm,
    insertgenregame,
    insertsingle
}