
const bcrypt = require('bcryptjs');

const helpers = {};
//sifrar
helpers.encryptPassword = async (pass_usuario) => {
  const salt = await bcrypt.genSalt(10);//crear un ash
  const hash = await bcrypt.hash(pass_usuario, salt);
  return hash;
};
//desifrar
helpers.matchPassword = async (pass_usuario, savedpass_usuario) => {
  try {
    return await bcrypt.compare(pass_usuario, savedpass_usuario);
  } catch (e) {
    console.log(e)
  }
};

module.exports = helpers;