const { matchedData } = require('express-validator');
const service = require('../services/employee.service');
const AppError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { publicPath, removeUpload } = require('../utils/files');
const logger = require('../utils/logger');

const notFound = () => new AppError('Employee not found', 404);
const ok = (res, status, message, data) => res.status(status).json({ status: true, message, data });

exports.list = asyncHandler(async (req, res) => {
  ok(res, 200, 'Employees fetched', await service.list(req.user.id));
});

exports.search = asyncHandler(async (req, res) => {
  const criteria = matchedData(req, { locations: ['query'] });
  ok(res, 200, 'Search results', await service.search(req.user.id, criteria));
});

exports.getOne = asyncHandler(async (req, res) => {
  const { eid } = matchedData(req, { locations: ['params'] });
  const emp = await service.findOwned(eid, req.user.id);
  if (!emp) throw notFound();
  ok(res, 200, 'Employee fetched', emp);
});

exports.create = asyncHandler(async (req, res) => {
  const data = matchedData(req, { locations: ['body'] });   // only validated fields
  const emp = await service.create(req.user.id, {
    ...data,
    profile_picture: req.file ? publicPath(req.file.filename) : null,
  });
  if (req.file) logger.info('upload', { employeeId: emp.id, stored: req.file.filename, size: req.file.size });
  ok(res, 201, 'Employee created', emp);
});

exports.update = asyncHandler(async (req, res) => {
  const { eid } = matchedData(req, { locations: ['params'] });
  const { remove_picture, ...changes } = matchedData(req, { locations: ['body'] });

  if (req.file) changes.profile_picture = publicPath(req.file.filename);
  else if (remove_picture) changes.profile_picture = null;

  if (Object.keys(changes).length === 0) throw new AppError('Nothing to update', 400);

  const result = await service.updateOwned(eid, req.user.id, changes);
  if (!result) throw notFound();                 // errorHandler deletes the uploaded file

  const { emp, oldPicture } = result;
  if (oldPicture && oldPicture !== emp.profile_picture) await removeUpload(oldPicture);
  if (req.file) logger.info('upload', { employeeId: emp.id, stored: req.file.filename, size: req.file.size });
  ok(res, 200, 'Employee updated', emp);
});

exports.remove = asyncHandler(async (req, res) => {
  const { eid } = matchedData(req, { locations: ['query'] });
  const emp = await service.deleteOwned(eid, req.user.id);
  if (!emp) throw notFound();
  await removeUpload(emp.profile_picture);
  res.sendStatus(204);
});