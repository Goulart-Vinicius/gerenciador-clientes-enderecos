// helper/DatabaseExporter.js
class DatabaseExporter {
  static async exportFullDatabase() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

      const userModel = new UserModel();
      const clientModel = new ClientModel();
      const addressModel = new AddressModel();

      const [users, clients, addresses] = await Promise.all([
        userModel.getAllUsers(),
        clientModel.listClients(),
        addressModel.getAllAddresses(),
      ]);

      const data = {
        users,
        clients,
        addresses,
      };

      // Criar objeto de download
      this._triggerDownload(
        JSON.stringify(data, null, 2),
        `database-export-${timestamp}.json`
      );

      return true;
    } catch (error) {
      console.error("Erro na exportação:", error);
      throw new Error("Falha na exportação do banco de dados");
    }
  }

  static _triggerDownload(data, filename) {
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Limpeza
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
