import express from 'express';
import controller from '../controllers/controller.js';
import { isPublic, isPrivate } from '../middlewares/checkAuth';
import { blogValidation } from '../validators.js';
const app = express();

app.get('/favicon.ico', controller.getFavicon);
app.get('/', isPublic, controller.getIndexpage);
app.get('/recent', isPublic, controller.getRecent);
app.get('/popular', isPublic, controller.getPopular);
app.get('/post', isPrivate, controller.getPostaBlog);
app.get('/profile', isPrivate, controller.getProfile);
app.get('/editprofile', isPrivate, controller.getEditProfile);
app.post('/submit-blog', isPrivate, controller.postSubmitBlog);
app.get('/edit-blog', isPrivate, controller.getEditBlog);
app.post('/updateBlog', isPrivate, blogValidation, controller.updateBlog);
app.get('/delete-blog', isPrivate, controller.deleteBlog);
app.post('/search-blog', isPublic, controller.searchBlog);
app.get('/blog/:id', isPublic, controller.showBlog);
app.get('/addcomment', isPublic, controller.getAddComment);
app.get('/thumbsup', isPublic, controller.addLike);
app.get('/getCheckUsername',isPublic, controller.getCheckUser);
app.get('/getCheckEmail',isPublic, controller.getCheckEmail);

module.exports = app;