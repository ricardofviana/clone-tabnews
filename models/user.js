import database from "infra/database";
import { ValidationError, NotFoundError } from "infra/errors";

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);

  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
      SELECT
        *
      FROM
        users
      where
        LOWER(username) = LOWER($1)
      LIMIT 
        1
      ;`,
      values: [username],
    });
    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique o username e tente novamente",
      });
    }
    return results.rows[0];
  }
}

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
  findOneByUsername,
};

export default user;
