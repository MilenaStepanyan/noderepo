import bcrypt from 'bcrypt';

const admins = [];

const addAdmin = (username, password) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newAdmin = {
    id: admins.length + 1,
    username,
    password: hashedPassword,
  };

  admins.push(newAdmin);
  return newAdmin;
};

const findAdminByUsername = (username) => {
  return admins.find((admin) => admin.username === username);
};

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export { addAdmin, findAdminByUsername, comparePassword }