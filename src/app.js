const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define PATHS for express config
const publicDirectoryPath = path.join(__dirname,"../public")
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// Setup HANDLEBARS and VIEWS location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.get('',(req,res) => {
    res.render('index',{
        title:'Weather',
        name: 'Andrew mead'
    })
})

app.get('/about',(req,res) => {
res.render('about',{
        title:'ABOUT',
        name: 'Andrew mead'
    })
})

app.get('/help',(req,res) => {
    res.render('help',{
        message:'This is a HELP message',
        title: 'help',
        name: 'Andrew mead'
        })
})

app.get('/weather',(req,res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide a address'
        })
    }

    geocode(req.query.address, (err,{latitude, longitude, location} = {}) => {
        if(err) {
            return res.send({
                error: err
            })
        }

        forecast(latitude,longitude, (err,forecastData) => {
            if(err) {
                return res.send({
                    error: err
                })
            }

            res.send({
                address: req.query.address,
                forecast: forecastData,
                location
            })
        })
    })
})

app.get('/help/*', (req,res) => {
    res.render('404Page',{
        title: '404',
        error: 'Help article not found',
        name: 'Andrew mead'
    })
})

app.get('*',(req,res) => {
    res.render('404Page',{
        title: '404',
        error: 'Page not found',
        name: 'Andrew mead'
    })
})

app.listen(3000,(err) => {
    console.log('Server is Up and Running')
})