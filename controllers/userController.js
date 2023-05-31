const userModel = require('../models/userModel');

class UserController {
    async save(req, res) {
        try {
            let user = req.body;
            const max = await userModel.findOne({}).sort({ id: -1 });
            const newId = max === null ? 1 : max.id + 1;
            user.id = newId;
            const result = await userModel.create(user);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error saving user:', error);
            res.status(500).json({ error: 'Failed to save user.' });
        }
    }

    async list(req, res) {
        try {
            const result = await userModel.find({ isDeleted: false }, { isDeleted: 0, active: 0 });
            res.status(200).json(result);
        } catch (error) {
            console.error('Error listing users:', error);
            res.status(500).json({ error: 'Failed to retrieve users.' });
        }
    }

    async getById(req, res) {
        try {
            const id = req.params.id;
            const result = await userModel.findOne({ id, isDeleted: false }, { isDeleted: 0, active: 0 });
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

    async getByName(req, res) {
        try {
            const name = req.params.name;
            const nameASCII = name.replace(/[^\w\s]/gi, '').toUpperCase();
            const regex = new RegExp('^' + nameASCII, 'i');
            const result = await userModel.find({ name: { $regex: regex }, isDeleted: false }, { isDeleted: 0, active: 0 });
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: 'No users found.' });
            }
        } catch (error) {
            console.error('Error retrieving users by name:', error);
            res.status(500).json({ error: 'Failed to retrieve users.' });
        }
    }

    async getBySurname(req, res) {
        try {
            const surname = req.params.surname;
            const surnameASCII = surname.replace(/[^\w\s]/gi, '').toUpperCase();
            const regex = new RegExp('^' + surnameASCII, 'i');
            const result = await userModel.find({ surname: { $regex: regex }, isDeleted: false }, { isDeleted: 0, active: 0 });
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: 'No users found.' });
            }
        } catch (error) {
            console.error('Error retrieving users by surname:', error);
            res.status(500).json({ error: 'Failed to retrieve users.' });
        }
    }

    async getByCity(req, res) {
        try {
            const city = req.params.city;
            const cityASCII = city.replace(/[^\w\s]/gi, '').toUpperCase();
            const regex = new RegExp('^' + cityASCII, 'i');
            const result = await userModel.find({ city: { $regex: regex }, isDeleted: false }, { isDeleted: 0, active: 0 });
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: 'No users found in the specified city.' });
            }
        } catch (error) {
            console.error('Error retrieving users by city:', error);
            res.status(500).json({ error: 'Failed to retrieve users.' });
        }
    }

    async getByState(req, res) {
        try {
            const state = req.params.state;
            const stateASCII = state.replace(/[^\w\s]/gi, '').toUpperCase();
            const regex = new RegExp('^' + stateASCII, 'i');
            const result = await userModel.find({ state: { $regex: regex }, isDeleted: false }, { isDeleted: 0, active: 0 });
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: 'No users found in the specified state.' });
            }
        } catch (error) {
            console.error('Error retrieving users by state:', error);
            res.status(500).json({ error: 'Failed to retrieve users.' });
        }
    }

    async getActive(req, res) {
        try {
            const status = req.params.status === 'true';
            const result = await userModel.find({ active: status, isDeleted: false }, { isDeleted: 0, active: 0 });
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: 'No active users found.' });
            }
        } catch (error) {
            console.error('Error retrieving active users:', error);
            res.status(500).json({ error: 'Failed to retrieve active users.' });
        }
    }

    async getInactive(req, res) {
        try {
            const status = req.params.status === 'true';
            const result = await userModel.find({ active: !status, isDeleted: false }, { isDeleted: 0, active: 0 });
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: 'No inactive users found.' });
            }
        } catch (error) {
            console.error('Error retrieving inactive users:', error);
            res.status(500).json({ error: 'Failed to retrieve inactive users.' });
        }
    }


    async update(req, res) {
        try {
            const id = req.params.id;
            const user = await userModel.findOne({ id, isDeleted: false }, { isDeleted: 0, active: 0 });

            if (user) {
                await userModel.updateOne({ id }, req.body);
                const updatedUser = await userModel.findOne({ id, isDeleted: false }, { isDeleted: 0, active: 0 });
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
            const id = req.params.id;
            const user = await userModel.findOne({ id, isDeleted: false });

            if (user) {
                user.isDeleted = true;
                await user.save();
                res.status(200).send(`Successfully deleted the user with ID ${user.id} and name ${user.name}`);
            } else {
                res.status(404).json({ error: 'User not found.' });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Failed to delete user.' });
        }
    }

    //the code bellow delete the register from the database completely, wherease the code above simply hides it from all listings
    // async delete(req, res) {
    //     try {
    //         const id = req.params.id;
    //         const user = await userModel.findOne({ id });
    //         if (user) {
    //             await userModel.deleteOne({ id });
    //             res.status(200).send();
    //         } else {
    //             res.status(404).json({ error: 'User not found.' });
    //         }
    //     } catch (error) {
    //         console.error('Error deleting user:', error);
    //         res.status(500).json({ error: 'Failed to delete user.' });
    //     }
    // }
}

module.exports = new UserController();