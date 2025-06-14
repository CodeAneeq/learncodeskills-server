import express from 'express';
import {upload} from '../middlewares/multer.middleware.js';
import { addCourse, deleteCourse, filterCourse, getAllCourses, getCourseById, getInstructorCourses, searchCourse } from '../controllers/course.controller.js';
import { authMiddleware, checkInstructor } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/add-course',authMiddleware, checkInstructor, upload.single("thumbnail") , addCourse);
router.get('/get-courses', getAllCourses);
router.get('/get-instructor-courses', authMiddleware, checkInstructor, getInstructorCourses);
router.delete('/del-course/:id', authMiddleware, checkInstructor, deleteCourse);
router.get('/search-course', searchCourse);
router.post("/filter-course", filterCourse)
router.get("/get-course/:id", getCourseById);


export default router