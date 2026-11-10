// src/services/employee.service.js
const escapeRegex = require('../utils/escapeRegex');
exports.search = (ownerId, { department, position }) => {
  const filter = { owner: ownerId };
  if (department) filter.department = { $regex: escapeRegex(department), $options: 'i' };
  if (position)   filter.position   = { $regex: escapeRegex(position),   $options: 'i' };
  return Employee.find(filter).sort({ createdAt: -1 });
};
exports.findOwned   = (id, ownerId) => Employee.findOne({ _id: id, owner: ownerId });
exports.deleteOwned = (id, ownerId) => Employee.findOneAndDelete({ _id: id, owner: ownerId });