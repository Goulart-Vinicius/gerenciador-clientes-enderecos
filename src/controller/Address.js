class AddressController extends Controller {
  constructor() {
    super();
    this._view = new AddressView("#root");
    this._addressModel = new AddressModel();
    this._clientModel = new ClientModel();
    this._showAllregisters = false;
  }

  process(params) {
    const { clientId } = params;
    this._view.render();
    this._loadAddresses(clientId);
    this._setEvents();
  }

  _setEvents() {
    this._setAddressLink();
    this._setDashBoardLink();
    this._setAddressSubmit();
    this._setCancelRegister();
    this._setEditButton();
    this._setUpdateAddress();
    this._setDeleteButton();
    this._setExportJson();
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

  async _loadAddresses(clienteId) {
    try {
      let addresses;
      let client = null;

      if (clienteId) {
        client = await this._clientModel.getClient(clienteId).catch(() => null);

        if (!client) {
          alert("Cliente não encontrado");
          $(".register-address").hide();
          return;
        }

        addresses = await this._addressModel.getAddressesByClientId(clienteId);

        $("#client-name").text(client.fullname);
        $(".register-address").show().data("client-id", clienteId);
        this._showAllregisters = false;
      } else {
        addresses = await this._addressModel.getAllAddresses();
        $("#client-name").text("Todos os Clientes");
        $(".register-address").hide();
        this._showAllregisters = true;
      }

      if (addresses.length === 0) {
        $("#address-list").html(
          '<tr><td colspan="6" class="text-center">Nenhum endereço encontrado</td></tr>'
        );
      } else {
        this._updateAddressList(addresses);
      }
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
      alert("Falha ao carregar endereços");
      $("#address-list").html(
        '<tr><td colspan="6" class="text-center text-danger">Erro ao carregar dados</td></tr>'
      );
    }
  }

  _updateAddressList(addresses) {
    const addressList = $("#address-list");
    addressList.empty();

    addresses.forEach((address) => {
      $(`
        <tr>
          <td>${address.zipCode}</td>
          <td>${address.street}</td>
          <td>${address.neighborhood}</td>
          <td>${address.city}</td>
          <td>${address.state}</td>
          <td>${address.country}</td>
          <td>${address.isMain ? "Sim" : "Não"}</td>
          <td>
            <button class="btn-edit btn btn-sm btn-warning edit-button" data-id="${
              address.id
            }">✏️</button>
          </td>
          <td>
            <button class="btn-delete btn btn-sm btn-danger delete-button" data-address-id="${
              address.id
            }" data-client-id="${address.clientId}">🗑️</button>
          </td>
        </tr>
      `).appendTo("#address-list");
    });
    this._setEditButton();
  }

  _setAddressSubmit() {
    $(document).on("submit", ".register-address", async (e) => {
      try {
        const clientId = $(e.currentTarget).data("client-id");

        if (!clientId) {
          alert("Cliente não identificado");
          return;
        }

        const addressData = {
          zipCode: $("#zipCode").val().trim(),
          street: $("#street").val().trim(),
          neighborhood: $("#neighborhood").val().trim(),
          city: $("#city").val().trim(),
          state: $("#state").val().trim(),
          country: $("#country").val().trim(),
          isMain: $("#is-main").is(":checked"),
        };

        if (!this._validateAddress(addressData)) {
          return;
        }

        await this._addressModel.createAddress({ clientId, ...addressData });

        alert("Endereço cadastrado com sucesso!");
        this._loadAddresses(clientId);
        this._resetAddressForm();
      } catch (error) {
        console.error("Erro ao salvar endereço:", error);
        alert(error.message || "Erro ao salvar endereço");
      }
    });
  }

  _validateAddress(data) {
    const requiredFields = [
      "zipCode",
      "street",
      "neighborhood",
      "city",
      "state",
      "country",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      alert(`Campos obrigatórios: ${missingFields.join(", ")}`);
      return false;
    }

    if (!/^\d{5}-?\d{3}$/.test(data.zipCode)) {
      alert("CEP inválido");
      return false;
    }

    return true;
  }

  _setEditButton() {
    $("#address-list").on("click", ".edit-button", async (e) => {
      try {
        const addressId = $(e.currentTarget).data("id");
        const address = await this._addressModel.getAddress(addressId);

        if (!address) {
          alert("Endereço não encontrado");
          return;
        }

        $("#zipCode").val(address.zipCode);
        $("#street").val(address.street);
        $("#neighborhood").val(address.neighborhood);
        $("#city").val(address.city);
        $("#state").val(address.state);
        $("#country").val(address.country);
        $("#is-main").prop("checked", address.isMain);

        $("#register_submit").addClass("d-none");
        $("#update_submit").removeClass("d-none");

        $(".register-address").show().data("client-id", address.clienteId);

        $("#update_submit").data("address-id", addressId);
      } catch (error) {
        console.error("Erro ao carregar endereço:", error);
        alert("Erro ao carregar dados do endereço");
      }
    });
  }

  _resetAddressForm() {
    $("#address-form")[0].reset();
    $("#principal").prop("checked", false);
  }

  _setCancelRegister() {
    $("#cancel_register").on("click", () => {
      $("#zipCode").val("");
      $("#street").val("");
      $("#neighborhood").val("");
      $("#city").val("");
      $("#state").val("");
      $("#country").val("");
      $("#isMain").val("");
      $("#register_submit").removeClass("d-none");
      $("#update_submit").addClass("d-none");
      if (this._showAllregisters) {
        $(".register-address").hide();
      }
    });
  }

  _setUpdateAddress() {
    $("#update_submit").on("click", async (e) => {
      e.preventDefault();

      const addressid = $(e.currentTarget).data("address-id");

      const Address = {
        zipCode: $("#zipCode").val().trim(),
        street: $("#street").val().trim(),
        neighborhood: $("#neighborhood").val().trim(),
        city: $("#city").val().trim(),
        state: $("#state").val().trim(),
        country: $("#country").val().trim(),
        isMain: $("#is-main").prop("checked"),
      };

      try {
        const updatedAddress = await this._addressModel.updateAddress(
          addressid,
          Address
        );
        alert("Endereço atualizado com sucesso!");
        this._resetForm();
        const addresses = await this._addressModel.getAddressesByClientId(
          updatedAddress.clientId
        );
        this._updateAddressList(addresses);
        if (this._showAllregisters) {
          $(".register-address").hide();
        }
      } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        alert(error.message);
      }
    });
  }

  _resetForm() {
    $("#address-form")[0].reset();
    $("#register_submit").removeClass("d-none");
    $("#update_submit").addClass("d-none");
    $("#update_submit").removeData("client-id");
  }

  _setDeleteButton() {
    const deleteModal = $("#deleteModal");

    $("#address-list").on("click", ".delete-button", (e) => {
      const button = $(e.currentTarget);
      deleteModal
        .data({
          addressId: button.data("address-id"),
          clientId: button.data("client-id"),
        })
        .modal("show");
    });

    deleteModal.on("click", "#confirmDelete", async () => {
      const { addressId, clientId } = deleteModal.data();

      if (!addressId || !clientId) return;

      try {
        deleteModal.find(".modal-content").addClass("loading");

        await this._addressModel.deleteAddress(addressId);

        const addresses = await this._addressModel.getAddressesByClientId(
          clientId
        );
        this._updateAddressList(addresses);

        alert("Endereço excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir endereço:", error);
        aler(error.message);
      } finally {
        deleteModal
          .removeData()
          .modal("hide")
          .find(".modal-content")
          .removeClass("loading");
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
