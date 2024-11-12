const userSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password", "createdAt", "updatedAt"],
      properties: {
        name: {
          bsonType: "string",
          description: "Name - required string between 2 and 50 characters",
          minLength: 2,
          maxLength: 50,
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description:
            "Email address - required and must be valid email format",
        },
        password: {
          bsonType: "string",
          description: "Hashed password - required",
          minLength: 6,
        },
        createdAt: {
          bsonType: "date",
          description: "Date when the user was created",
        },
        updatedAt: {
          bsonType: "date",
          description: "Date when the user was last updated",
        },
      },
    },
  },
  validationAction: "error",
  validationLevel: "strict",
};


export default userSchema;
