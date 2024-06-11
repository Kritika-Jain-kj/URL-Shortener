//Statefull
//const sessionIdToUserMap = new Map();

// function setUserId(id, user) {
//   sessionIdToUserMap.set(id, user);
// }

// function getUserId(id) {
//   return sessionIdToUserMap.get(id);
// }
// + Necessary Changes in Other folders

//Stateless
const jwt = require('jsonwebtoken')
const secret = 'Kritika#2630'

function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    secret
  )
}

function getUser(token) {
  try {
    return jwt.verify(token, secret)
  } catch (error) {
    return null
  }
}

module.exports = {
  setUser,
  getUser,
}
