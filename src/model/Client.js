class ClientModel extends Model {
  constructor() {
    super("client_database");
    this.initialize();
  }

  initialize() {
    alasql("DROP TABLE IF EXISTS clients");

    alasql(`
      CREATE TABLE clients (
        id STRING PRIMARY KEY,
        fullname STRING,
        cpf STRING UNIQUE,
        birthdate DATE,
        phone STRING,
        mobile STRING
      )
    `);

    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      const clients = JSON.parse(savedData);
      clients.forEach((client) => {
        alasql("INSERT INTO clients VALUES (?, ?, ?, ?, ?, ?)", [
          client.id,
          client.fullname,
          client.cpf,
          client.birthdate,
          client.phone,
          client.mobile,
        ]);
      });
    }
  }

  async _saveToLocalStorage() {
    try {
      const data = await alasql.promise("SELECT * FROM clients");
      if (data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.error("Erro ao salvar dados no LocalStorage:", error);
      throw error;
    }
  }

  _formatCpf(cpf) {
    return cpf.replace(/\D/g, "");
  }

  _formatPhone(phone) {
    return phone.replace(/\D/g, "");
  }

  _validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  _validateBirthdate(birthdate) {
    const birthDate = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      throw new Error("Cliente deve ter mais de 18 anos.");
    }
  }

  async createClient(client) {
    try {
      if (
        !client.fullname ||
        !client.cpf ||
        !client.birthdate ||
        !client.phone ||
        !client.mobile
      ) {
        throw new Error("Todos os campos são obrigatórios.");
      }

      const formattedCpf = this._formatCpf(client.cpf);
      const formattedPhone = this._formatPhone(client.phone);
      const formattedMobile = this._formatPhone(client.mobile);

      if (!this._validateCPF(formattedCpf)) {
        throw new Error("CPF inválido.");
      }

      this._validateBirthdate(client.birthdate);

      const existing = await this.getClientByCPF(formattedCpf);
      if (existing) {
        throw new Error("CPF já cadastrado.");
      }

      const id = crypto.randomUUID();

      await alasql.promise(`INSERT INTO clients VALUES (?, ?, ?, ?, ?, ?)`, [
        id,
        client.fullname,
        formattedCpf,
        client.birthdate,
        formattedPhone,
        formattedMobile,
      ]);

      await this._saveToLocalStorage();
      return this.getClient(id);
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw error;
    }
  }

  async getClient(id) {
    try {
      const result = await alasql.promise(
        "SELECT * FROM clients WHERE id = ?",
        [id]
      );
      return result[0] || null;
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      throw error;
    }
  }

  async getClientByCPF(cpf) {
    try {
      const formattedCpf = this._formatCpf(cpf);
      const result = await alasql.promise(
        "SELECT * FROM clients WHERE cpf = ?",
        [formattedCpf]
      );
      return result[0] || null;
    } catch (error) {
      console.error("Erro ao buscar cliente por CPF:", error);
      throw error;
    }
  }

  async listClients() {
    try {
      return await alasql.promise("SELECT * FROM clients");
    } catch (error) {
      console.error("Erro ao listar clientes:", error);
      throw error;
    }
  }
  async updateClient(id, newData) {
    try {
      const originalInfos = await this.getClient(id);
      if (!id) throw new Error("ID do cliente não informado.");

      const formattedCpf = newData.cpf
        ? this._formatCpf(newData.cpf)
        : originalInfos.cpf;

      if (newData.cpf && !this._validateCPF(formattedCpf)) {
        throw new Error("CPF inválido.");
      }
      if (newData.birthdate) {
        this._validateBirthdate(newData.birthdate);
      }

      if (newData.cpf && this._formatCpf(originalInfos.cpf) !== formattedCpf) {
        const existing = await this.getClientByCPF(formattedCpf);
        if (existing) {
          throw new Error("CPF já cadastrado para outro cliente.");
        }
      }

      const formattedPhone = newData.phone
        ? this._formatPhone(newData.phone)
        : originalInfos.phone;
      const formattedMobile = newData.mobile
        ? this._formatPhone(newData.mobile)
        : originalInfos.mobile;

      const updates = [];
      const params = [];

      if (newData.fullname) {
        updates.push("fullname = ?");
        params.push(newData.fullname);
      }
      if (newData.cpf) {
        updates.push("cpf = ?");
        params.push(formattedCpf);
      }
      if (newData.birthdate) {
        updates.push("birthdate = ?");
        params.push(newData.birthdate);
      }
      if (newData.phone) {
        updates.push("phone = ?");
        params.push(formattedPhone);
      }
      if (newData.mobile) {
        updates.push("mobile = ?");
        params.push(formattedMobile);
      }

      if (updates.length === 0) {
        throw new Error("Nenhum campo para atualizar.");
      }

      params.push(id);

      await alasql.promise(
        `UPDATE clients SET ${updates.join(", ")} WHERE id = ?`,
        params
      );

      await this._saveToLocalStorage();
      return this.getClient(id);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      throw error;
    }
  }

  async deleteClient(id) {
    try {
      if (!id) throw new Error("ID do cliente não informado.");
      await alasql.promise("DELETE FROM clients WHERE id = ?", [id]);
      await this._saveToLocalStorage();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      throw error;
    }
  }

  async populate(clients){

      $.each(clients, function (index, client) {
        var exists = alasql("SELECT * FROM clients WHERE id = ?", [
          client.id,
        ]);
        if (exists.length === 0) {
          alasql("INSERT INTO clients VALUES (?, ?, ?, ?, ?, ?)", [
            client.id,
            client.fullname,
            client.cpf,
            client.birthdate,
            client.phone,
            client.mobile,
          ]);
        } else {
          // Atualiza os dados existentes
          alasql(
            "UPDATE clients SET fullname = ?, cpf = ?, birthdate = ?, phone = ?, mobile = ? WHERE id = ?",
            [
              client.fullname,
              client.cpf,
              client.birthdate,
              client.phone,
              client.mobile,
              client.id,
            ]
          );
        }
      });
      await this._saveToLocalStorage();
  }
}
