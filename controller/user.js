const User = require('../index.js').User  

const getUsers = async () => {
  const abc = await User.findAll()
  return abc
}

export {
  getUsers
}
