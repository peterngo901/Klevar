// Form Validation
const { validationResult } = require('express-validator');

// Password Encryption/Decryption
const bcrypt = require('bcryptjs');

// Models
const Teacher = require('../models/teacher');
const Creator = require('../models/creator');
const Student = require('../models/student');
const Classroom = require('../models/classroom');
/////////////////////////////////////////////////////////////////////////

// Teacher Authentication

exports.getTeacherSignup = (req, res, next) => {
  res.render('teacher/teacher-signup', {
    // Teacher Signup Page.
    error: 'Please try again!',
    path: '/teacher-signup',
    pageTitle: 'Sign Up',
  });
};

exports.postTeacherSignup = (req, res, next) => {
  const email = req.body.username;
  const school = req.body.school;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const postcode = req.body.postcode;

  // Form Validation errors defined in (../routes/authenticated) router.postTeacherSignup().
  const errors = validationResult(req);

  const existingTeacher = Teacher.findOne({ where: { email: email } }) // Check if email exists in database, Teacher table.
    .then((existingTeacher) => {
      if (existingTeacher) {
        // Email already exists.
        return res.status(422).render('teacher/teacher-signup', {
          error: 'An account with this email already exists!',
          path: '/teacher-signup',
          pageTitle: 'Sign Up',
        });
      }
      // Email does not exist.
      return bcrypt.hash(password, 12).then((hashedPassword) => {
        // Hash the password
        req.session.isLoggedIn = true;
        req.session.user = email; // Set session data to include the teacher email, helps us persist login state.
        req.session.sessionType = 'teacher';
        Teacher.create({
          // Create a new teacher in the teacher table.
          email: email,
          school: school,
          password: hashedPassword,
          firstName: firstName,
          lastName: lastName,
          postcode: postcode,
        })
          .then(() => {
            // Render the teacher dashboard.
            res.status(202).redirect('/teacher-dashboard');
          })
          .catch((err) => {
            // Error when inserting the teacher in the database.
            res.render('teacher/teacher-signup', {
              // Teacher Signup Page.
              error: 'Sorry please try to sign up again!',
              path: '/teacher-signup',
              pageTitle: 'Sign Up',
            });
          });
      });
    })
    .catch((err) => {
      // Error when trying to find the email in the database.
      res.render('teacher/teacher-signup', {
        // Teacher Signup Page.
        error: 'Sorry please try to sign up again!',
        path: '/teacher-signup',
        pageTitle: 'Sign Up',
      });
    });
};

exports.getTeacherSignin = (req, res, next) => {
  res.render('teacher/teacher-signin', {
    // Teacher Signin Page.
    error: '',
    path: '/teacher-signin',
    pageTitle: 'Sign In',
  });
};

exports.postTeacherSignin = async (req, res, next) => {
  const email = req.body.username;
  const password = req.body.password;
  // Check to see if the email exists in the teacher table.
  await Teacher.findOne({ where: { email: email } })
    .then((teacher) => {
      if (!teacher) {
        // Email does not exist.
        return res.redirect('/teacher-signin');
      }
      // Email does exist.
      // Compare the password entered in the form with our database hashed password.
      bcrypt
        .compare(password, teacher.password)
        .then((passwordMatch) => {
          if (passwordMatch) {
            // Correct Password
            // Set the Session
            req.session.isLoggedIn = true;
            req.session.user = email;
            req.session.sessionType = 'teacher';

            res.status(202).redirect('/teacher-dashboard');
          } else {
            // Incorrect Password
            res.render('teacher/teacher-signin', {
              // Teacher Signin Page.
              error: 'Sorry, please try to sign in again!',
              path: '/teacher-signin',
              pageTitle: 'Sign In',
            });
          }
        })
        .catch((err) => {
          res.render('teacher/teacher-signin', {
            // Teacher Signin Page.
            error: 'Sorry, please try to sign in again!',
            path: '/teacher-signin',
            pageTitle: 'Sign In',
          });
        });
    })
    .catch((err) => {
      res.render('teacher/teacher-signin', {
        // Teacher Signin Page.
        error: 'Sorry, please try to sign in again!',
        path: '/teacher-signin',
        pageTitle: 'Sign In',
      });
    });
};

/////////////////////////////////////////////////////////////////////////

// Creator Authentication

exports.getCreatorSignup = (req, res, next) => {
  res.render('creator/creator-signup', {
    // Creator Signup Page.
    error: '',
    path: '/creator-signup',
    pageTitle: 'Sign Up',
  });
};

exports.postCreatorSignup = async (req, res, next) => {
  const email = req.body.username;
  const companyName = req.body.companyName;
  const password = req.body.password;

  // Form Validation errors defined in (../routes/authenticated) router.postTeacherSignup().
  const errors = validationResult(req);

  const existingCreator = await Creator.findOne({ where: { email: email } }) // Check if email exists in database, Teacher table.
    .then((existingCreator) => {
      if (existingCreator) {
        // Email already exists.
        return res.status(422).render('creator/creator-signup', {
          error: 'An account with this email already exists!',
          path: '/creator-signup',
          pageTitle: 'Sign Up',
        });
      }
      // Email does not exist.
      return bcrypt.hash(password, 12).then((hashedPassword) => {
        // Hash the password
        req.session.isLoggedIn = true;
        req.session.user = email; // Set session data to include the teacher email, helps us persist login state.
        req.session.sessionType = 'creator';
        Creator.create({
          // Create a new teacher in the teacher table.
          email: email,
          companyName: companyName,
          password: hashedPassword,
        })
          .then(() => {
            // Render the teacher dashboard.
            res.status(202).redirect('/creator-dashboard');
          })
          .catch((err) => {
            // Error when inserting the creator in the database.
            res.render('creator/creator-signup', {
              // Creator Signup Page.
              error: 'Sorry, please try to sign up again!',
              path: '/creator-signup',
              pageTitle: 'Sign Up',
            });
          });
      });
    })
    .catch((err) => {
      // Error when trying to find the email in the database.
      res.render('creator/creator-signup', {
        // Creator Signup Page.
        error: 'Sorry, please try to sign up again!',
        path: '/creator-signup',
        pageTitle: 'Sign Up',
      });
    });
};

