class AddressModel extends Model {
  constructor() {
    super("address_database");
  }

  initialize() {
    alasql("DROP TABLE IF EXISTS addresses");

    alasql(`
      CREATE TABLE addresses (
        id STRING PRIMARY KEY,
        clientId STRING,
        zipCode STRING,
        street STRING,
        neighborhood STRING,
        city STRING,
        state STRING,
        country STRING,
        isMain BOOLEAN
      )
    `);

    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      const addresses = JSON.parse(savedData);
      addresses.forEach((address) => {
        alasql("INSERT INTO addresses VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
          address.id,
          address.clientId,
          address.zipCode,
          address.street,
          address.neighborhood,
          address.city,
          address.state,
          address.country,
          address.isMain,
        ]);
      });
    }
  }

  async _saveToLocalStorage() {
    const data = await alasql.promise("SELECT * FROM addresses");
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  async createAddress(addressData) {
    try {
      if (
        !addressData.clientId ||
        !addressData.zipCode ||
        !addressData.street ||
        !addressData.neighborhood ||
        !addressData.city ||
        !addressData.state ||
        !addressData.country
      ) {
        throw new Error("Todos os campos são obrigatórios.");
      }

      const id = crypto.randomUUID();

      await alasql.promise(
        `INSERT INTO addresses VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          addressData.clientId,
          addressData.zipCode,
          addressData.street,
          addressData.neighborhood,
          addressData.city,
          addressData.state,
          addressData.country,
          addressData.isMain,
        ]
      );

      if (addressData.isMain) {
        await alasql.promise(
          `UPDATE addresses SET isMain = false WHERE clientId = ? AND id != ?`,
          [addressData.clientId, id]
        );
      }

      await this._saveToLocalStorage();

      return this.getAddress(id);
    } catch (error) {
      console.error("Erro ao criar endereço:", error);
      throw error;
    }
  }

  async getAddress(id) {
    try {
      const result = await alasql.promise(
        "SELECT * FROM addresses WHERE id = ?",
        [id]
      );
      return result[0] || null;
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      throw error;
    }
  }

  async listAddressesByClient(clientId) {
    try {
      return await alasql.promise(
        "SELECT * FROM addresses WHERE clientId = ?",
        [clientId]
      );
    } catch (error) {
      console.error("Erro ao listar endereços:", error);
      throw error;
    }
  }

  async getAddressesByClientId(clientId) {
    try {
      const result = await alasql.promise(
        "SELECT * FROM addresses WHERE clientId = ?",
        [clientId]
      );
      return result;
    } catch (error) {
      console.error("Erro ao buscar endereços por clientId:", error);
      throw error;
    }
  }

  async getAllAddresses() {
    try {
      const result = await alasql.promise("SELECT * FROM addresses");
      return result;
    } catch (error) {
      console.error("Erro ao buscar todos os endereços:", error);
      throw new Error("Falha ao carregar lista de endereços");
    }
  }

  async unsetMainAddress(id) {
    try {
      const address = await this.getAddress(id);
      if (!address) throw new Error("Endereço não encontrado.");

      await alasql.promise(
        `UPDATE addresses SET isMain = false WHERE clientId = ? AND id != ?`,
        [address.clientId, id]
      );

      await alasql.promise(`UPDATE addresses SET isMain = true WHERE id = ?`, [
        id,
      ]);

      await this._saveToLocalStorage();
      return true;
    } catch (error) {
      console.error("Erro ao definir endereço principal:", error);
      throw error;
    }
  }

  async exportToJSON() {
    try {
      const data = await alasql.promise("SELECT * FROM addresses");
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      throw error;
    }
  }

  async updateAddress(id, addressData) {
    try {
      const existingAddress = await this.getAddress(id);
      if (!existingAddress) {
        throw new Error("Endereço não encontrado");
      }

      const mergedData = {
        ...existingAddress,
        ...addressData,
        id,
      };

      if (
        !mergedData.clientId ||
        !mergedData.zipCode ||
        !mergedData.street ||
        !mergedData.neighborhood ||
        !mergedData.city ||
        !mergedData.state ||
        !mergedData.country
      ) {
        throw new Error("Todos os campos são obrigatórios.");
      }

      if (mergedData.isMain) {
        await this.unsetMainAddress(id);
      }

      await alasql.promise(
        `UPDATE addresses SET
          clientId = ?,
          zipCode = ?,
          street = ?,
          neighborhood = ?,
          city = ?,
          state = ?,
          country = ?,
          isMain = ?
         WHERE id = ?`,
        [
          mergedData.clientId,
          mergedData.zipCode,
          mergedData.street,
          mergedData.neighborhood,
          mergedData.city,
          mergedData.state,
          mergedData.country,
          mergedData.isMain,
          id,
        ]
      );

      await this._saveToLocalStorage();

      return this.getAddress(id);
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      throw error;
    }
  }
  async deleteAddress(id) {
    try {
      const address = await this.getAddress(id);
      if (!address) {
        throw new Error("Endereço não encontrado");
      }

      await alasql.promise("DELETE FROM addresses WHERE id = ?", [id]);

      if (address.isMain) {
        const remaining = await this.listAddressesByClient(address.clientId);
        if (remaining.length > 0) {
          await this.setMainAddress(remaining[0].id);
        }
      }

      await this._saveToLocalStorage();
      return true;
    } catch (error) {
      console.error("Erro ao excluir endereço:", error);
      throw error;
    }
  }

  async populate(addresses) {
    $.each(addresses, function (index, address) {
      var exists = alasql("SELECT * FROM addresses WHERE id = ?", [address.id]);
      if (exists.length === 0) {
        alasql("INSERT INTO addresses VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
          address.id,
          address.clientId,
          address.zipCode,
          address.street,
          address.neighborhood,
          address.city,
          address.state,
          address.country,
          address.isMain,
        ]);
      } else {
        alasql(
          "UPDATE addresses SET clientId = ?, zipCode = ?, street = ?, neighborhood = ?, city = ?, state = ?, country = ?, isMain = ? WHERE id = ?",
          [
            address.clientId,
            address.zipCode,
            address.street,
            address.neighborhood,
            address.city,
            address.state,
            address.country,
            address.isMain,
            address.id,
          ]
        );
      }
    });
    await this._saveToLocalStorage();
  }
}
