const Employee = require('../models/employee'); // match your model file name
const escapeRegex = require('../utils/escapeRegex');

exports.list = (ownerId) =>
  Employee.find({ owner: ownerId }).sort({ createdAt: -1 });

exports.findOwned = (id, ownerId) =>
  Employee.findOne({ _id: id, owner: ownerId });

exports.create = (ownerId, data) =>
  Employee.create({ ...data, owner: ownerId });   // owner last, so nothing can override it

// findOne + save (not findOneAndUpdate) so schema validators always run
exports.updateOwned = async (id, ownerId, changes) => {
  const emp = await Employee.findOne({ _id: id, owner: ownerId });
  if (!emp) return null;
  const oldPicture = emp.profile_picture;
  emp.set(changes);
  await emp.save();
  return { emp, oldPicture };
};

exports.deleteOwned = (id, ownerId) =>
  Employee.findOneAndDelete({ _id: id, owner: ownerId });

exports.search = (ownerId, { department, position }) => {
  const filter = { owner: ownerId };
  if (department) filter.department = { $regex: escapeRegex(department), $options: 'i' };
  if (position)   filter.position   = { $regex: escapeRegex(position),   $options: 'i' };
  return Employee.find(filter).sort({ createdAt: -1 });
};