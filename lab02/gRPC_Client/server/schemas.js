const UserSchema = {
    username: {
        in: ['body'],
        errorMessage: 'Username is wrong',
        isString: true
    },
    password: {
        in: ['body'],
        errorMessage: 'Password is wrong',
        isString: true,
        isLength: {
            errorMessage: 'Password should be at least 6 chars long and at most 20 characters',
            // Multiple options would be expressed as an array
            options: { min: 6, max: 20 }
        }
    }
};

const TaskSchema = {
    description: {
        in: ['body'],
        notEmpty: true,
        isString: true,
        isLength: {
            errorMessage: "Description should be at most 160 characters long",
            options: { max: 160 }
        },
        errorMessage: "Invalid format of description field"
    },
    important: {
        in: ['body'],
        isBoolean: true,
        errorMessage: "Invalid format of important field"
    },
    private: {
        in: ['body'],
        isBoolean: true,
        // options: (value, { req, location, path }) => {
        //     let sanitizedValue;

        //     if (value === true)
        //         sanitizedValue = 1;
        //     else if (value === false)
        //         sanitizedValue = 0
        //     else
        //         throw new Error("Invalid value of private fields")
        // },
        errorMessage: "Invalid format of private field"
    },
    project: {
        in: ['body'],
        errorMessage: "Invalid format of projects field",
        custom: {
            options: (value, { req, location, path }) => {
                console.log("Value:", value);
                const values = ['Personal', 'WA1_Project', 'WA2_Project', 'DSP_Project']
                if (values.filter(v => value === v)[0].length !== 0) return true;
                else throw new Error("Wrong values for projects field");
            },
        },


    },
    deadline: {
        in: ['body'],
        isString: true,
        errorMessage: "Invalid format of deadline"
    },

}

module.exports = { UserSchema, TaskSchema }