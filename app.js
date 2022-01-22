const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true })

const articleSchema = {
    title: String,
    content: String
}

/////////////////////////////////request targetting all articles///////////////////
const Article = mongoose.model('Article', articleSchema)

app.route('/articles')
    .get((req, res) => {
        Article.find((err, foundArticle) => {
            if (!err) {
                res.send(foundArticle)
            }
            else {
                res.send(err)
            }
        })
    })
    .post((req, res) => {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save((err) => {
            if (!err) {
                res.send('Successfully added a new item')
            }
            else {
                res.send(err)
            }
        })
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send('Successfully deleted all items')
            }
            else {
                res.send('err')
            }
        })
    })

/////////////////////////////////request targetting specific articles///////////////////
app.route('/articles/:articleTitle')
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle}, (err, foundedArticle) => {
            if(foundedArticle) {
                res.send(foundedArticle)
            }
            else {
                res.send('No article matching')
            }
        })
    })

    .put((req, res) => {
        Article.updateMany(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            // {strict: true},
            (err) => {
                if(!err) {
                    res.send('Updated')
                }
                else {
                    res.send(err)
                }
            }
        )
    })

    .patch((req, res) => {
        Article.updateMany(
            {title: req.params.articleTitle},
            {$set: req.body},
            (err) => {
                if(!err) {
                    res.send('Patched')
                }
                else {
                    res.send(err)
                }
            }
        )
    })

    .delete((req, res) => {
        Article.deleteOne(
            {title: req.params.articleTitle},
            (err) => {
                if(!err) {
                    res.send('Deleted')
                }
                else {
                    res.send(err)
                }
            }
        )
    })


app.listen(3000, () => {
    console.log('Server started on port 3000')
})