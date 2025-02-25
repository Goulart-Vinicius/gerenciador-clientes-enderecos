class DashboardController extends Controller {
  constructor() {
    super();
    this._view = new DashboardView("#root");
    this._clientModel = new ClientModel();
  }

  process() {
    try {
      this._view.render();
      this._setEvents();
      this._updateClientList();
    } catch (error) {
      console.error("Falha no processo de dashboard:", error);
    }
  }

  _setEvents() {
    this._setCreateClient();
    this._setAddressLink();
    this._setDashBoardLink();
    this._setCancelRegister();
    this._setUpdateClient();
    this._setDeleteButton();
    this._setAddressButton();
    this._setExportJson();
  }

  _setCreateClient() {
    $("#client-form").on("submit", async (e) => {
      e.preventDefault();
      const fullname = $("#fullname").val();
      const cpf = $("#cpf").val();
      const birthdate = $("#birthdate").val();
      const phone = $("#phone").val();
      const mobile = $("#mobile").val();

      if (!fullname || !cpf || !birthdate || !phone || !mobile) {
        alert("Todos os campos são obrigatórios.");
        return;
      }

      try {
        await this._clientModel.createClient({
          fullname,
          cpf,
          birthdate,
          phone,
          mobile,
        });

        alert("Cliente cadastrado com sucesso!");
        this._updateClientList();
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    });
  }

  _updateClientList() {
    this._clientModel.listClients().then((clients) => {
      const clientsList = $("#clients-list");
      clientsList.empty();
      clients.forEach((client) => {
        clientsList.append(`
          <tr>
            <td>${client.fullname}</td>
            <td>${client.cpf}</td>
            <td>${client.birthdate}</td>
            <td>${client.phone}</td>
            <td>${client.mobile}</td>
            <td>
              <button id="${client.id}" class="btn-edit btn btn-sm btn-warning edit-button">✏️</button>
            </td>
            <td>
              <button id="${client.id}" class="btn-delete btn btn-sm btn-danger delete-button">🗑️</button>
            </td>
            <td>
              <button id="${client.id}" class="btn-edit btn btn-sm btn-primary address-button">📌</button>
            </td>
          </tr>
        `);
      });
    });
    this._setEditButton();
  }

  _setAddressLink() {
    $("#navbar-address-link").on("click", () => {
      this._router.navigate("/address");
    });
  }

  _setDashBoardLink() {
    $("#navbar-dashboard-link").on("click", () => {
      this._router.navigate("/dashboard");
    });
  }

  _setCancelRegister() {
    $("#cancel_register").on("click", () => {
      $("#fullname").val("");
      $("#cpf").val("");
      $("#birthdate").val("");
      $("#phone").val("");
      $("#mobile").val("");
      $("#register_submit").removeClass("d-none");
      $("#update_submit").addClass("d-none");
    });
  }

  _setEditButton() {
    $("#clients-list").on("click", ".edit-button", async (e) => {
      const clientId = $(e.currentTarget).attr("id");

      try {
        const client = await this._clientModel.getClient(clientId);
        $("#fullname").val(client.fullname);
        $("#cpf").val(client.cpf);
        $("#birthdate").val(client.birthdate);
        $("#phone").val(client.phone);
        $("#mobile").val(client.mobile);

        $("#register_submit").addClass("d-none");
        $("#update_submit").removeClass("d-none");

        $("#update_submit").data("client-id", clientId);
      } catch (error) {
        console.error("Erro ao carregar informações do cliente:", error);
        alert("Erro ao carregar informações do cliente.");
      }
    });
  }

  _setAddressButton() {
    $("#clients-list").on("click", ".address-button", async (e) => {
      const clientId = $(e.currentTarget).attr("id");

      try {
        this._router.navigate(`/address/${clientId}`);
      } catch (error) {
        console.error("Erro ao carregar informações do cliente:", error);
        alert("Erro ao carregar informações do cliente.");
      }
    });
  }

  _setUpdateAddress() {
    $("#update_submit").on("click", async (e) => {
      e.preventDefault();

      try {
        const clientId = $(e.currentTarget).data("client-id");
        if (!clientId) throw new Error("ID do cliente não identificado");

        const updatedClient = this._getAndValidateFormData();

        await this._clientModel.updateClient(clientId, updatedClient);

        alert("Cliente atualizado com sucesso!");
        this._resetForm();
        this._updateClientList();
      } catch (error) {
        alert(error);
      }
    });
  }

  _resetForm() {
    $("#client-form")[0].reset();
    $("#register_submit").removeClass("d-none");
    $("#update_submit").addClass("d-none");
    $("#update_submit").removeData("client-id");
  }

  _setDeleteButton() {
    let clientIdToDelete = null;

    $("#clients-list").on("click", ".delete-button", (e) => {
      clientIdToDelete = $(e.currentTarget).attr("id");
      $("#deleteModal").modal("show");
    });

    $("#confirmDelete").on("click", async () => {
      if (clientIdToDelete) {
        try {
          await this._clientModel.deleteClient(clientIdToDelete);
          $("#deleteModal").modal("hide");
          this._resetForm();
          this._updateClientList();
        } catch (error) {
          console.error("Erro ao excluir cliente:", error);
          alert(error.message, "danger");
        }
        clientIdToDelete = null;
      }
    });
  }

  _setUpdateClient() {
    $("#update_submit").on("click", async (e) => {
      e.preventDefault();

      const clientId = $(e.currentTarget).data("client-id");

      const updatedClient = {
        fullname: $("#fullname").val(),
        cpf: $("#cpf").val(),
        birthdate: $("#birthdate").val(),
        phone: $("#phone").val(),
        mobile: $("#mobile").val(),
      };

      try {
        await this._clientModel.updateClient(clientId, updatedClient);
        alert("Cliente atualizado com sucesso!");
        this._resetForm();
        this._updateClientList();
      } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        alert(error.message);
      }
    });
  }

  _setExportJson() {
    $("#export-json").on("click", async () => {
      try {
        $("#export-json").prop("disabled", true).text("Exportando...");

        await DatabaseExporter.exportFullDatabase();

        alert("Exportação concluída com sucesso!");
      } catch (error) {
        console.error("Erro ao exportar dados:", error);
        alert("Erro ao exportar dados: " + error.message);
      } finally {
        $("#export-json").prop("disabled", false).text("Exportar JSON");
      }
    });
  }
}
