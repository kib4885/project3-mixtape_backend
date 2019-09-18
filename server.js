let express = require('express')
let request = require('request')
let querystring = require('querystring')

let app = express()

///////////////////////////REMOVE THESE KEYS BEFORE COMMITTING, ALREADY SAVED AS HEROKU CONFIG VARS////////////////////////////////
let FRONTEND_URI = "http://localhost:3000/"
let redirect_uri = "http://localhost:8888/callback/"
let SPOTIFY_CLIENT_ID = ""
let SPOTIFY_CLIENT_SECRET = ""
///////////////////////////REMOVE THESE KEYS BEFORE COMMITTING, ALREADY SAVED AS HEROKU CONFIG VARS////////////////////////////////


// let redirect_uri = 
//   process.env.REDIRECT_URI || 
//   'http://localhost:8888/callbac'



app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      // client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'playlist-read-private playlist-modify-private playlist-read-collaborative playlist-modify-public user-read-email',
      redirect_uri
    }))
})

app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET
        // process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    // let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
    let uri = FRONTEND_URI || 'http://localhost:3000'
    res.redirect(uri + '?access_token=' + access_token)
  })
})

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)