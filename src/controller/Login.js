class LoginController extends Controller {
  constructor() {
    super();
    this._view = new LoginView("#root");
    this._user = new UserModel();
  }

  process() {
    try {
      this._view.render();
      this._setEvents();
    } catch (error) {
      console.error("Falha no processo de login:", error);
    }
  }

  _setEvents() {
    this._setLoginSubmit();
    this._setRegisterInput();
    this._setDatabaseUpload();
  }

  _setLoginSubmit() {
    $("#form-login").on("submit", async (e) => {
      e.preventDefault();
      const username = $("#username-login-input").val();
      const password = $("#password-login-input").val();

      if (!username || !password) {
        alert("Todos os campos são obrigatórios.");
        return;
      }

      const user = await this._user.login(username, password);

      if (!user) {
        alert("Usuário ou senha incorretos.");
        return;
      }

      console.log("Login bem-sucedido");

      this._router.navigate("/dashboard");
    });
  }

  _setRegisterInput() {
    $("#register-input").on("click", (e) => {
      e.preventDefault();
      this._router.navigate("/register");
    });
  }

  _setDatabaseUpload() {
    var settingsLink = $("#settings-upload-link");
    var fileInput = $("#database-upload-modal-input");
    var confirmUploadButton = $("#confirmUpload");

    if (settingsLink.length && fileInput.length && confirmUploadButton.length) {
      settingsLink.on("click", function (e) {
        e.preventDefault();
        $("#configModal").modal("show");
      });

      confirmUploadButton.on("click", function () {
        var file = fileInput.prop("files")[0];
        if (!file) {
          alert("Por favor, selecione um arquivo.");
          return;
        }

        if (!file.name.endsWith(".json")) {
          alert("Por favor, selecione um arquivo JSON válido (.json).");
          return;
        }

        confirmUploadButton.text("Carregando...");
        confirmUploadButton.prop("disabled", true);

        var reader = new FileReader();

        reader.onload = function (e) {
          try {
            var data = JSON.parse(e.target.result);

            if (data.clients) {
              const clientModal = new ClientModel();
              clientModal.populate(data.clients);
            }

            // Pré-popula a tabela de usuários
            if (data.users) {
              const userModel = new UserModel();
              userModel.populate(data.users);
            }

            // Pré-popula a tabela de endereços
            if (data.addresses) {
              const addressModel = new AddressModel();
              addressModel.populate(data.addresses);
            }

            alert("Dados pré-populados com sucesso!");
            $("#configModal").modal("hide");
          } catch (error) {
            console.error("Erro ao processar o arquivo JSON:", error);
            alert(
              "Erro ao processar o arquivo JSON. Verifique se o formato está correto."
            );
          } finally {
            confirmUploadButton.text("Carregar");
            confirmUploadButton.prop("disabled", false);
          }
        };

        reader.onerror = function (error) {
          console.error("Erro na leitura do arquivo:", error);
          alert("Falha ao ler o arquivo. Tente novamente.");
          confirmUploadButton.text("Carregar");
          confirmUploadButton.prop("disabled", false);
        };

        reader.readAsText(file);
      });
    }
  }
}
