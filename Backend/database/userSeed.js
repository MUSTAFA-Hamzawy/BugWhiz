const bcrypt = require('bcrypt');


const myPlaintextPassword = "Open12341234";


const hashedPassword = bcrypt.hashSync(myPlaintextPassword, 10);
const users = [
  {
    "fullName": "Mustafa Mahmoud",
    "email": "hamzawy@gmail.com",
    "username": "hamzawy",
    "phoneNumber": "+20123456781",
    "password": hashedPassword,
    "jobTitle": "Backend Developer",
  },
  {
    "fullName": "Karim Muhammed",
    "email": "karim@gmail.com",
    "username": "karim1",
    "phoneNumber": "+20123456782",
    "password": hashedPassword,
    "jobTitle": "Frontend Developer",
  },
  {
    "fullName": "Karim Mahmoud",
    "email": "karim2@gmail.com",
    "username": "karim2",
    "phoneNumber": "+20123456783",
    "password": hashedPassword,
    "jobTitle": "Documentation",
  },
  {
    "fullName": "Donia Gameel",
    "email": "donia@gmail.com",
    "username": "donia",
    "phoneNumber": "+20123456784",
    "password": hashedPassword,
    "jobTitle": "Security",
  }
];

module.exports = users;