exports.getCreatorSignin = (req, res, next) => {
  res.render('creator/creator-signin', {
    // Creator Signin Page.
    error: '',
    path: '/creator-signin',
    pageTitle: 'Sign In',
  });
};

exports.postCreatorSignin = async (req, res, next) => {
  const email = req.body.username;
  const password = req.body.password;
  await Creator.findOne({ where: { email: email } }) // Check to see if the email exists in the teacher table.
    .then((creator) => {
      if (!creator) {
        // Email does not exist.
        res.render('creator/creator-signin', {
          // Creator Signin Page.
          error: 'Sorry, please try to sign in again!',
          path: '/creator-signin',
          pageTitle: 'Sign In',
        });
      }
      // Email does exist.
      bcrypt
        .compare(password, creator.password) // Compare the password entered in the form with our database hashed password.
        .then((passwordMatch) => {
          if (passwordMatch) {
            // Correct Password
            // Set the Session
            req.session.isLoggedIn = true;
            req.session.user = email;
            req.session.sessionType = 'creator';
            res.redirect('/creator-dashboard');
          } else {
            // Incorrect Password
            res.render('creator/creator-signin', {
              // Creator Signin Page.
              error: 'Sorry, please try to sign in again!',
              path: '/creator-signin',
              pageTitle: 'Sign In',
            });
          }
        })
        .catch((err) => {
          res.render('creator/creator-signin', {
            // Creator Signin Page.
            error: 'Sorry, please try to sign in again!',
            path: '/creator-signin',
            pageTitle: 'Sign In',
          });
        });
    });
};

/////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////

// Student Authentication

exports.getStudentSignin = (req, res, next) => {
  res.render('student-signin', {
    // Creator Signin Page.
    error: '',
    path: '/student-signin',
    pageTitle: 'Sign In',
  });
};

exports.postStudentSignin = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const classCode = req.body.classCode;

  // Search the Classroom Table for Class Signon Code
  Classroom.findOne({
    where: { classCode: classCode },
  })
    .then((existingClassroom) => {
      if (existingClassroom) {
        // Classroom Exists
        // Add them to the Student Table with firstName, lastName and classCode
        Student.create({
          // Create a new student in the student table.
          firstName: firstName,
          lastName: lastName,
          classroomClassCode: classCode,
        }).then((student) => {
          console.log(student.studentID);
          req.session.user = student.studentID;
          req.session.type = 'student';
          req.session.classCode = classCode; // easily track all students belonging to a classroom
          req.session.firstName = firstName;
          req.session.lastName = lastName;
          req.session.sessionType = 'student';
          res.redirect(`/student-dashboard`);
        });
      } else {
        res.render('student-signin', {
          // Creator Signin Page.
          error: 'Sorry, please try to sign in again!',
          path: '/student-signin',
          pageTitle: 'Sign In',
        });
      }
    })
    .catch((err) => {
      // Wrong ClassCode Entered.
      res.render('student-signin', {
        // Creator Signin Page.
        error: 'Sorry, please try to sign in again!',
        path: '/student-signin',
        pageTitle: 'Sign In',
      });
    });
};

exports.getStudentGameSignin = (req, res, next) => {
  console.log(req.headers);
  if (req.headers.statusCode === 500) {
    res.render('quickjoin', {
      // Creator Signin Page.
      error: 'Please try to join the game again!',
      path: '/quick-join',
      pageTitle: 'Sign In',
    });
  } else {
    res.render('quickjoin', {
      // Creator Signin Page.
      error: '',
      path: '/quick-join',
      pageTitle: 'Sign In',
    });
  }
};

exports.postStudentGameSignin = async (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const classCode = req.body.classCode;

  try {
    const existingClassroom = await Classroom.findOne({
      where: { classCode: classCode },
    });
    if (existingClassroom) {
      try {
        const student = await Student.create({
          // Create a new student in the student table.
          firstName: firstName,
          lastName: lastName,
          classroomClassCode: classCode,
        });
        req.session.classCode = classCode; // easily track all students belonging to a classroom
        req.session.firstName = firstName;
        req.session.lastName = lastName;
        req.session.sessionType = 'student';
        req.session.type = 'student';
        req.session.user = student.studentID;
        console.log(req.session.type);
        console.log(req.session.user);
        res.redirect(`/game-room`);
      } catch (err) {
        res.render('quickjoin', {
          error: 'Sorry, please try joining again!',
          path: '/quickjoin',
          pageTitle: 'Join Game',
        });
      }
    } else {
      res.render('quickjoin', {
        error: 'Sorry, please try joining again!',
        path: '/quickjoin',
        pageTitle: 'Join Game',
      });
    }
  } catch (err) {
    res.render('quickjoin', {
      error: 'Sorry, please try joining again!',
      path: '/quickjoin',
      pageTitle: 'Join Game',
    });
  }
};

////////////////////////////////////////////////////////////////////////
exports.postSignout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
};

exports.getProfile = async (req, res, next) => {
  res.locals.user = req.session.sessionType;
  res.redirect('/teacher-students');
  // res.render('user-profile', {
  //   pageTitle: 'Your Profile',
  // });
};
