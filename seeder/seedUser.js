const config = require("../config");

module.exports = [
  {
    id: 1,
    name: "Ndaru Prasetyo",
    email: "ndaru@gmail.com",
    group: "II",
    password: "123456",
    gender: "male",
    role: "employee",
    image: `${config.baseUrl}/uploads/Webp.net-resizeimage.png`,
    superior_id: 2,
    leave_balance: 5,
    reimburse_balance: 1000000,
    phone_number: "081238571029",
    address: "Jl. Petogogan II no.12",
    birth_date: "01/22/1994",
    birth_place: "Jakarta",
    division: "Engineering"
  },
  {
    id: 2,
    name: "Rizal Febrianto",
    email: "rizal@gmail.com",
    group: "I",
    password: "123456",
    gender: "male",
    role: "manager",
    image: `${config.baseUrl}/uploads/Webp.net-resizeimage.png`,
    superior_id: null,
    leave_balance: 12,
    reimburse_balance: 5000000,
    phone_number: "081212339173",
    address: "Jl. Menteng I no.2",
    birth_date: "05/12/1991",
    birth_place: "Bandung",
    division: "Engineering"
  },
  {
    id: 3,
    name: "Luthfi Hakim",
    email: "luthfi@gmail.com",
    group: "II",
    password: "123456",
    gender: "male",
    role: "employee",
    image: `${config.baseUrl}/uploads/Webp.net-resizeimage.png`,
    superior_id: 2,
    leave_balance: 3,
    reimburse_balance: 500000,
    phone_number: "081241349584",
    address: "Jl. Dharmawangsa XI no.4",
    birth_date: "05/11/1992",
    birth_place: "surabaya",
    division: "Engineering"
  }
];
