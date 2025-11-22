import database from "infra/database";
import { ValidationError } from "infra/errors";

async function create(userInputValues) {
  await validateUniqueEmailOrUser(
    userInputValues.email,
    userInputValues.username,
  );

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueEmailOrUser(email, username) {
    const results = await database.query({
      text: `
      SELECT 
      email,
      username
      FROM
      users
      where
      LOWER(email) = LOWER($1)
      OR LOWER(username) = LOWER($2)
      ;`,
      values: [email, username],
    });
    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "Email ou nome de usuário já existe",
        action: "Use outro email ou nome de usuário para finalizar o cadastro",
      });
    }
  }

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
      INSERT INTO 
        users (username, email, password) 
      VALUES 
        ($1, $2, $3)
      RETURNING *
      ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return results.rows[0];
  }
}

const user = {
  create,
};

export default user;
