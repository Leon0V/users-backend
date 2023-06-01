const userModel = require('../models/userModel');
const upload = require('../uploads/multerHandler');
const multer = require('multer');
const fs = require('fs');

class UserController {
    async save(req, res) {
        try {
            let user = req.body;
            const max = await userModel.findOne({}).sort({ code: -1 });
            const newCode = max === null ? 1 : max.code + 1;
            user.code = newCode;
            user.active = true;
            user.isDeleted = false;
            user.profImg = "";
            const result = await userModel.create(user);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error saving user:', error);
            res.status(500).json({ error: 'Failed to save user.' });
        }
    }

    async list(req, res) {
        try {
            console.log(req.query);
            let result = await userModel.find({ isDeleted: false }, { isDeleted: 0 });
            if (req.query.name) {
                result = result.filter(x => x.name.toUpperCase().includes(req.query.name.toUpperCase()));
            }
            if (req.query.surname) {
                result = result.filter(x => x.surname.toUpperCase().includes(req.query.surname.toUpperCase()));
            }
            if (req.query.city) {
                result = result.filter(x => x.city.toUpperCase().includes(req.query.city.toUpperCase()));
            }
            if (req.query.state) {
                result = result.filter(x => x.state.toUpperCase().includes(req.query.state.toUpperCase()));
            }
            if (req.query.active !== undefined) {
                result = result.filter(x => x.active.toString() === req.query.active);
                console.log(req.query.active);
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error listing users:', error);
            res.status(500).json({ error: 'Failed to retrieve users.' });
        }
    }

    async getById(req, res) {
        try {
            console.log(req.params);
            const code = req.params.code;
            const result = await userModel.findOne({ code: code, isDeleted: false }, { isDeleted: 0, active: 0 });
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: 'User not found.' });
            }
        } catch (error) {
            console.error('Error retrieving user:', error);
            res.status(500).json({ error: 'Failed to retrieve user.' });
        }
    }

    async update(req, res) {
        try {
            const code = req.params.code;
            const user = await userModel.findOne({ code: code, isDeleted: false }, { isDeleted: 0, active: 0 });

            if (user) {
                await userModel.updateOne({ code: code }, req.body);
                const updatedUser = await userModel.findOne({ code: code, isDeleted: false }, { isDeleted: 0, active: 0 });
                res.status(200).json(updatedUser);
            } else {
                res.status(404).json({ error: 'User not found.' });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Failed to update user.' });
        }
    }


    async delete(req, res) {
        try {
            const code = req.params.code;
            const user = await userModel.findOne({ code: code, isDeleted: false });

            if (user) {
                user.isDeleted = true;
                await user.save();
                res.status(200).send(`Successfully deleted the user with ID ${user.code} and name ${user.name}`);
            } else {
                res.status(404).json({ error: 'User not found.' });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Failed to delete user.' });
        }
    }

    async uploadImg(req, res) {
        try {
            const code = req.params.code;
            const user = await userModel.findOne({ code: code, isDeleted: false });

            if (user) {
                upload.single('image')(req, res, async function (err) {
                    if (err instanceof multer.MulterError) {
                        console.error('Error uploading image:', err);
                        res.status(500).json({ error: 'Failed to upload image.' });
                    } else if (err) {
                        console.error('Error uploading image:', err);
                        res.status(500).json({ error: 'Failed to upload image.' });
                    } else {
                        if (req.file) {
                            const filePath = req.file.path;
                            console.log('File path:', filePath);
                            const binaryData = fs.readFileSync(filePath);
                            const base64Data = binaryData.toString('base64');
                            console.log('Base64 data:', base64Data);
                            user.profImg = base64Data;
                            await user.save();
                            fs.unlinkSync(filePath);
                            console.log('File deleted:', filePath);
                        }
                        res.status(200).json({ message: 'Image uploaded successfully.' });
                    }
                });
            } else {
                res.status(404).json({ error: 'User not found.' });
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            res.status(500).json({ error: 'Failed to upload image.' });
        }
    }
}

module.exports = new UserController();