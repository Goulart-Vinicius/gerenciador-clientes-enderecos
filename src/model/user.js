class UserModel extends Model {
  constructor() {
    super("user_database");
  }

  initialize() {
    const savedData = localStorage.getItem(this.STORAGE_KEY);

    if (savedData) {
      alasql(`
        CREATE TABLE IF NOT EXISTS user (
          _id STRING,
          username STRING,
          email STRING,
          password STRING
        )
      `);
      alasql("INSERT INTO user SELECT * FROM ?", [JSON.parse(savedData)]);
    } else {
      alasql(`
        CREATE TABLE IF NOT EXISTS user (
          _id STRING PRIMARY KEY,
          username STRING,
          email STRING UNIQUE,
          password STRING
        )
      `);
    }
  }

  // Salva dados no LocalStorage
  async _saveToLocalStorage() {
    const data = await alasql.promise("SELECT * FROM user");
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  async create(userData) {
    try {
      const userId = userData._id || crypto.randomUUID();
      const existingUser = await this.findByEmail(userData.email);

      if (existingUser) {
        throw new Error("Email já cadastrado");
      }

      await alasql.promise(`INSERT INTO user VALUES (?, ?, ?, ?)`, [
        userId,
        userData.username,
        userData.email,
        userData.password,
      ]);

      await this._saveToLocalStorage();
      return this.findById(userId);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      await alasql.promise(
        `UPDATE user
         SET username = ?, email = ?, password = ?
         WHERE _id = ?`,
        [updateData.username, updateData.email, updateData.password, id]
      );

      await this._saveToLocalStorage();
      return this.findById(id);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await alasql.promise("DELETE FROM user WHERE _id = ?", [id]);
      await this._saveToLocalStorage();
      return true;
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      throw error;
    }
  }

  // FindByCPF
  async findByCpf(cpf) {
    debugger;
    try {
      const formattedCpf = this._formatCpf(cpf);
      const result = await alasql.promise("SELECT * FROM user WHERE cpf = ?", [
        formattedCpf,
      ]);
      return result[0] || null;
    } catch (error) {
      console.error("Erro ao buscar por CPF:", error);
      throw error;
    }
  }
  // FindByEmail
  async findByEmail(email) {
    try {
      const result = await alasql.promise(
        "SELECT * FROM user WHERE email = ?",
        [email]
      );
      return result[0] || null;
    } catch (error) {
      console.error("Erro ao buscar por email:", error);
      throw error;
    }
  }

  // findById
  async findById(id) {
    try {
      const result = await alasql.promise("SELECT * FROM user WHERE _id = ?", [
        id,
      ]);
      return result[0] || null;
    } catch (error) {
      console.error("Erro ao buscar por ID:", error);
      throw error;
    }
  }

  // LOGIN
  async login(username, password) {
    try {
      const result = await alasql.promise(
        "SELECT * FROM user WHERE username = ? AND password = ?",
        [username, password]
      );
      return result[0] || null;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const result = await alasql.promise("SELECT * FROM user");
      return result;
    } catch (error) {
      console.error("Erro ao buscar todos os usuários:", error);
      throw error;
    }
  }

  async populate(users) {
    $.each(users, function (index, user) {
      var exists = alasql("SELECT * FROM user WHERE _id = ?", [user._id]);
      if (exists.length === 0) {
        alasql("INSERT INTO user VALUES (?, ?, ?, ?)", [
          user._id,
          user.username,
          user.email,
          user.password,
        ]);
      } else {
        alasql(
          "UPDATE user SET username = ?, email = ?, password = ? WHERE _id = ?",
          [user.username, user.email, user.password, user._id]
        );
      }
    });
    await this._saveToLocalStorage();
  }
}
