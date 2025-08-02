 JWT Authentication API
A secure Node.js + Express backend API that supports:

✅ User registration with hashed passwords
✅ Login with JWT and cookies
✅ Email verification via OTP
✅ Password reset via email OTP
✅ Authentication middleware using JWT
✅ Environment-based email support (e.g., Gmail SMTP)
✅ MongoDB integration with Mongoose

Tech Stack
Backend: Node.js, Express
Database: MongoDB (via Mongoose)
Auth: JWT, Cookies
Email: Nodemailer (Gmail SMTP)
Environment: dotenv

Method	Route                    	 Description
POST	/api/auth/register	         Register new user
POST	/api/auth/login      	       Login and receive token
POST	/api/auth/logout	           Logout (clear cookie)
POST	/api/auth/sendverifyotp	     Send OTP to email for verification
POST	/api/auth/verifyaccount	     Verify account using OTP
POST	/api/auth/sendresetotp	     Send OTP to reset password
POST	/api/auth/resetpassword      Reset password using OTP
POST	/api/auth/isauth	           Check if user is authenticated
GET   /api/user/data               get user data
